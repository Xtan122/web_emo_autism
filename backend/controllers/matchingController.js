import db from '../config/db.js';

export const getMatchingCards = async (req, res) => {
    try {
        const level = req.params.level;

        if (!level) {
            return res.status(400).json({ message: "Thiếu tham số 'level' trong đường dẫn." });
        }

        const query = `
            SELECT 
                mc.id,
                mc.pair_key, 
                e.name AS emotion_name,
                m.url AS image_url
            FROM matching_card mc
            JOIN media_asset m ON mc.image_id = m.id
            JOIN emotion e ON mc.emotion_id = e.id
            WHERE mc.emotion_group_id = ? 
            ORDER BY mc.id ASC; 
        `;

        const [rows] = await db.query(query, [level]);

        const result = rows.map(row => ({
            id: row.id,
            pair_key: row.pair_key,
            emotion: row.emotion_name,
            image: row.image_url
        }));

        res.status(200).json(result);

    } catch (error) {
        console.error("Lỗi lấy dữ liệu Matching:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};