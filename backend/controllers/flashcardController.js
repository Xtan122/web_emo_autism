import db from '../config/db.js';

export const getFlashcards = async (req, res) => {
    try {
        const level = req.params.level; 

        if (!level) {
            return res.status(400).json({ message: "Thiếu tham số 'level' trong đường dẫn." });
        }

        const query = `
            SELECT 
                lc.id AS question_id,
                lc.situation_text, 
                m.url AS image_url,
                lo.option_text,
                lo.is_correct
            FROM lesson_core lc
            JOIN media_asset m ON lc.image_id = m.id
            JOIN lesson_option lo ON lc.id = lo.core_lesson_id
            WHERE lc.lesson_type_id = (SELECT id FROM lesson_type WHERE code = 'FLASHCARD')
            AND lc.emotion_group_id = ?
            ORDER BY lc.id;
        `;

        const [rows] = await db.query(query, [level]);

        const questionsMap = {};
        rows.forEach(row => {
            if (!questionsMap[row.question_id]) {
                questionsMap[row.question_id] = {
                    id: row.question_id, image: row.image_url, question: row.situation_text, options: [], correct: null
                };
            }
            questionsMap[row.question_id].options.push(row.option_text);
            if (row.is_correct === 1) {
                questionsMap[row.question_id].correct = row.option_text;
            }
        });

        res.status(200).json(Object.values(questionsMap));

    } catch (error) {
        console.error("Lỗi lấy flashcard:", error);
        res.status(500).json({ message: "Lỗi server khi lấy dữ liệu bài học" });
    }
};