import db from '../config/db.js';

export const getAiLessons = async (req, res) => {
    try {
        const level = req.params.level;

        if (!level) {
            return res.status(400).json({ message: "Thiếu tham số 'level' trong đường dẫn." });
        }

        const query = `
            SELECT 
                lt.id,
                lt.instruction,
                lt.video_url AS video_thumbnail_url,
                e.name AS target_emotion_name
            FROM lesson_training_ai lt
            JOIN emotion e ON lt.target_emotion_id = e.id
            WHERE lt.lesson_type_id = (SELECT id FROM lesson_type WHERE code = 'AI')
            AND lt.emotion_group_id = ?
        `;

        const [rows] = await db.query(query, [level]);

        const result = rows.map(row => ({
            id: row.id,
            instruction: row.instruction,
            videoThumbnail: row.video_thumbnail_url,
            targetEmotion: row.target_emotion_name
        }));

        res.status(200).json(result);

    } catch (error) {
        console.error("Lỗi lấy dữ liệu AI Lesson:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};