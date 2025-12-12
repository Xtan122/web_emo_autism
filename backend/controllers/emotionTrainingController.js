// backend/controllers/emotionTrainingController.js
import db from '../config/db.js';

export const getEmotionTrainingLessons = async (req, res) => {
    try {
        // 🔥 FIX: Lấy level từ PATH PARAMETER (req.params.level)
        const level = req.params.level;

        if (!level) {
            return res.status(400).json({ message: "Thiếu tham số 'level' trong đường dẫn." });
        }

        const query = `
            SELECT 
            lt.id,
            lt.instruction,
            lt.success_message,
            lt.tips,
            m.url AS guide_image_url,
            e.name AS target_emotion_name
            FROM lesson_training_ai lt
            JOIN emotion e ON lt.target_emotion_id = e.id
            LEFT JOIN media_asset m ON lt.media_guide_id = m.id
            WHERE lt.lesson_type_id = (SELECT id FROM lesson_type WHERE code = 'TRAINING')
            AND lt.emotion_group_id = ?
        `;

        // Truyền level vào truy vấn
        const [rows] = await db.query(query, [level]);

        // Map dữ liệu sang đúng tên props mà component EmotionTraining.vue đang dùng
        const result = rows.map(row => ({
            id: row.id,
            guideImage: row.guide_image_url, 
            guideText: row.guide_text, 
            successMessage: row.success_message, 
            tips: row.tips, 
            targetEmotion: row.target_emotion_name
        }));

        res.status(200).json(result);

    } catch (error) {
        console.error("Lỗi lấy dữ liệu Emotion Training:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};  