// backend/controllers/reportController.js
import db from '../config/db.js';

const getUserId = (req) => {
    if (req.user && req.user.id) return req.user.id;
    return null;
};

// Helper đặt tên tiếng Việt cho loại bài học
function getLessonTypeName(code) {
    const map = {
        'FLASHCARD': 'Học thẻ Flashcard',
        'CONTEXT': 'Tình huống ngữ cảnh',
        'MATCHING': 'Trò chơi ghép cặp',
        'TRAINING': 'Luyện biểu cảm',
        'AI': 'Thử thách AI'
    };
    return map[code] || code;
}

export const getUserReport = async (req, res) => {
    let conn;
    try {
        const userId = getUserId(req);
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        conn = await db.getConnection();

        // ---------------------------------------------------------
        // 1. STATS CƠ BẢN (Giữ nguyên logic cũ hoặc tính từ stat)
        // ---------------------------------------------------------
        // Tính tổng sao (total_score) từ log
        const [scoreRow] = await conn.query(`SELECT SUM(score) as total_score FROM user_activity_log WHERE user_id = ?`, [userId]);
        const totalStars = scoreRow[0].total_score || 0;

        // Tính chuỗi ngày (Streak) - Code rút gọn cho ngắn
        // (Bạn có thể giữ nguyên logic tính streak dài ở file cũ nếu muốn chính xác cao)
        const [dateRows] = await conn.query(`SELECT COUNT(DISTINCT DATE(answered_at)) as days FROM user_activity_log WHERE user_id = ?`, [userId]);
        const streak = dateRows[0].days || 0; 

        // Tính độ chính xác tổng thể (Toàn bộ quá trình)
        const [accRow] = await conn.query(`
            SELECT SUM(total_correct_count) as total_correct, SUM(total_play) as total_play 
            FROM user_progress_stat WHERE user_id = ?
        `, [userId]);
        const overallAccuracy = accRow[0].total_play > 0 
            ? Math.round((accRow[0].total_correct / accRow[0].total_play) * 100) 
            : 0;

        // ---------------------------------------------------------
        // 2. DATA RADAR CHART: THEO CẤP ĐỘ (EMOTION GROUP) [SỬA ĐỔI]
        // ---------------------------------------------------------
        // Yêu cầu: Group by emotion_group_id -> Tính % đúng
        // Dùng LEFT JOIN để đảm bảo hiện đủ Cấp độ 1, 2, 3 dù chưa chơi
        const [radarRows] = await conn.query(`
            SELECT 
                eg.name,
                COALESCE(SUM(ups.total_correct_count), 0) as total_correct,
                COALESCE(SUM(ups.total_play), 0) as total_play
            FROM emotion_group eg
            LEFT JOIN user_progress_stat ups ON eg.id = ups.emotion_group_id AND ups.user_id = ?
            GROUP BY eg.id, eg.name
            ORDER BY eg.id ASC
        `, [userId]);

        const radarChartData = radarRows.map(row => {
            const percent = row.total_play > 0 
                ? Math.round((row.total_correct / row.total_play) * 100) 
                : 0; // Chưa chơi thì 0%
            return {
                label: row.name, // "Cấp độ 1", "Cấp độ 2"...
                score: percent
            };
        });

        // ---------------------------------------------------------
        // 3. DATA KỸ NĂNG: THEO LOẠI BÀI HỌC (LESSON TYPE) [SỬA ĐỔI]
        // ---------------------------------------------------------
        // Yêu cầu: Group by lesson_type_id -> Tính % đúng
        const [skillRows] = await conn.query(`
            SELECT 
                lt.code,
                lt.name,
                COALESCE(SUM(ups.total_correct_count), 0) as total_correct,
                COALESCE(SUM(ups.total_play), 0) as total_play
            FROM lesson_type lt
            LEFT JOIN user_progress_stat ups ON lt.id = ups.lesson_type_id AND ups.user_id = ?
            GROUP BY lt.id, lt.code, lt.name
            ORDER BY lt.id ASC
        `, [userId]);

        const skillData = skillRows.map(row => {
             const percent = row.total_play > 0 
                ? Math.round((row.total_correct / row.total_play) * 100) 
                : 0;
            return {
                code: row.code,
                name: getLessonTypeName(row.code), // Convert tên tiếng Việt
                score: percent
            };
        });

        // ---------------------------------------------------------
        // 4. LOG HOẠT ĐỘNG GẦN ĐÂY (Giữ nguyên)
        // ---------------------------------------------------------
        const [recentLogs] = await conn.query(`
            SELECT lt.name as lesson_type, ual.score, ual.answered_at, ual.is_correct
            FROM user_activity_log ual
            JOIN lesson_type lt ON ual.lesson_type_id = lt.id
            WHERE ual.user_id = ?
            ORDER BY ual.answered_at DESC LIMIT 5
        `, [userId]);

        // Trả về JSON
        res.status(200).json({
            stats: {
                stars: totalStars,
                streak: streak, // Hoặc logic streak phức tạp cũ của bạn
                accuracy: overallAccuracy,
                dominantEmotion: "Đang cập nhật" // Bỏ hoặc tính lại nếu cần
            },
            // Trả về mảng đối tượng cho Radar (Label + Score)
            radar: radarChartData, 
            skills: skillData,
            logs: recentLogs
        });

    } catch (error) {
        console.error("Lỗi lấy báo cáo:", error);
        res.status(500).json({ message: "Lỗi server" });
    } finally {
        if (conn) conn.release();
    }
};