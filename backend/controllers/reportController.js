// backend/controllers/reportController.js
import db from '../config/db.js';

// Helper: Lấy ID an toàn
const getUserId = (req) => {
    if (req.user && req.user.id) {
        return req.user.id;
    }
    return null; // Trả về null nếu không có user
};

export const getUserReport = async (req, res) => {
    let conn;
    try {
        const userId = getUserId(req);
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        conn = await db.getConnection();

        // 1. Lấy thông tin Stats cơ bản (Sao, Streak,...) - GIỮ NGUYÊN
        // ... (Code cũ của phần Stats) ...
        // Bạn copy lại phần tính totalStars, streak, accuracy, dominantEmotion từ code trước

        // 2. Dữ liệu Radar Chart (Theo cảm xúc) - GIỮ NGUYÊN
        // ... (Code cũ phần Radar Chart) ...

        // 3. 🔥 DỮ LIỆU KỸ NĂNG THEO LOẠI BÀI HỌC (PHẦN MỚI) 🔥
        // Tính trung bình tỷ lệ đúng cho từng loại bài học (Flashcard, Matching, v.v.)
        const [skillRows] = await conn.query(`
            SELECT 
                lt.code,
                lt.name,
                SUM(ups.total_correct_count) as total_correct,
                SUM(ups.total_play) as total_play
            FROM user_progress_stat ups
            JOIN lesson_type lt ON ups.lesson_type_id = lt.id
            WHERE ups.user_id = ?
            GROUP BY lt.code, lt.name
        `, [userId]);

        // Biến đổi dữ liệu cho Frontend dễ dùng
        // Mặc định danh sách đủ 5 loại để không bị thiếu
        const lessonTypes = ['FLASHCARD', 'CONTEXT', 'MATCHING', 'TRAINING', 'AI'];
        
        const skillData = lessonTypes.map(code => {
            const found = skillRows.find(r => r.code === code);
            if (!found || found.total_play === 0) {
                return { 
                    code: code, 
                    name: getLessonTypeName(code), 
                    score: 0 
                };
            }
            // Tính % trung bình
            const percent = Math.round((found.total_correct / found.total_play) * 100);
            return { 
                code: code, 
                name: found.name, 
                score: percent 
            };
        });

        // 4. Lấy Logs - GIỮ NGUYÊN
        // ...

        // 5. Trả về kết quả
        res.status(200).json({
            stats: { 
                // ... stats cũ
             },
            radar: radarData, // Dữ liệu cho biểu đồ mạng nhện
            skills: skillData, // 🔥 Dữ liệu mới cho thanh tiến trình ngang
            logs: recentLogs
        });

    } catch (error) {
        // ...
    } finally {
        if (conn) conn.release();
    }
};

// Helper đặt tên tiếng Việt (nếu DB lưu tiếng Anh)
function getLessonTypeName(code) {
    const map = {
        'FLASHCARD': 'Học thẻ Flashcard',
        'CONTEXT': 'Tình huống',
        'MATCHING': 'Ghép cặp',
        'TRAINING': 'Luyện biểu cảm',
        'AI': 'AI Thử thách'
    };
    return map[code] || code;
}

// export const getUserReport = async (req, res) => {
//     let conn;
//     try {
//         const userId = getUserId(req);

//         // 1. Bảo mật: Chặn nếu không có User ID
//         if (!userId) {
//             return res.status(401).json({ message: "Chưa đăng nhập hoặc Token không hợp lệ" });
//         }

//         conn = await db.getConnection();

//         // 2. Tổng số sao (Tính tổng điểm score đã lưu trong log thay vì fix cứng * 5)
//         // Nếu bạn muốn fix cứng 5 điểm/câu đúng thì giữ nguyên logic cũ
//         const [scoreRow] = await conn.query(`
//             SELECT SUM(score) as total_score 
//             FROM user_activity_log 
//             WHERE user_id = ?
//         `, [userId]);
//         const totalStars = scoreRow[0].total_score || 0;

//         // 3. Chuỗi ngày liên tiếp (Streak) - Logic chuẩn hóa ngày
//         const [dateRows] = await conn.query(`
//             SELECT DISTINCT DATE(answered_at) as play_date 
//             FROM user_activity_log 
//             WHERE user_id = ? 
//             ORDER BY play_date DESC
//         `, [userId]);

//         let streak = 0;
//         if (dateRows.length > 0) {
//             // Chuẩn hóa ngày hiện tại về 00:00:00 để so sánh
//             const today = new Date();
//             today.setHours(0, 0, 0, 0);

//             const lastPlayDate = new Date(dateRows[0].play_date);
//             lastPlayDate.setHours(0, 0, 0, 0);

//             // Tính khoảng cách ngày (milliseconds -> days)
//             const diffTime = today.getTime() - lastPlayDate.getTime();
//             const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));

