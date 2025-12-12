// backend/seed.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// --- 1. CONFIG DATABASE ---
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'autism_learning_db',
    port: process.env.DB_PORT || 3307
});

// --- 2. DỮ LIỆU JSON (Copy từ file của bạn vào đây) ---
const lessonData = {
    1: {
        flashcard: [
            { question: "Bạn nhỏ này đang cảm thấy gì?", image: "https://img.freepik.com/free-photo/portrait-young-happy-boy-smiling_23-2148156759.jpg", options: ["Vui vẻ", "Buồn bã"], correct: "Vui vẻ" },
            { question: "Khuôn mặt này thể hiện điều gì?", image: "https://img.freepik.com/free-photo/sad-boy-looking-down_23-2148156754.jpg", options: ["Vui vẻ", "Buồn bã"], correct: "Buồn bã" },
            { question: "Bạn ấy đang rất...?", image: "https://img.freepik.com/free-photo/angry-boy-screaming_23-2148156744.jpg", options: ["Tức giận", "Vui vẻ"], correct: "Tức giận" }
        ],
        matching: [
            { emotion: 'Vui vẻ', image: '/images/cards/happy-boy.png' },
            { emotion: 'Vui vẻ', image: '/images/cards/happy-girl.png' },
            { emotion: 'Buồn bã', image: '/images/cards/sad-boy.png' },
            { emotion: 'Buồn bã', image: '/images/cards/sad-girl.png' }
        ],
        context: [
            { image: "https://img.freepik.com/free-vector/happy-boy-opening-birthday-gifts_1308-133444.jpg", story: "Hôm nay sinh nhật Nam...", question: "Nam cảm thấy thế nào?", options: ["Vui vẻ", "Tức giận"], correct: "Vui vẻ" },
            { image: "https://img.freepik.com/free-vector/sad-boy-crying-because-ice-cream-fell-down_1308-133823.jpg", story: "Ôi không! Cây kem rơi...", question: "Bạn ấy sẽ cảm thấy sao?", options: ["Vui vẻ", "Buồn bã"], correct: "Buồn bã" }
        ],
        emotion_training: [
            { targetEmotion: 'Vui vẻ', guideImage: "https://img.freepik.com/free-photo/portrait-young-happy-boy-smiling_23-2148156759.jpg", guideText: "Hãy cười thật tươi!", successMessage: "Tuyệt vời!", tips: "Mở miệng rộng..." }
        ],
        ai: [
            { targetEmotion: 'Vui vẻ', instruction: "Con hãy CƯỜI thật tươi!", videoThumbnail: "https://www.youtube.com/embed/dQw4w9WgXcQ" }
        ]
    },
    // (Bạn có thể thêm level 2, 3 vào đây tương tự)
};

// --- 3. CÁC HÀM HỖ TRỢ (HELPER) ---

// Lấy hoặc tạo ID cho Loại bài học
async function getLessonTypeId(conn, code, name) {
    const [rows] = await conn.query('SELECT id FROM lesson_type WHERE code = ?', [code]);
    if (rows.length > 0) return rows[0].id;
    const [res] = await conn.query('INSERT INTO lesson_type (code, name) VALUES (?, ?)', [code, name]);
    return res.insertId;
}

// Lấy hoặc tạo ID cho Cảm xúc
async function getEmotionId(conn, name) {
    // Map tên tiếng Anh sang tiếng Việt nếu cần, ở đây mình giả định DB lưu tiếng Việt
    let dbName = name;
    if (name === 'happy') dbName = 'Vui vẻ';
    if (name === 'sad') dbName = 'Buồn bã';
    
    const [rows] = await conn.query('SELECT id FROM emotion WHERE name = ?', [dbName]);
    if (rows.length > 0) return rows[0].id;
    
    // Nếu chưa có thì tạo nhóm mặc định rồi tạo cảm xúc
    const [res] = await conn.query('INSERT INTO emotion (name) VALUES (?)', [dbName]);
    return res.insertId;
}

// Tạo Media Asset
async function createMedia(conn, url, type = 'IMAGE') {
    const [res] = await conn.query('INSERT INTO media_asset (type, url) VALUES (?, ?)', [type, url]);
    return res.insertId;
}

