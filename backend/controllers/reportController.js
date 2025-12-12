// backend/controllers/reportController.js
import db from '../config/db.js';

const getUserId = (req) => {
    if(req.user.id){
        return req.user.id;
    }
    else {
        console.log(`khong có token`)
        return 1;
    }
};

export const getUserReport = async (req, res) => {
    const conn = await db.getConnection();
    try {
        const userId = getUserId(req);

        // 1. Tổng số sao (Giả sử mỗi câu đúng/bài hoàn thành = 5 sao)
        // Ta tính tổng số lần đúng từ log
        const [starRows] = await conn.query(`
            SELECT SUM(is_correct) as total_correct 
            FROM user_activity_log 
            WHERE user_id = ?
        `, [userId]);
        const totalStars = (starRows[0].total_correct || 0) * 5;

        // 2. Chuỗi ngày liên tiếp (Streak)
        // Query các ngày user có hoạt động (distinct date), sắp xếp giảm dần
        const [dateRows] = await conn.query(`
            SELECT DISTINCT DATE(answered_at) as play_date 
            FROM user_activity_log 
            WHERE user_id = ? 
            ORDER BY play_date DESC
        `, [userId]);

        let streak = 0;
        if (dateRows.length > 0) {
            const today = new Date();
            const lastPlayDate = new Date(dateRows[0].play_date);
            
            // Kiểm tra nếu chơi hôm nay hoặc hôm qua thì mới tính chuỗi
            const diffTime = Math.abs(today - lastPlayDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            
            if (diffDays <= 2) { // 1 là hôm nay, 2 là hôm qua (do làm tròn)
                streak = 1;
                for (let i = 0; i < dateRows.length - 1; i++) {
                    const d1 = new Date(dateRows[i].play_date);
                    const d2 = new Date(dateRows[i+1].play_date);
                    const diff = (d1 - d2) / (1000 * 3600 * 24);
                    if (diff === 1) streak++;
                    else break;
                }
            }
        }

        // 3. Độ chính xác & Cảm xúc chủ đạo
        // Tính tổng đúng / tổng chơi
        const [accuracyRow] = await conn.query(`
            SELECT 
                COUNT(*) as total_attempts,
                SUM(is_correct) as correct_attempts
            FROM user_activity_log
            WHERE user_id = ?
        `, [userId]);
        
        const accuracy = accuracyRow[0].total_attempts > 0 
            ? Math.round((accuracyRow[0].correct_attempts / accuracyRow[0].total_attempts) * 100) 
            : 0;

        // Cảm xúc làm đúng nhiều nhất (Dominant Emotion)
        const [domEmoRow] = await conn.query(`
            SELECT e.name, COUNT(*) as cnt
            FROM user_activity_log ual
            JOIN emotion e ON ual.chosen_emotion_id = e.id
            WHERE ual.user_id = ? AND ual.is_correct = 1
            GROUP BY e.name
            ORDER BY cnt DESC
            LIMIT 1
        `, [userId]);
        const dominantEmotion = domEmoRow.length > 0 ? domEmoRow[0].name : "Chưa có";

        // 4. Dữ liệu Radar Chart (Kỹ năng theo cảm xúc)
        // Lấy tỷ lệ đúng cho từng emotion
        const [radarRows] = await conn.query(`
            SELECT e.name, 
                   SUM(ual.is_correct) as correct, 
                   COUNT(*) as total
            FROM user_activity_log ual
            JOIN lesson_core lc ON ual.lesson_ref_id = lc.id 
            -- Lưu ý: Join này chỉ đúng với Flashcard/Context nơi ref_id trỏ về lesson_core
            -- Để đơn giản hóa cho matching, ta có thể join qua chosen_emotion_id
            JOIN emotion e ON ual.chosen_emotion_id = e.id
            WHERE ual.user_id = ?
            GROUP BY e.name
        `, [userId]);
        
        // Chuẩn hóa dữ liệu Radar (để trả về mảng số liệu)
        const emotionsList = ['Vui vẻ', 'Buồn bã', 'Tức giận', 'Sợ hãi', 'Ngạc nhiên', 'Ghê tởm'];
        const radarData = emotionsList.map(emoName => {
            const found = radarRows.find(r => r.name === emoName);
            if (!found) return 50; // Mặc định 50 điểm nếu chưa chơi
            return Math.round((found.correct / found.total) * 100);
        });

        // 5. Nhật ký hoạt động gần đây (Recent Logs)
        const [recentLogs] = await conn.query(`
            SELECT 
                lt.name as lesson_type,
                e.name as emotion_name,
                ual.answered_at,
                ual.is_correct
            FROM user_activity_log ual
            JOIN lesson_type lt ON ual.lesson_type_id = lt.id
            LEFT JOIN emotion e ON ual.chosen_emotion_id = e.id
            WHERE ual.user_id = ?
            ORDER BY ual.answered_at DESC
            LIMIT 5
        `, [userId]);

        res.status(200).json({
            stats: {
                stars: totalStars,
                streak: streak,
                accuracy: accuracy,
                dominantEmotion: dominantEmotion
            },
            radar: radarData,
            logs: recentLogs
        });

    } catch (error) {
        console.error("Lỗi lấy báo cáo:", error);
        res.status(500).json({ message: "Lỗi server" });
    } finally {
        conn.release();
    }
};