//             // Nếu chơi hôm nay (0) hoặc hôm qua (1) thì tính là đang duy trì chuỗi
//             if (diffDays <= 1) {
//                 streak = 1; // Bắt đầu đếm
//                 for (let i = 0; i < dateRows.length - 1; i++) {
//                     const d1 = new Date(dateRows[i].play_date);
//                     const d2 = new Date(dateRows[i+1].play_date);
//                     // Khoảng cách giữa 2 ngày log liên tiếp phải là 1 ngày
//                     const diff = (d1.getTime() - d2.getTime()) / (1000 * 3600 * 24);
                    
//                     if (Math.round(diff) === 1) {
//                         streak++;
//                     } else {
//                         break; // Đứt chuỗi
//                     }
//                 }
//             } else {
//                 streak = 0; // Đã quá 2 ngày không chơi -> Reset streak
//             }
//         }

//         // 4. Độ chính xác & Cảm xúc chủ đạo
//         const [accuracyRow] = await conn.query(`
//             SELECT 
//                 COUNT(*) as total_attempts,
//                 SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) as correct_attempts
//             FROM user_activity_log
//             WHERE user_id = ?
//         `, [userId]);
        
//         const accuracy = accuracyRow[0].total_attempts > 0 
//             ? Math.round((accuracyRow[0].correct_attempts / accuracyRow[0].total_attempts) * 100) 
//             : 0;

//         // Cảm xúc chủ đạo (Dominant): Lấy cảm xúc user làm ĐÚNG nhiều nhất
//         // Lưu ý: Join với bảng Emotion để lấy tên
//         const [domEmoRow] = await conn.query(`
//             SELECT e.name, COUNT(*) as cnt
//             FROM user_activity_log ual
//             JOIN emotion e ON ual.chosen_emotion_id = e.id
//             WHERE ual.user_id = ? AND ual.is_correct = 1
//             GROUP BY e.name
//             ORDER BY cnt DESC
//             LIMIT 1
//         `, [userId]);
//         const dominantEmotion = domEmoRow.length > 0 ? domEmoRow[0].name : "Chưa xác định";

//         // 5. Dữ liệu Radar Chart
//         // Logic: Tính % đúng cho từng loại cảm xúc dựa trên chosen_emotion_id khi is_correct=1
//         // (Cách này chính xác hơn việc Join lesson_core vì nó cover được cả Matching/AI nếu log có chosen_emotion_id)
//         const [radarRows] = await conn.query(`
//             SELECT 
//                 e.name, 
//                 COUNT(*) as total_correct_for_this_emotion
//             FROM user_activity_log ual
//             JOIN emotion e ON ual.chosen_emotion_id = e.id
//             WHERE ual.user_id = ? AND ual.is_correct = 1
//             GROUP BY e.name
//         `, [userId]);

//         // Tính tổng số lần chơi để chia tỷ lệ (Đây là bản đơn giản hóa)
//         const emotionsList = ['Vui vẻ', 'Buồn bã', 'Tức giận', 'Sợ hãi', 'Ngạc nhiên', 'Ghê tởm'];
//         const radarData = emotionsList.map(emoName => {
//             const found = radarRows.find(r => r.name === emoName);
//             // Logic tạm: Map số lượng đúng vào thang điểm 100 tương đối
//             // (Thực tế nên chia cho tổng số lần xuất hiện của cảm xúc đó trong đề bài)
//             if (!found) return 20; // Giá trị mặc định cho đẹp biểu đồ
            
//             // Giả sử max là 20 lần đúng = 100% (cần logic phức tạp hơn nếu muốn chính xác tuyệt đối)
//             return Math.min(Math.round((found.total_correct_for_this_emotion / 20) * 100), 100); 
//         });

//         // 6. Recent Logs
//         const [recentLogs] = await conn.query(`
//             SELECT 
//                 lt.name as lesson_type,
//                 e.name as emotion_name,
//                 ual.answered_at,
//                 ual.is_correct,
//                 ual.score
//             FROM user_activity_log ual
//             JOIN lesson_type lt ON ual.lesson_type_id = lt.id
//             LEFT JOIN emotion e ON ual.chosen_emotion_id = e.id
//             WHERE ual.user_id = ?
//             ORDER BY ual.answered_at DESC
//             LIMIT 5
//         `, [userId]);

//         res.status(200).json({
//             stats: {
//                 stars: totalStars,
//                 streak: streak,
//                 accuracy: accuracy,
//                 dominantEmotion: dominantEmotion
//             },
//             radar: radarData,
//             logs: recentLogs
//         });

//     } catch (error) {
//         console.error("Lỗi lấy báo cáo:", error);
//         res.status(500).json({ message: "Lỗi server" });
//     } finally {
//         if (conn) conn.release(); // Chỉ release khi conn tồn tại
//     }
// };