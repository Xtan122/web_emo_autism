import db from '../config/db.js';

// --- HÀM HELPER: KIỂM TRA HOÀN THÀNH BÀI HỌC ---
async function checkLessonCompletion(conn, userId, lessonTypeId, emotionGroupId) {
    // Kiểm tra trong bảng thống kê xem đã có lượt đúng nào chưa (total_correct_count > 0)
    const [rows] = await conn.query(
        `SELECT COUNT(*) as count FROM user_progress_stat 
         WHERE user_id = ? AND lesson_type_id = ? AND emotion_group_id = ? AND total_correct_count > 0`,
        [userId, lessonTypeId, emotionGroupId]
    );
    return rows[0].count > 0;
}

// --- API: GHI LOG HOẠT ĐỘNG (ĐÃ CẬP NHẬT TÍNH ĐIỂM) ---
export const logActivity = async (req, res) => {
    const conn = await db.getConnection();
    try {
        // Lấy User ID từ token (middleware xác thực)
        const userId = req.user.id;

        // Lấy dữ liệu từ Client gửi lên
        let { 
            lessonType, 
            levelId, 
            isCorrect, 
            questionId, 
            chosenEmotionId, 
            duration, 
            totalAttempts, // Dùng cho Matching Game
            correctCount   // Dùng cho Matching Game
        } = req.body;

        // Chuẩn hóa tên loại bài học để khớp với Database
        let typeCode = lessonType.toUpperCase();
        if (typeCode === 'EMOTION_TRAINING') {
            typeCode = 'TRAINING';
        }

        // Lấy ID của loại bài học từ bảng lesson_type
        const [typeRows] = await conn.query('SELECT id FROM lesson_type WHERE code = ?', [typeCode]);
        
        if (typeRows.length === 0) {
            return res.status(400).json({ message: 'Loại bài học không hợp lệ' });
        }
        
        const lessonTypeId = typeRows[0].id;

        // --- TÍNH ĐIỂM (SCORE) ---
        let score = 0;
        
        if (typeCode === 'MATCHING') {
            // Logic cho Matching:
            // 1. Luôn coi là hoàn thành bài (isCorrect = true) để mở khóa bài sau nếu client gửi request này
            // 2. Tính điểm dựa trên tỷ lệ lật thẻ: (Số cặp đúng / Tổng số lần lật) * 100
            if (totalAttempts > 0) {
                score = Math.round((correctCount / totalAttempts) * 100);
            } else {
                score = 100; // Mặc định nếu không có stats
            }
            isCorrect = true; // Đánh dấu là đã hoàn thành để update vào bảng Stats
        } else {
            // Logic cho Flashcard/Context:
            // Đúng = 100 điểm, Sai = 0 điểm
            score = isCorrect ? 100 : 0;
        }

        await conn.beginTransaction();

        // 1. Ghi vào bảng Log chi tiết (user_activity_log)
        // Lưu ý: Đã thêm cột 'score' vào câu lệnh INSERT
        const insertLogQuery = `
            INSERT INTO user_activity_log 
            (user_id, lesson_type_id, lesson_ref_id, chosen_emotion_id, is_correct, score, session_duration, answered_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
        `;
        
        await conn.query(insertLogQuery, [
            userId, 
            lessonTypeId, 
            questionId || 0, 
            chosenEmotionId || null, 
            isCorrect ? 1 : 0, 
            score, 
            duration || 0
        ]);

        // 2. Cập nhật bảng Thống kê Tiến độ (user_progress_stat)
        // Chỉ cộng total_correct_count nếu isCorrect = true (Flashcard đúng hoặc Matching hoàn thành)
        const updateStatQuery = `
            INSERT INTO user_progress_stat (user_id, lesson_type_id, emotion_group_id, total_play, total_correct_count, last_played_at)
            VALUES (?, ?, ?, 1, ?, NOW())
            ON DUPLICATE KEY UPDATE 
                total_play = total_play + 1,
                total_correct_count = total_correct_count + VALUES(total_correct_count),
                last_played_at = NOW();
        `;
        
        // Giá trị truyền vào cho total_correct_count: 1 nếu đúng/hoàn thành, 0 nếu sai
        await conn.query(updateStatQuery, [userId, lessonTypeId, levelId, isCorrect ? 1 : 0]);

        await conn.commit();
        res.status(200).json({ message: "Lưu kết quả thành công", score: score });

    } catch (error) {
        await conn.rollback();
        console.error("Lỗi ghi log:", error);
        res.status(500).json({ message: "Lỗi server khi lưu kết quả" });
    } finally {
        conn.release();
    }
};

// --- API: LẤY BẢN ĐỒ TIẾN ĐỘ (PROGRESS MAP) ---
export const getProgressMap = async (req, res) => {
    const conn = await db.getConnection();
    try {
        const userId = req.user.id;
        
        // Lấy danh sách Level
        const [levelRows] = await conn.query('SELECT id, name, description FROM emotion_group ORDER BY id');
        
        // Lấy danh sách loại bài học
        const [lessonTypeRows] = await conn.query('SELECT id, code FROM lesson_type');
        const lessonTypesMap = lessonTypeRows.reduce((acc, lt) => { acc[lt.code] = lt.id; return acc; }, {});
        
        // Thứ tự bài học quy định
        const lessonOrder = ['FLASHCARD', 'MATCHING', 'CONTEXT', 'TRAINING', 'AI'];
        
        const result = [];
        let previousLevelCompleted = true; 

        for (const level of levelRows) {
            let currentLevelCompleted = true;
            const lessonsStatus = {};
            
            // Logic khóa Level
            let isLevelLocked = !previousLevelCompleted;
            if (level.id === 1) isLevelLocked = false; 

            for (const typeCode of lessonOrder) {
                const typeId = lessonTypesMap[typeCode];
                // Nếu DB thiếu loại bài học này thì bỏ qua
                if (!typeId) {
                    console.warn(`⚠️ Cảnh báo: Không tìm thấy ID cho loại bài học ${typeCode} trong DB`);
                    continue;
                }

                const isCompleted = await checkLessonCompletion(conn, userId, typeId, level.id);
                
                // 🔥 SỬA LỖI QUAN TRỌNG TẠI ĐÂY 🔥
                // Frontend đang dùng key 'emotion_training', nhưng DB là 'TRAINING'
                // Chúng ta phải đổi tên key thủ công để khớp với Frontend
                let keyName = typeCode.toLowerCase(); // mặc định: flashcard, matching...
                
                if (typeCode === 'TRAINING') {
                    keyName = 'emotion_training'; // Đổi 'training' -> 'emotion_training'
                }

                lessonsStatus[keyName] = isCompleted;
                
                // Kiểm tra logic hoàn thành level (để mở level tiếp theo)
                if (!isCompleted) {
                    currentLevelCompleted = false;
                }
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

        // --- DEBUG LOG (Xem kết quả này trong Terminal của Backend) ---
        // console.log("DATA TRẢ VỀ FRONTEND:", JSON.stringify(result, null, 2));

        res.status(200).json(result);

    } catch (error) {
        console.error("Lỗi lấy Progress Map:", error);
        res.status(500).json({ message: "Lỗi server khi tải bản đồ" });
    } finally {
        conn.release();
    }
};