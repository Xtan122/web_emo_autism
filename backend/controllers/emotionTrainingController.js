import db from '../config/db.js';

export const getEmotionTrainingLessons = async (req, res) => {
    try {
        const level = req.params.level;

        if (!level) {
            return res.status(400).json({ message: "Thiếu tham số 'level'." });
        }

        const query = `
            SELECT 
                lt.id,
                lt.instruction,       -- Lấy cột instruction
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

        const [rows] = await db.query(query, [level]);

        const result = rows.map(row => ({
            id: row.id,
            guideImage: row.guide_image_url, 
            
            instruction: row.instruction, 
            
            successMessage: row.success_message,
            tips: row.tips,

            emotion_name: row.target_emotion_name 
        }));

        res.status(200).json(result);

    } catch (error) {
        console.error("Lỗi lấy dữ liệu Emotion Training:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};