import db from '../config/db.js';

// --- KHÔNG CẦN HÀM getUserId check null nữa ---

export const logActivity = async (req, res) => {
    const conn = await db.getConnection();
    try {
        const userId = req.user.id;
        let { lessonType, levelId, isCorrect, questionId, chosenEmotionId, duration } = req.body;

        // 🔥 THÊM ĐOẠN MAP TÊN NÀY ĐỂ KHỚP VỚI DATABASE
        let typeCode = lessonType.toUpperCase();
        if (typeCode === 'EMOTION_TRAINING') {
            typeCode = 'TRAINING'; // Chuyển về đúng mã trong DB
        }

        // Lấy ID của loại bài học
        const [typeRows] = await conn.query('SELECT id FROM lesson_type WHERE code = ?', [typeCode]);
        
        if (typeRows.length === 0) {
            console.error("Không tìm thấy loại bài học:", typeCode);
            return res.status(400).json({ message: 'Loại bài học không hợp lệ' });
        }
        
        const lessonTypeId = typeRows[0].id;

        await conn.beginTransaction();

        // Ghi Log
        const insertLogQuery = `
            INSERT INTO user_activity_log 
            (user_id, lesson_type_id, lesson_ref_id, chosen_emotion_id, is_correct, session_duration, answered_at)
            VALUES (?, ?, ?, ?, ?, ?, NOW())
        `;
        await conn.query(insertLogQuery, [
            userId, lessonTypeId, questionId || 0, chosenEmotionId || null, isCorrect ? 1 : 0, duration || 0
        ]);

        // Cập nhật Thống kê
        const updateStatQuery = `
            INSERT INTO user_progress_stat (user_id, lesson_type_id, emotion_group_id, total_play, total_correct_count, last_played_at)
            VALUES (?, ?, ?, 1, ?, NOW())
            ON DUPLICATE KEY UPDATE 
                total_play = total_play + 1,
                total_correct_count = total_correct_count + VALUES(total_correct_count),
                last_played_at = NOW();
        `;
        await conn.query(updateStatQuery, [userId, lessonTypeId, levelId, isCorrect ? 1 : 0]);

        await conn.commit();
        res.status(200).json({ message: "Lưu kết quả thành công" });

    } catch (error) {
        await conn.rollback();
        console.error("Lỗi ghi log:", error);
        res.status(500).json({ message: "Lỗi server" });
    } finally {
        conn.release();
    }
};

// ... (Giữ nguyên hàm checkLessonCompletion) ...
async function checkLessonCompletion(conn, userId, lessonTypeId, emotionGroupId) {
    // ... code cũ giữ nguyên ...
    const [rows] = await conn.query(
        `SELECT COUNT(*) as count FROM user_progress_stat 
         WHERE user_id = ? AND lesson_type_id = ? AND emotion_group_id = ? AND total_correct_count > 0`,
        [userId, lessonTypeId, emotionGroupId]
    );
    return rows[0].count > 0;
}

export const getProgressMap = async (req, res) => {
    const conn = await db.getConnection();
    try {
        // 🔥 Lấy ID thật
        const userId = req.user.id;
        
        // ... (Phần còn lại giữ nguyên như code cũ) ...
        const [levelRows] = await conn.query('SELECT id, name, description FROM emotion_group ORDER BY id');
        const [lessonTypeRows] = await conn.query('SELECT id, code FROM lesson_type');
        const lessonTypesMap = lessonTypeRows.reduce((acc, lt) => { acc[lt.code] = lt.id; return acc; }, {});
        const lessonOrder = ['FLASHCARD', 'MATCHING', 'CONTEXT', 'TRAINING', 'AI'];
        
        const result = [];
        let previousLevelCompleted = true; 

        for (const level of levelRows) {
            let currentLevelCompleted = true;
            const lessonsStatus = {};
            let isLevelLocked = !previousLevelCompleted;

            if (level.id === 1) isLevelLocked = false;

            for (const typeCode of lessonOrder) {
                const typeId = lessonTypesMap[typeCode];
                if (!typeId) continue;
                const isCompleted = await checkLessonCompletion(conn, userId, typeId, level.id);
                lessonsStatus[typeCode.toLowerCase()] = isCompleted;
                if (!isCompleted) currentLevelCompleted = false;
            }

            result.push({
                id: level.id,
                name: level.name,
                description: level.description,
                locked: isLevelLocked,
                chestClaimed: false,
                lessons: lessonsStatus
            });
            previousLevelCompleted = currentLevelCompleted;
        }

        res.status(200).json(result);
    } catch (error) {
        console.error("Lỗi lấy Progress Map:", error);
        res.status(500).json({ message: "Lỗi server" });
    } finally {
        conn.release();
    }
};