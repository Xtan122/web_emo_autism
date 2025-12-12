// backend/controllers/contextController.js
import db from '../config/db.js';

export const getContextQuestions = async (req, res) => {
    try {
        // 🔥 LẤY LEVEL TỪ PATH PARAMETER
        const level = req.params.level;

        if (!level) {
            return res.status(400).json({ message: "Thiếu tham số 'level' trong đường dẫn." });
        }

        // Truy vấn: Sử dụng lesson_core và lesson_option
        const query = `
            SELECT 
                lc.id AS question_id,
                lc.situation_text,
                m.url AS image_url,
                e_opt.name AS option_text,
                lo.is_correct
            FROM lesson_core lc
            LEFT JOIN media_asset m ON lc.image_id = m.id
            JOIN lesson_option lo ON lc.id = lo.core_lesson_id
            JOIN emotion e_opt ON lo.emotion_id = e_opt.id
            WHERE lc.lesson_type_id = (SELECT id FROM lesson_type WHERE code = 'CONTEXT')
            -- LỌC THEO emotion_group_id (LEVEL)
            AND lc.emotion_group_id = ?
            ORDER BY lc.id;
        `;

        const [rows] = await db.query(query, [level]);

        // Xử lý dữ liệu: Gom nhóm các option vào cùng một câu hỏi
        const questionsMap = {};

        rows.forEach(row => {
            if (!questionsMap[row.question_id]) {
                questionsMap[row.question_id] = {
                    id: row.question_id,
                    image: row.image_url,
                    story: row.situation_text,
                    question: "Bạn ấy cảm thấy thế nào?", 
                    options: [],
                    correct: null
                };
            }
            
            if (!questionsMap[row.question_id].options.includes(row.option_text)) {
                questionsMap[row.question_id].options.push(row.option_text);
            }
            
            if (row.is_correct === 1) {
                questionsMap[row.question_id].correct = row.option_text;
            }
        });

        res.status(200).json(Object.values(questionsMap));

    } catch (error) {
        console.error("Lỗi lấy dữ liệu Context:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};