// --- 4. HÀM CHÍNH (MAIN SEED FUNCTION) ---
async function seed() {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        console.log("🚀 Bắt đầu nhập dữ liệu...");

        // 1. Khởi tạo các Lesson Type
        const typeFlashcard = await getLessonTypeId(conn, 'FLASHCARD', 'Học từ vựng');
        const typeMatching = await getLessonTypeId(conn, 'MATCHING', 'Nối cặp');
        const typeContext = await getLessonTypeId(conn, 'CONTEXT', 'Tình huống');
        const typeTraining = await getLessonTypeId(conn, 'EMOTION_TRAINING', 'Tập biểu cảm');
        const typeAi = await getLessonTypeId(conn, 'AI', 'AI Nhận diện');

        // 2. Duyệt qua từng Level trong data
        for (const [level, data] of Object.entries(lessonData)) {
            console.log(`... Đang xử lý Level ${level}`);

            // --- SEED FLASHCARD ---
            if (data.flashcard) {
                for (const item of data.flashcard) {
                    const mediaId = await createMedia(conn, item.image);
                    
                    // Tạo câu hỏi
                    const [qRes] = await conn.query(
                        'INSERT INTO flashcard_question (lesson_type_id, image_id, question_text, level) VALUES (?, ?, ?, ?)',
                        [typeFlashcard, mediaId, item.question, level]
                    );
                    const questionId = qRes.insertId;

                    // Tạo Options và tìm đáp án đúng
                    let correctOptionId = null;
                    for (const optText of item.options) {
                        const [optRes] = await conn.query(
                            'INSERT INTO flashcard_option (question_id, option_text) VALUES (?, ?)',
                            [questionId, optText]
                        );
                        if (optText === item.correct) {
                            correctOptionId = optRes.insertId;
                        }
                    }

                    // Update lại câu hỏi để trỏ vào đáp án đúng
                    if (correctOptionId) {
                        await conn.query('UPDATE flashcard_question SET correct_option_id = ? WHERE id = ?', [correctOptionId, questionId]);
                    }
                }
            }

            // --- SEED MATCHING ---
            if (data.matching) {
                for (const item of data.matching) {
                    const mediaId = await createMedia(conn, item.image);
                    const emotionId = await getEmotionId(conn, item.emotion);
                    
                    await conn.query(
                        'INSERT INTO matching_card (lesson_type_id, image_id, emotion_id, pair_key, level) VALUES (?, ?, ?, ?, ?)',
                        [typeMatching, mediaId, emotionId, item.emotion, level] // Dùng emotion làm pair_key tạm
                    );
                }
            }

            // --- SEED CONTEXT ---
            if (data.context) {
                for (const item of data.context) {
                    const mediaId = await createMedia(conn, item.image);
                    const correctEmotionId = await getEmotionId(conn, item.correct);

                    const [qRes] = await conn.query(
                        'INSERT INTO context_question (lesson_type_id, image_id, situation_text, correct_emotion_id, level) VALUES (?, ?, ?, ?, ?)',
                        [typeContext, mediaId, item.story + " " + item.question, correctEmotionId, level]
                    );
                    const questionId = qRes.insertId;

                    // Tạo options (Context Option cần trỏ tới emotion_id)
                    for (const optText of item.options) {
                        const emoId = await getEmotionId(conn, optText);
                        const isCorrect = (optText === item.correct) ? 1 : 0;
                        await conn.query(
                            'INSERT INTO context_option (question_id, emotion_id, is_correct) VALUES (?, ?, ?)',
                            [questionId, emoId, isCorrect]
                        );
                    }
                }
            }

            // --- SEED EMOTION TRAINING ---
            if (data.emotion_training) {
                for (const item of data.emotion_training) {
                    const guideMediaId = await createMedia(conn, item.guideImage);
                    const targetEmoId = await getEmotionId(conn, item.targetEmotion);

                    await conn.query(
                        'INSERT INTO emotion_training (level, target_emotion_id, guide_image_id, guide_text, success_message, tips) VALUES (?, ?, ?, ?, ?, ?)',
                        [level, targetEmoId, guideMediaId, item.guideText, item.successMessage, item.tips]
                    );
                }
            }
             
             // --- SEED AI ---
             if (data.ai) {
                for (const item of data.ai) {
                    const targetEmoId = await getEmotionId(conn, item.targetEmotion);
                    await conn.query(
                        'INSERT INTO ai_lesson (level, target_emotion_id, instruction, video_thumbnail_url) VALUES (?, ?, ?, ?)',
                        [level, targetEmoId, item.instruction, item.videoThumbnail]
                    );
                }
            }
        }

        await conn.commit();
        console.log("✅ Nhập dữ liệu thành công!");
    } catch (error) {
        await conn.rollback();
        console.error("❌ Có lỗi xảy ra, đã hoàn tác:", error);
    } finally {
        conn.release();
        process.exit();
    }
}

seed();