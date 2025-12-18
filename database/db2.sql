drop database autism_learning_v2;
-- Tạo database
CREATE DATABASE IF NOT EXISTS autism_learning_v2 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE autism_learning_v2;

-- ========================================================
-- 1. DANH MỤC & CẤU HÌNH HỆ THỐNG
-- ========================================================

-- Bảng nhóm cảm xúc (Dùng làm Cấp độ - Level)
CREATE TABLE emotion_group (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- VD: Cấp độ 1, Cấp độ 2
    description TEXT            -- VD: Vui vẻ, Buồn bã
);

-- Bảng cảm xúc chi tiết
CREATE TABLE emotion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL, -- VD: Vui vẻ, Giận dữ
    group_id INT, -- Có thể trỏ tới nhóm cảm xúc nếu cần phân cấp
    FOREIGN KEY (group_id) REFERENCES emotion_group(id) ON DELETE SET NULL
);

-- Bảng loại bài học
CREATE TABLE lesson_type (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE, -- 'FLASHCARD', 'MATCHING', 'CONTEXT', 'TRAINING', 'AI'
    name VARCHAR(100) NOT NULL
);

-- Bảng kho dữ liệu Media (Ảnh/Video) dùng chung
CREATE TABLE media_asset (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('IMAGE', 'VIDEO', 'AUDIO') NOT NULL,
    url VARCHAR(255) NOT NULL,
    emotion_id INT, -- Media này thể hiện cảm xúc gì (nếu có)
    FOREIGN KEY (emotion_id) REFERENCES emotion(id) ON DELETE SET NULL
);

-- ========================================================
-- 2. NỘI DUNG THỬ THÁCH (CONTENT)
-- ========================================================

-- Bảng Nội Dung Câu Hỏi Chung (Gộp Flashcard & Context)
CREATE TABLE lesson_core (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lesson_type_id INT NOT NULL, -- Loại: FLASHCARD hay CONTEXT
    emotion_group_id INT NOT NULL, -- Cấp độ (Level)
    image_id INT, -- Ảnh/Media chính minh họa
    situation_text TEXT NOT NULL, -- Nội dung câu hỏi/tình huống
    correct_emotion_id INT NOT NULL, -- Cảm xúc là đáp án đúng
    FOREIGN KEY (lesson_type_id) REFERENCES lesson_type(id),
    FOREIGN KEY (emotion_group_id) REFERENCES emotion_group(id),
    FOREIGN KEY (image_id) REFERENCES media_asset(id) ON DELETE SET NULL,
    FOREIGN KEY (correct_emotion_id) REFERENCES emotion(id)
);

-- Bảng Các Lựa Chọn cho Câu hỏi Chung
CREATE TABLE lesson_option (
    id INT AUTO_INCREMENT PRIMARY KEY,
    core_lesson_id INT NOT NULL, -- Trỏ đến lesson_core
    emotion_id INT NOT NULL,     -- Cảm xúc của lựa chọn này
    option_text VARCHAR(255),
    is_correct TINYINT(1) DEFAULT 0, -- 1=Đúng, 0=Sai
    FOREIGN KEY (core_lesson_id) REFERENCES lesson_core(id) ON DELETE CASCADE,
    FOREIGN KEY (emotion_id) REFERENCES emotion(id)
);

-- Bảng Nội Dung Matching (Nối cặp)
CREATE TABLE matching_card (
    id INT AUTO_INCREMENT PRIMARY KEY,
    emotion_group_id INT NOT NULL, -- Cấp độ (Level)
    image_id INT NOT NULL,
    emotion_id INT NOT NULL, -- Cảm xúc của thẻ
    pair_key VARCHAR(50) NOT NULL, -- Key để nối 2 thẻ thành 1 cặp
    FOREIGN KEY (emotion_group_id) REFERENCES emotion_group(id),
    FOREIGN KEY (image_id) REFERENCES media_asset(id),
    FOREIGN KEY (emotion_id) REFERENCES emotion(id)
);

-- Bảng Nội Dung Tập Luyện & AI (Gộp Emotion Training & AI)
CREATE TABLE lesson_training_ai (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lesson_type_id INT NOT NULL,     -- Loại: TRAINING hay AI
    emotion_group_id INT NOT NULL,   -- Cấp độ (Level)
    target_emotion_id INT NOT NULL,  -- Cảm xúc cần thể hiện
    instruction TEXT,                -- Lời nhắc nhở/chỉ dẫn
    media_guide_id INT,              -- Ảnh/Video hướng dẫn (cho TRAINING)
    video_url VARCHAR(255),          -- Link video mẫu (cho AI)
    success_message TEXT,
    tips TEXT,
    FOREIGN KEY (lesson_type_id) REFERENCES lesson_type(id),
    FOREIGN KEY (emotion_group_id) REFERENCES emotion_group(id),
    FOREIGN KEY (target_emotion_id) REFERENCES emotion(id),
    FOREIGN KEY (media_guide_id) REFERENCES media_asset(id) ON DELETE SET NULL
);


-- ========================================================
-- 3. NGƯỜI DÙNG & TIẾN ĐỘ (LOGS)
-- ========================================================

-- Bảng người dùng
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    password VARCHAR(255),
    parent_name VARCHAR(100),
    avatar VARCHAR(255) DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Log lịch sử hoạt động chi tiết (Gộp tất cả log game)
CREATE TABLE user_activity_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    lesson_type_id INT NOT NULL,

    -- ID tham chiếu đến câu hỏi/phiên chơi cụ thể (Ví dụ: ID câu hỏi trong lesson_core)
    lesson_ref_id INT NOT NULL,

    chosen_emotion_id INT, -- Cảm xúc mà trẻ đã chọn/thể hiện
    is_correct TINYINT(1) DEFAULT NULL, -- 1: Đúng, 0: Sai, NULL: Không áp dụng
    session_duration INT, -- Thời gian hoàn thành (giây, cho Matching/Training/AI)
    answered_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_type_id) REFERENCES lesson_type(id)
    -- KHÔNG CẦN TẠO FK cho lesson_ref_id vì nó trỏ đến nhiều bảng khác nhau
);

-- Bảng thống kê tổng hợp tiến trình (Progress Report)
CREATE TABLE user_progress_stat (
    user_id INT NOT NULL,
    lesson_type_id INT NOT NULL,
    emotion_group_id INT NOT NULL, -- Level nào

    total_play INT NOT NULL DEFAULT 0,
    total_correct_count INT NOT NULL DEFAULT 0,
    last_played_at DATETIME,

    PRIMARY KEY (user_id, lesson_type_id, emotion_group_id),
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_type_id) REFERENCES lesson_type(id),
    FOREIGN KEY (emotion_group_id) REFERENCES emotion_group(id)
);
ALTER TABLE user_activity_log ADD COLUMN score INT DEFAULT 0;
-- ========================================================
-- I. DANH MỤC & CẤU HÌNH CƠ BẢN
-- ========================================================

-- 1. Thêm Loại Bài Học (Lesson Type)
INSERT INTO lesson_type (code, name) VALUES
('FLASHCARD', 'Học Flashcard'),
('MATCHING', 'Nối cặp cảm xúc'),
('CONTEXT', 'Tình huống & Ngữ cảnh'),
('TRAINING', 'Tập biểu cảm'),
('AI', 'AI Nhận diện');

-- 2. Thêm Nhóm Cảm Xúc (Dùng làm Level)
INSERT INTO emotion_group (name, description) VALUES
('Cấp độ 1', 'Cảm xúc cơ bản: Vui vẻ & Buồn bã'),
('Cấp độ 2', 'Cảm xúc nâng cao: Giận dữ & Sợ hãi'),
('Cấp độ 3', 'Cảm xúc phức tạp: Ngạc nhiên & Ghê tởm');

-- Lấy IDs để dùng trong các câu lệnh sau
SET @LEVEL_1 = (SELECT id FROM emotion_group WHERE name = 'Cấp độ 1');
SET @FLASHCARD_TYPE = (SELECT id FROM lesson_type WHERE code = 'FLASHCARD');
SET @CONTEXT_TYPE = (SELECT id FROM lesson_type WHERE code = 'CONTEXT');
SET @MATCHING_TYPE = (SELECT id FROM lesson_type WHERE code = 'MATCHING');
SET @TRAINING_TYPE = (SELECT id FROM lesson_type WHERE code = 'TRAINING');
SET @AI_TYPE = (SELECT id FROM lesson_type WHERE code = 'AI');

-- 3. Thêm Cảm Xúc Chi Tiết
INSERT INTO emotion (name, group_id) VALUES
('Vui vẻ', @LEVEL_1),   -- ID 1
('Buồn bã', @LEVEL_1),  -- ID 2
('Tức giận', @LEVEL_1), -- Tạm thời cho vào Level 1 để test, có thể chuyển sau
('Sợ hãi', @LEVEL_1);
INSERT INTO emotion (name) VALUES ('Ngạc nhiên'), ('Ghê tởm'); -- ID 5, 6

SET @EMO_VUI = (SELECT id FROM emotion WHERE name = 'Vui vẻ');
SET @EMO_BUON = (SELECT id FROM emotion WHERE name = 'Buồn bã');
SET @EMO_GIAN = (SELECT id FROM emotion WHERE name = 'Tức giận');
SET @EMO_SO = (SELECT id FROM emotion WHERE name = 'Sợ hãi');

-- 4. Thêm Media Asset (Tối thiểu cho các bài học)

-- Media Flashcard
INSERT INTO media_asset (type, url, emotion_id) VALUES
('IMAGE', 'https://example.com/images/flashcard/happy_1.jpg', @EMO_VUI),    -- ID 1 (FC-Vui 1)
('IMAGE', 'https://example.com/images/flashcard/sad_1.jpg', @EMO_BUON),     -- ID 2 (FC-Buồn 1)
('IMAGE', 'https://example.com/images/flashcard/happy_2.jpg', @EMO_VUI),    -- ID 3 (FC-Vui 2)
('IMAGE', 'https://example.com/images/flashcard/sad_2.jpg', @EMO_BUON),     -- ID 4 (FC-Buồn 2)
('IMAGE', 'https://example.com/images/flashcard/angry_1.jpg', @EMO_GIAN);   -- ID 5 (FC-Giận 1)

-- Media Context
INSERT INTO media_asset (type, url, emotion_id) VALUES
('IMAGE', 'https://example.com/images/context/gift.jpg', @EMO_VUI),         -- ID 6 (CT-Quà)
('IMAGE', 'https://example.com/images/context/ice_cream_fall.jpg', @EMO_BUON), -- ID 7 (CT-Kem)
('IMAGE', 'https://example.com/images/context/broken_toy.jpg', @EMO_BUON);  -- ID 8 (CT-Đồ chơi hỏng)

-- Media Matching (5 cặp = 10 thẻ)
INSERT INTO media_asset (type, url, emotion_id) VALUES
('IMAGE', 'https://example.com/images/matching/vui_1_face.jpg', @EMO_VUI),    -- ID 9
('IMAGE', 'https://example.com/images/matching/vui_1_text.jpg', @EMO_VUI),    -- ID 10
('IMAGE', 'https://example.com/images/matching/buon_1_face.jpg', @EMO_BUON),  -- ID 11
('IMAGE', 'https://example.com/images/matching/buon_1_text.jpg', @EMO_BUON),  -- ID 12
('IMAGE', 'https://example.com/images/matching/vui_2_face.jpg', @EMO_VUI),    -- ID 13
('IMAGE', 'https://example.com/images/matching/vui_2_text.jpg', @EMO_VUI),    -- ID 14
('IMAGE', 'https://example.com/images/matching/buon_2_face.jpg', @EMO_BUON),  -- ID 15
('IMAGE', 'https://example.com/images/matching/buon_2_text.jpg', @EMO_BUON),  -- ID 16
('IMAGE', 'https://example.com/images/matching/gian_1_face.jpg', @EMO_GIAN),  -- ID 17
('IMAGE', 'https://example.com/images/matching/gian_1_text.jpg', @EMO_GIAN);  -- ID 18

-- Media Training (Hướng dẫn)
INSERT INTO media_asset (type, url, emotion_id) VALUES
('IMAGE', 'https://example.com/images/training/guide_vui.jpg', @EMO_VUI);    -- ID 19

-- ========================================================
-- II. NỘI DUNG THỬ THÁCH (CONTENT)
-- ========================================================

-- --- 1. FLASHCARD (5 Câu - 4 Lựa chọn) ---
-- Câu 1 (Vui)
INSERT INTO lesson_core (lesson_type_id, emotion_group_id, image_id, situation_text, correct_emotion_id) VALUES
(@FLASHCARD_TYPE, @LEVEL_1, 1, 'Bạn nhỏ này đang cảm thấy gì?', @EMO_VUI);
SET @Q1_FC = LAST_INSERT_ID();
INSERT INTO lesson_option (core_lesson_id, emotion_id, option_text, is_correct) VALUES
(@Q1_FC, @EMO_VUI, 'Vui vẻ', 1), (@Q1_FC, @EMO_BUON, 'Buồn bã', 0), (@Q1_FC, @EMO_GIAN, 'Tức giận', 0), (@Q1_FC, @EMO_SO, 'Sợ hãi', 0);

-- Câu 2 (Buồn)
INSERT INTO lesson_core (lesson_type_id, emotion_group_id, image_id, situation_text, correct_emotion_id) VALUES
(@FLASHCARD_TYPE, @LEVEL_1, 2, 'Khuôn mặt này thể hiện điều gì?', @EMO_BUON);
SET @Q2_FC = LAST_INSERT_ID();
INSERT INTO lesson_option (core_lesson_id, emotion_id, option_text, is_correct) VALUES
(@Q2_FC, @EMO_VUI, 'Vui vẻ', 0), (@Q2_FC, @EMO_BUON, 'Buồn bã', 1), (@Q2_FC, @EMO_GIAN, 'Tức giận', 0), (@Q2_FC, @EMO_SO, 'Sợ hãi', 0);

-- Câu 3 (Vui)
INSERT INTO lesson_core (lesson_type_id, emotion_group_id, image_id, situation_text, correct_emotion_id) VALUES
(@FLASHCARD_TYPE, @LEVEL_1, 3, 'Bạn ấy có đang hạnh phúc không?', @EMO_VUI);
SET @Q3_FC = LAST_INSERT_ID();
INSERT INTO lesson_option (core_lesson_id, emotion_id, option_text, is_correct) VALUES
(@Q3_FC, @EMO_VUI, 'Vui vẻ', 1), (@Q3_FC, @EMO_BUON, 'Buồn bã', 0), (@Q3_FC, @EMO_GIAN, 'Tức giận', 0), (@Q3_FC, @EMO_SO, 'Sợ hãi', 0);

-- Câu 4 (Buồn)
INSERT INTO lesson_core (lesson_type_id, emotion_group_id, image_id, situation_text, correct_emotion_id) VALUES
(@FLASHCARD_TYPE, @LEVEL_1, 4, 'Bạn nhỏ này đang cảm thấy như thế nào?', @EMO_BUON);
SET @Q4_FC = LAST_INSERT_ID();
INSERT INTO lesson_option (core_lesson_id, emotion_id, option_text, is_correct) VALUES
(@Q4_FC, @EMO_VUI, 'Vui vẻ', 0), (@Q4_FC, @EMO_BUON, 'Buồn bã', 1), (@Q4_FC, @EMO_GIAN, 'Tức giận', 0), (@Q4_FC, @EMO_SO, 'Sợ hãi', 0);

-- Câu 5 (Giận)
INSERT INTO lesson_core (lesson_type_id, emotion_group_id, image_id, situation_text, correct_emotion_id) VALUES
(@FLASHCARD_TYPE, @LEVEL_1, 5, 'Biểu cảm này cho thấy bạn ấy đang...?', @EMO_GIAN);
SET @Q5_FC = LAST_INSERT_ID();
INSERT INTO lesson_option (core_lesson_id, emotion_id, option_text, is_correct) VALUES
(@Q5_FC, @EMO_VUI, 'Vui vẻ', 0), (@Q5_FC, @EMO_BUON, 'Buồn bã', 0), (@Q5_FC, @EMO_GIAN, 'Tức giận', 1), (@Q5_FC, @EMO_SO, 'Sợ hãi', 0);


-- --- 2. CONTEXT (5 Câu - 4 Lựa chọn) ---
-- Câu 1 (Vui - Quà)
INSERT INTO lesson_core (lesson_type_id, emotion_group_id, image_id, situation_text, correct_emotion_id) VALUES
(@CONTEXT_TYPE, @LEVEL_1, 6, 'Hôm nay sinh nhật Nam, mẹ tặng cho Nam một món đồ chơi mới. Nam cảm thấy thế nào?', @EMO_VUI);
SET @Q1_CT = LAST_INSERT_ID();
INSERT INTO lesson_option (core_lesson_id, emotion_id, option_text, is_correct) VALUES
(@Q1_CT, @EMO_VUI, 'Vui vẻ', 1), (@Q1_CT, @EMO_BUON, 'Buồn bã', 0), (@Q1_CT, @EMO_GIAN, 'Tức giận', 0), (@Q1_CT, @EMO_SO, 'Sợ hãi', 0);

-- Câu 2 (Buồn - Kem rơi)
INSERT INTO lesson_core (lesson_type_id, emotion_group_id, image_id, situation_text, correct_emotion_id) VALUES
(@CONTEXT_TYPE, @LEVEL_1, 7, 'Ôi không! Cây kem của bạn bị rơi xuống đất mất rồi. Bạn ấy sẽ cảm thấy sao nhỉ?', @EMO_BUON);
SET @Q2_CT = LAST_INSERT_ID();
INSERT INTO lesson_option (core_lesson_id, emotion_id, option_text, is_correct) VALUES
(@Q2_CT, @EMO_VUI, 'Vui vẻ', 0), (@Q2_CT, @EMO_BUON, 'Buồn bã', 1), (@Q2_CT, @EMO_GIAN, 'Tức giận', 0), (@Q2_CT, @EMO_SO, 'Sợ hãi', 0);

-- Câu 3 (Vui - Đi chơi)
INSERT INTO lesson_core (lesson_type_id, emotion_group_id, image_id, situation_text, correct_emotion_id) VALUES
(@CONTEXT_TYPE, @LEVEL_1, 1, 'Cuối tuần được đi công viên chơi. Cảm xúc của bạn là gì?', @EMO_VUI);
SET @Q3_CT = LAST_INSERT_ID();
INSERT INTO lesson_option (core_lesson_id, emotion_id, option_text, is_correct) VALUES
(@Q3_CT, @EMO_VUI, 'Vui vẻ', 1), (@Q3_CT, @EMO_BUON, 'Buồn bã', 0), (@Q3_CT, @EMO_GIAN, 'Tức giận', 0), (@Q3_CT, @EMO_SO, 'Sợ hãi', 0);

-- Câu 4 (Buồn - Đồ chơi hỏng)
INSERT INTO lesson_core (lesson_type_id, emotion_group_id, image_id, situation_text, correct_emotion_id) VALUES
(@CONTEXT_TYPE, @LEVEL_1, 8, 'Món đồ chơi yêu thích của con bị hỏng rồi. Con cảm thấy thế nào?', @EMO_BUON);
SET @Q4_CT = LAST_INSERT_ID();
INSERT INTO lesson_option (core_lesson_id, emotion_id, option_text, is_correct) VALUES
(@Q4_CT, @EMO_VUI, 'Vui vẻ', 0), (@Q4_CT, @EMO_BUON, 'Buồn bã', 1), (@Q4_CT, @EMO_GIAN, 'Tức giận', 0), (@Q4_CT, @EMO_SO, 'Sợ hãi', 0);

-- Câu 5 (Giận - Bị lấy đồ)
INSERT INTO lesson_core (lesson_type_id, emotion_group_id, image_id, situation_text, correct_emotion_id) VALUES
(@CONTEXT_TYPE, @LEVEL_1, 5, 'Bạn hàng xóm giành lấy đồ chơi của con. Con cảm thấy thế nào?', @EMO_GIAN);
SET @Q5_CT = LAST_INSERT_ID();
INSERT INTO lesson_option (core_lesson_id, emotion_id, option_text, is_correct) VALUES
(@Q5_CT, @EMO_VUI, 'Vui vẻ', 0), (@Q5_CT, @EMO_BUON, 'Buồn bã', 0), (@Q5_CT, @EMO_GIAN, 'Tức giận', 1), (@Q5_CT, @EMO_SO, 'Sợ hãi', 0);


-- --- 3. MATCHING (5 Cặp = 10 Thẻ, pair_key là EMO + STT) ---
INSERT INTO matching_card (emotion_group_id, image_id, emotion_id, pair_key) VALUES
(@LEVEL_1, 9, @EMO_VUI, 'VUI_1'),    -- Cặp 1: Vui vẻ (ảnh mặt)
(@LEVEL_1, 10, @EMO_VUI, 'VUI_1'),   -- Cặp 1: Vui vẻ (ảnh chữ)
(@LEVEL_1, 11, @EMO_BUON, 'BUON_1'),  -- Cặp 2: Buồn bã (ảnh mặt)
(@LEVEL_1, 12, @EMO_BUON, 'BUON_1'),  -- Cặp 2: Buồn bã (ảnh chữ)
(@LEVEL_1, 13, @EMO_VUI, 'VUI_2'),    -- Cặp 3: Vui vẻ 2 (ảnh mặt)
(@LEVEL_1, 14, @EMO_VUI, 'VUI_2'),   -- Cặp 3: Vui vẻ 2 (ảnh chữ)
(@LEVEL_1, 15, @EMO_BUON, 'BUON_2'),  -- Cặp 4: Buồn bã 2 (ảnh mặt)
(@LEVEL_1, 16, @EMO_BUON, 'BUON_2'),  -- Cặp 4: Buồn bã 2 (ảnh chữ)
(@LEVEL_1, 17, @EMO_GIAN, 'GIAN_1'),  -- Cặp 5: Giận dữ (ảnh mặt)
(@LEVEL_1, 18, @EMO_GIAN, 'GIAN_1');  -- Cặp 5: Giận dữ (ảnh chữ)


-- --- 4. EMOTION TRAINING (1 Bài) ---
INSERT INTO lesson_training_ai (lesson_type_id, emotion_group_id, target_emotion_id, instruction, media_guide_id, success_message, tips) VALUES
(@TRAINING_TYPE, @LEVEL_1, @EMO_VUI, 'Hãy nhìn vào gương và cười thật tươi giống bạn nhỏ này nhé!', 19, 'Nụ cười của con tỏa nắng quá! Con đã làm rất tốt!', 'Hãy mở miệng rộng hơn một chút và nhấc khóe môi lên cao nào!');


-- --- 5. AI (1 Bài) ---
INSERT INTO lesson_training_ai (lesson_type_id, emotion_group_id, target_emotion_id, instruction, video_url, success_message, tips) VALUES
(@AI_TYPE, @LEVEL_1, @EMO_VUI, 'Quan sát video và bắt chước biểu cảm Vui vẻ. AI sẽ chấm điểm!', 'https://www.youtube.com/embed/example-happy-face-video', 'AI nói con đã biểu lộ Vui vẻ rất thành công!', 'Hãy thử giữ biểu cảm lâu hơn một chút nhé.');

SELECT 'Dữ liệu mẫu đã được thêm thành công!' AS Status;

# =======================
# ================================
# =====================================

-- ========================================================
-- BƯỚC 0: KHÔI PHỤC CẤU HÌNH BIẾN (Chạy đoạn này để tránh lỗi NULL)
-- ========================================================

-- 1. Lấy ID Loại bài học
SET @FLASHCARD_TYPE = (SELECT id FROM lesson_type WHERE code = 'FLASHCARD');
SET @MATCHING_TYPE = (SELECT id FROM lesson_type WHERE code = 'MATCHING');
SET @CONTEXT_TYPE = (SELECT id FROM lesson_type WHERE code = 'CONTEXT');
SET @TRAINING_TYPE = (SELECT id FROM lesson_type WHERE code = 'TRAINING');
SET @AI_TYPE = (SELECT id FROM lesson_type WHERE code = 'AI');

-- 2. Lấy ID Cấp độ (Level)
SET @LEVEL_2 = (SELECT id FROM emotion_group WHERE name = 'Cấp độ 2');
SET @LEVEL_3 = (SELECT id FROM emotion_group WHERE name = 'Cấp độ 3');

-- 3. Lấy ID Cảm xúc
SET @EMO_VUI = (SELECT id FROM emotion WHERE name = 'Vui vẻ');
SET @EMO_BUON = (SELECT id FROM emotion WHERE name = 'Buồn bã');
SET @EMO_GIAN = (SELECT id FROM emotion WHERE name = 'Tức giận');
SET @EMO_SO = (SELECT id FROM emotion WHERE name = 'Sợ hãi');
SET @EMO_NGAC = (SELECT id FROM emotion WHERE name = 'Ngạc nhiên');
SET @EMO_GHE = (SELECT id FROM emotion WHERE name = 'Ghê tởm');


-- ========================================================
-- BẮT ĐẦU THÊM DỮ LIỆU CẤP ĐỘ 2 (GIẬN DỮ & SỢ HÃI)
-- ========================================================

-- A. Thêm Media Asset cho Cấp độ 2
-- Flashcard (ID sẽ tự tăng tiếp theo, ví dụ từ 20)
INSERT INTO media_asset (type, url, emotion_id) VALUES
('IMAGE', 'https://example.com/images/flashcard/angry_2.jpg', @EMO_GIAN),   -- FC-Giận 2
('IMAGE', 'https://example.com/images/flashcard/fear_1.jpg', @EMO_SO),     -- FC-Sợ 1
('IMAGE', 'https://example.com/images/flashcard/angry_3.jpg', @EMO_GIAN),   -- FC-Giận 3
('IMAGE', 'https://example.com/images/flashcard/fear_2.jpg', @EMO_SO);     -- FC-Sợ 2

-- Lấy ID của các ảnh vừa thêm để dùng bên dưới (Giả sử ID bắt đầu từ 20 sau khi Level 1 đã dùng 19 ID)
-- Lưu ý: Nếu database bạn đã chạy nhiều lần, ID có thể khác.
-- Để an toàn, chúng ta lấy ID mới nhất ngược lại:
SET @IMG_FC_SO_2 = LAST_INSERT_ID();       -- ID 23
SET @IMG_FC_GIAN_3 = @IMG_FC_SO_2 - 1;     -- ID 22
SET @IMG_FC_SO_1 = @IMG_FC_SO_2 - 2;       -- ID 21
SET @IMG_FC_GIAN_2 = @IMG_FC_SO_2 - 3;     -- ID 20

-- Context Media
INSERT INTO media_asset (type, url, emotion_id) VALUES
('IMAGE', 'https://example.com/images/context/thunder.jpg', @EMO_SO),       -- CT-Sấm sét
('IMAGE', 'https://example.com/images/context/broken_vase.jpg', @EMO_GIAN), -- CT-Vỡ bình
('IMAGE', 'https://example.com/images/context/dark_room.jpg', @EMO_SO);     -- CT-Phòng tối

SET @IMG_CT_DARK = LAST_INSERT_ID();      -- ID 26
SET @IMG_CT_VASE = @IMG_CT_DARK - 1;      -- ID 25
SET @IMG_CT_THUNDER = @IMG_CT_DARK - 2;   -- ID 24

-- Matching Media (8 thẻ)
INSERT INTO media_asset (type, url, emotion_id) VALUES
('IMAGE', 'https://example.com/images/matching/gian_2_face.jpg', @EMO_GIAN),
('IMAGE', 'https://example.com/images/matching/gian_2_text.jpg', @EMO_GIAN),
('IMAGE', 'https://example.com/images/matching/so_1_face.jpg', @EMO_SO),
('IMAGE', 'https://example.com/images/matching/so_1_text.jpg', @EMO_SO),
('IMAGE', 'https://example.com/images/matching/gian_3_face.jpg', @EMO_GIAN),
('IMAGE', 'https://example.com/images/matching/gian_3_text.jpg', @EMO_GIAN),
('IMAGE', 'https://example.com/images/matching/so_2_face.jpg', @EMO_SO),
('IMAGE', 'https://example.com/images/matching/so_2_text.jpg', @EMO_SO);

SET @IMG_MC_SO_2_TXT = LAST_INSERT_ID(); -- ID 34
-- Các ID trước đó lần lượt là 33, 32, ... 27

-- Training Media
INSERT INTO media_asset (type, url, emotion_id) VALUES
('IMAGE', 'https://example.com/images/training/guide_gian.jpg', @EMO_GIAN);
SET @IMG_TR_GIAN = LAST_INSERT_ID(); -- ID 35


-- B. FLASHCARD CẤP ĐỘ 2 (5 Câu)
-- Câu 1 (Giận)
INSERT INTO lesson_core (lesson_type_id, emotion_group_id, image_id, situation_text, correct_emotion_id) VALUES
(@FLASHCARD_TYPE, @LEVEL_2, @IMG_FC_GIAN_2, 'Bạn nhỏ này đang cau mày, bạn ấy cảm thấy gì?', @EMO_GIAN);
SET @Q1_FC_L2 = LAST_INSERT_ID();
INSERT INTO lesson_option (core_lesson_id, emotion_id, option_text, is_correct) VALUES
(@Q1_FC_L2, @EMO_GIAN, 'Tức giận', 1), (@Q1_FC_L2, @EMO_VUI, 'Vui vẻ', 0), (@Q1_FC_L2, @EMO_BUON, 'Buồn bã', 0), (@Q1_FC_L2, @EMO_SO, 'Sợ hãi', 0);

-- Câu 2 (Sợ)
INSERT INTO lesson_core (lesson_type_id, emotion_group_id, image_id, situation_text, correct_emotion_id) VALUES
(@FLASHCARD_TYPE, @LEVEL_2, @IMG_FC_SO_1, 'Đôi mắt mở to, miệng há hốc, đây là biểu cảm gì?', @EMO_SO);
SET @Q2_FC_L2 = LAST_INSERT_ID();
INSERT INTO lesson_option (core_lesson_id, emotion_id, option_text, is_correct) VALUES
(@Q2_FC_L2, @EMO_SO, 'Sợ hãi', 1), (@Q2_FC_L2, @EMO_GIAN, 'Tức giận', 0), (@Q2_FC_L2, @EMO_VUI, 'Vui vẻ', 0), (@Q2_FC_L2, @EMO_BUON, 'Buồn bã', 0);

-- Câu 3 (Giận)
INSERT INTO lesson_core (lesson_type_id, emotion_group_id, image_id, situation_text, correct_emotion_id) VALUES
(@FLASHCARD_TYPE, @LEVEL_2, @IMG_FC_GIAN_3, 'Hai tay nắm chặt, mặt đỏ bừng, bạn ấy đang...?', @EMO_GIAN);
SET @Q3_FC_L2 = LAST_INSERT_ID();
INSERT INTO lesson_option (core_lesson_id, emotion_id, option_text, is_correct) VALUES
(@Q3_FC_L2, @EMO_GIAN, 'Tức giận', 1), (@Q3_FC_L2, @EMO_VUI, 'Vui vẻ', 0), (@Q3_FC_L2, @EMO_BUON, 'Buồn bã', 0), (@Q3_FC_L2, @EMO_SO, 'Sợ hãi', 0);

-- Câu 4 (Sợ)
INSERT INTO lesson_core (lesson_type_id, emotion_group_id, image_id, situation_text, correct_emotion_id) VALUES
(@FLASHCARD_TYPE, @LEVEL_2, @IMG_FC_SO_2, 'Bạn nhỏ đang co rúm người lại, bạn ấy cảm thấy thế nào?', @EMO_SO);
SET @Q4_FC_L2 = LAST_INSERT_ID();
INSERT INTO lesson_option (core_lesson_id, emotion_id, option_text, is_correct) VALUES
(@Q4_FC_L2, @EMO_SO, 'Sợ hãi', 1), (@Q4_FC_L2, @EMO_GIAN, 'Tức giận', 0), (@Q4_FC_L2, @EMO_VUI, 'Vui vẻ', 0), (@Q4_FC_L2, @EMO_BUON, 'Buồn bã', 0);

-- Câu 5 (Ôn tập - Dùng lại ảnh Giận 2)
INSERT INTO lesson_core (lesson_type_id, emotion_group_id, image_id, situation_text, correct_emotion_id) VALUES
(@FLASHCARD_TYPE, @LEVEL_2, @IMG_FC_GIAN_2, 'Biểu cảm nào phù hợp với khuôn mặt này?', @EMO_GIAN);
SET @Q5_FC_L2 = LAST_INSERT_ID();
INSERT INTO lesson_option (core_lesson_id, emotion_id, option_text, is_correct) VALUES
(@Q5_FC_L2, @EMO_GIAN, 'Tức giận', 1), (@Q5_FC_L2, @EMO_VUI, 'Vui vẻ', 0), (@Q5_FC_L2, @EMO_BUON, 'Buồn bã', 0), (@Q5_FC_L2, @EMO_SO, 'Sợ hãi', 0);


-- C. CONTEXT CẤP ĐỘ 2 (5 Câu)
-- Câu 1 (Sợ - Sấm sét)
INSERT INTO lesson_core (lesson_type_id, emotion_group_id, image_id, situation_text, correct_emotion_id) VALUES
(@CONTEXT_TYPE, @LEVEL_2, @IMG_CT_THUNDER, 'Bên ngoài trời mưa to và có tiếng sấm rất lớn. Bạn nhỏ cảm thấy thế nào?', @EMO_SO);
SET @Q1_CT_L2 = LAST_INSERT_ID();
INSERT INTO lesson_option (core_lesson_id, emotion_id, option_text, is_correct) VALUES
(@Q1_CT_L2, @EMO_SO, 'Sợ hãi', 1), (@Q1_CT_L2, @EMO_GIAN, 'Tức giận', 0), (@Q1_CT_L2, @EMO_VUI, 'Vui vẻ', 0), (@Q1_CT_L2, @EMO_BUON, 'Buồn bã', 0);

-- Câu 2 (Giận - Vỡ bình)
INSERT INTO lesson_core (lesson_type_id, emotion_group_id, image_id, situation_text, correct_emotion_id) VALUES
(@CONTEXT_TYPE, @LEVEL_2, @IMG_CT_VASE, 'Em trai làm vỡ bình hoa yêu thích của chị. Chị cảm thấy sao?', @EMO_GIAN);
SET @Q2_CT_L2 = LAST_INSERT_ID();
INSERT INTO lesson_option (core_lesson_id, emotion_id, option_text, is_correct) VALUES
(@Q2_CT_L2, @EMO_GIAN, 'Tức giận', 1), (@Q2_CT_L2, @EMO_SO, 'Sợ hãi', 0), (@Q2_CT_L2, @EMO_VUI, 'Vui vẻ', 0), (@Q2_CT_L2, @EMO_BUON, 'Buồn bã', 0);

-- Câu 3 (Sợ - Bóng tối)
INSERT INTO lesson_core (lesson_type_id, emotion_group_id, image_id, situation_text, correct_emotion_id) VALUES
(@CONTEXT_TYPE, @LEVEL_2, @IMG_CT_DARK, 'Phòng tối om và có bóng đen lạ. Cảm giác lúc này là gì?', @EMO_SO);
SET @Q3_CT_L2 = LAST_INSERT_ID();
INSERT INTO lesson_option (core_lesson_id, emotion_id, option_text, is_correct) VALUES
(@Q3_CT_L2, @EMO_SO, 'Sợ hãi', 1), (@Q3_CT_L2, @EMO_GIAN, 'Tức giận', 0), (@Q3_CT_L2, @EMO_VUI, 'Vui vẻ', 0), (@Q3_CT_L2, @EMO_BUON, 'Buồn bã', 0);

-- Câu 4 (Giận - Bị trêu chọc, dùng ảnh cũ)
INSERT INTO lesson_core (lesson_type_id, emotion_group_id, image_id, situation_text, correct_emotion_id) VALUES
(@CONTEXT_TYPE, @LEVEL_2, @IMG_FC_GIAN_3, 'Bạn cùng lớp trêu chọc kiểu tóc mới của Lan. Lan cảm thấy...', @EMO_GIAN);
SET @Q4_CT_L2 = LAST_INSERT_ID();
INSERT INTO lesson_option (core_lesson_id, emotion_id, option_text, is_correct) VALUES
(@Q4_CT_L2, @EMO_GIAN, 'Tức giận', 1), (@Q4_CT_L2, @EMO_SO, 'Sợ hãi', 0), (@Q4_CT_L2, @EMO_VUI, 'Vui vẻ', 0), (@Q4_CT_L2, @EMO_BUON, 'Buồn bã', 0);

-- Câu 5 (Sợ - Chó dữ, dùng ảnh cũ)
INSERT INTO lesson_core (lesson_type_id, emotion_group_id, image_id, situation_text, correct_emotion_id) VALUES
(@CONTEXT_TYPE, @LEVEL_2, @IMG_FC_SO_2, 'Một con chó to sủa rất dữ dội khi đi ngang qua. Bạn sẽ cảm thấy...?', @EMO_SO);
SET @Q5_CT_L2 = LAST_INSERT_ID();
INSERT INTO lesson_option (core_lesson_id, emotion_id, option_text, is_correct) VALUES
(@Q5_CT_L2, @EMO_SO, 'Sợ hãi', 1), (@Q5_CT_L2, @EMO_GIAN, 'Tức giận', 0), (@Q5_CT_L2, @EMO_VUI, 'Vui vẻ', 0), (@Q5_CT_L2, @EMO_BUON, 'Buồn bã', 0);


-- D. MATCHING CẤP ĐỘ 2
-- Sử dụng các biến ID vừa tạo để insert chính xác
INSERT INTO matching_card (emotion_group_id, image_id, emotion_id, pair_key) VALUES
(@LEVEL_2, @IMG_MC_SO_2_TXT - 7, @EMO_GIAN, 'GIAN_1'), -- ID 27
(@LEVEL_2, @IMG_MC_SO_2_TXT - 6, @EMO_GIAN, 'GIAN_1'), -- ID 28
(@LEVEL_2, @IMG_MC_SO_2_TXT - 5, @EMO_SO, 'SO_1'),     -- ID 29
(@LEVEL_2, @IMG_MC_SO_2_TXT - 4, @EMO_SO, 'SO_1'),     -- ID 30
(@LEVEL_2, @IMG_MC_SO_2_TXT - 3, @EMO_GIAN, 'GIAN_2'), -- ID 31
(@LEVEL_2, @IMG_MC_SO_2_TXT - 2, @EMO_GIAN, 'GIAN_2'), -- ID 32
(@LEVEL_2, @IMG_MC_SO_2_TXT - 1, @EMO_SO, 'SO_2'),     -- ID 33
(@LEVEL_2, @IMG_MC_SO_2_TXT,     @EMO_SO, 'SO_2');     -- ID 34

-- E. TRAINING & AI CẤP ĐỘ 2
INSERT INTO lesson_training_ai (lesson_type_id, emotion_group_id, target_emotion_id, instruction, media_guide_id, success_message, tips) VALUES
(@TRAINING_TYPE, @LEVEL_2, @EMO_GIAN, 'Thử cau mày và mím môi để thể hiện sự Tức giận nào!', @IMG_TR_GIAN, 'Đúng rồi, trông con rất uy quyền!', 'Hãy thử nhíu lông mày lại gần nhau hơn nhé.');

INSERT INTO lesson_training_ai (lesson_type_id, emotion_group_id, target_emotion_id, instruction, video_url, success_message, tips) VALUES
(@AI_TYPE, @LEVEL_2, @EMO_SO, 'Hãy làm khuôn mặt Sợ hãi giống trong video nhé!', 'https://www.youtube.com/embed/example-fear-face-video', 'Tuyệt vời, AI đã nhận ra sự Sợ hãi!', 'Mở to mắt và miệng ra thêm chút nữa nào.');


-- ========================================================
-- BẮT ĐẦU THÊM DỮ LIỆU CẤP ĐỘ 3 (NGẠC NHIÊN & GHÊ TỞM)
-- ========================================================

-- A. Thêm Media Asset cho Cấp độ 3
-- Flashcard
INSERT INTO media_asset (type, url, emotion_id) VALUES
('IMAGE', 'https://example.com/images/flashcard/surprise_1.jpg', @EMO_NGAC),   -- FC-Ngạc 1
('IMAGE', 'https://example.com/images/flashcard/disgust_1.jpg', @EMO_GHE),     -- FC-Ghê 1
('IMAGE', 'https://example.com/images/flashcard/surprise_2.jpg', @EMO_NGAC),   -- FC-Ngạc 2
('IMAGE', 'https://example.com/images/flashcard/disgust_2.jpg', @EMO_GHE);     -- FC-Ghê 2

SET @IMG_FC_GHE_2 = LAST_INSERT_ID();      -- ID 39
SET @IMG_FC_NGAC_2 = @IMG_FC_GHE_2 - 1;    -- ID 38
SET @IMG_FC_GHE_1 = @IMG_FC_GHE_2 - 2;     -- ID 37
SET @IMG_FC_NGAC_1 = @IMG_FC_GHE_2 - 3;    -- ID 36

-- Context
INSERT INTO media_asset (type, url, emotion_id) VALUES
('IMAGE', 'https://example.com/images/context/surprise_party.jpg', @EMO_NGAC), -- CT-Tiệc
('IMAGE', 'https://example.com/images/context/bad_food.jpg', @EMO_GHE),        -- CT-Đồ ăn hỏng
('IMAGE', 'https://example.com/images/context/gift_box.jpg', @EMO_NGAC);       -- CT-Hộp quà

SET @IMG_CT_GIFT = LAST_INSERT_ID();      -- ID 42
SET @IMG_CT_FOOD = @IMG_CT_GIFT - 1;      -- ID 41
SET @IMG_CT_PARTY = @IMG_CT_GIFT - 2;     -- ID 40

-- Matching (8 thẻ)
INSERT INTO media_asset (type, url, emotion_id) VALUES
('IMAGE', 'https://example.com/images/matching/ngac_1_face.jpg', @EMO_NGAC),
('IMAGE', 'https://example.com/images/matching/ngac_1_text.jpg', @EMO_NGAC),
('IMAGE', 'https://example.com/images/matching/ghe_1_face.jpg', @EMO_GHE),
('IMAGE', 'https://example.com/images/matching/ghe_1_text.jpg', @EMO_GHE),
('IMAGE', 'https://example.com/images/matching/ngac_2_face.jpg', @EMO_NGAC),
('IMAGE', 'https://example.com/images/matching/ngac_2_text.jpg', @EMO_NGAC),
('IMAGE', 'https://example.com/images/matching/ghe_2_face.jpg', @EMO_GHE),
('IMAGE', 'https://example.com/images/matching/ghe_2_text.jpg', @EMO_GHE);

SET @IMG_MC_GHE_2_TXT = LAST_INSERT_ID(); -- ID 50
-- Các ID trước đó: 49, 48... 43

-- Training Media
INSERT INTO media_asset (type, url, emotion_id) VALUES
('IMAGE', 'https://example.com/images/training/guide_ngac.jpg', @EMO_NGAC);
SET @IMG_TR_NGAC = LAST_INSERT_ID(); -- ID 51


-- B. FLASHCARD CẤP ĐỘ 3
INSERT INTO lesson_core (lesson_type_id, emotion_group_id, image_id, situation_text, correct_emotion_id) VALUES
(@FLASHCARD_TYPE, @LEVEL_3, @IMG_FC_NGAC_1, 'Mắt mở to, miệng hình chữ O, bạn ấy đang...?', @EMO_NGAC);
SET @Q1_FC_L3 = LAST_INSERT_ID();
INSERT INTO lesson_option (core_lesson_id, emotion_id, option_text, is_correct) VALUES
(@Q1_FC_L3, @EMO_NGAC, 'Ngạc nhiên', 1), (@Q1_FC_L3, @EMO_GHE, 'Ghê tởm', 0), (@Q1_FC_L3, @EMO_VUI, 'Vui vẻ', 0), (@Q1_FC_L3, @EMO_SO, 'Sợ hãi', 0);

INSERT INTO lesson_core (lesson_type_id, emotion_group_id, image_id, situation_text, correct_emotion_id) VALUES
(@FLASHCARD_TYPE, @LEVEL_3, @IMG_FC_GHE_1, 'Mũi nhăn lại, miệng méo xệch, đây là cảm xúc gì?', @EMO_GHE);
SET @Q2_FC_L3 = LAST_INSERT_ID();
INSERT INTO lesson_option (core_lesson_id, emotion_id, option_text, is_correct) VALUES
(@Q2_FC_L3, @EMO_GHE, 'Ghê tởm', 1), (@Q2_FC_L3, @EMO_NGAC, 'Ngạc nhiên', 0), (@Q2_FC_L3, @EMO_BUON, 'Buồn bã', 0), (@Q2_FC_L3, @EMO_GIAN, 'Tức giận', 0);

INSERT INTO lesson_core (lesson_type_id, emotion_group_id, image_id, situation_text, correct_emotion_id) VALUES
(@FLASHCARD_TYPE, @LEVEL_3, @IMG_FC_NGAC_2, 'Bạn nhỏ trông rất bất ngờ, đó là cảm xúc...?', @EMO_NGAC);
SET @Q3_FC_L3 = LAST_INSERT_ID();
INSERT INTO lesson_option (core_lesson_id, emotion_id, option_text, is_correct) VALUES
(@Q3_FC_L3, @EMO_NGAC, 'Ngạc nhiên', 1), (@Q3_FC_L3, @EMO_GHE, 'Ghê tởm', 0), (@Q3_FC_L3, @EMO_VUI, 'Vui vẻ', 0), (@Q3_FC_L3, @EMO_SO, 'Sợ hãi', 0);

INSERT INTO lesson_core (lesson_type_id, emotion_group_id, image_id, situation_text, correct_emotion_id) VALUES
(@FLASHCARD_TYPE, @LEVEL_3, @IMG_FC_GHE_2, 'Biểu cảm này thường thấy khi ngửi mùi khó chịu, đó là...?', @EMO_GHE);
SET @Q4_FC_L3 = LAST_INSERT_ID();
INSERT INTO lesson_option (core_lesson_id, emotion_id, option_text, is_correct) VALUES
(@Q4_FC_L3, @EMO_GHE, 'Ghê tởm', 1), (@Q4_FC_L3, @EMO_NGAC, 'Ngạc nhiên', 0), (@Q4_FC_L3, @EMO_BUON, 'Buồn bã', 0), (@Q4_FC_L3, @EMO_GIAN, 'Tức giận', 0);

INSERT INTO lesson_core (lesson_type_id, emotion_group_id, image_id, situation_text, correct_emotion_id) VALUES
(@FLASHCARD_TYPE, @LEVEL_3, @IMG_FC_NGAC_1, 'Khuôn mặt này thể hiện sự...?', @EMO_NGAC);
SET @Q5_FC_L3 = LAST_INSERT_ID();
INSERT INTO lesson_option (core_lesson_id, emotion_id, option_text, is_correct) VALUES
(@Q5_FC_L3, @EMO_NGAC, 'Ngạc nhiên', 1), (@Q5_FC_L3, @EMO_GHE, 'Ghê tởm', 0), (@Q5_FC_L3, @EMO_VUI, 'Vui vẻ', 0), (@Q5_FC_L3, @EMO_SO, 'Sợ hãi', 0);


-- C. CONTEXT CẤP ĐỘ 3
INSERT INTO lesson_core (lesson_type_id, emotion_group_id, image_id, situation_text, correct_emotion_id) VALUES
(@CONTEXT_TYPE, @LEVEL_3, @IMG_CT_PARTY, 'Mọi người tổ chức sinh nhật bất ngờ cho Lan. Lan cảm thấy...?', @EMO_NGAC);
SET @Q1_CT_L3 = LAST_INSERT_ID();
INSERT INTO lesson_option (core_lesson_id, emotion_id, option_text, is_correct) VALUES
(@Q1_CT_L3, @EMO_NGAC, 'Ngạc nhiên', 1), (@Q1_CT_L3, @EMO_GHE, 'Ghê tởm', 0), (@Q1_CT_L3, @EMO_VUI, 'Vui vẻ', 0), (@Q1_CT_L3, @EMO_BUON, 'Buồn bã', 0);

INSERT INTO lesson_core (lesson_type_id, emotion_group_id, image_id, situation_text, correct_emotion_id) VALUES
(@CONTEXT_TYPE, @LEVEL_3, @IMG_CT_FOOD, 'Miếng bánh mì bị mốc xanh và có mùi lạ. Bạn cảm thấy...?', @EMO_GHE);
SET @Q2_CT_L3 = LAST_INSERT_ID();
INSERT INTO lesson_option (core_lesson_id, emotion_id, option_text, is_correct) VALUES
(@Q2_CT_L3, @EMO_GHE, 'Ghê tởm', 1), (@Q2_CT_L3, @EMO_NGAC, 'Ngạc nhiên', 0), (@Q2_CT_L3, @EMO_VUI, 'Vui vẻ', 0), (@Q2_CT_L3, @EMO_SO, 'Sợ hãi', 0);

INSERT INTO lesson_core (lesson_type_id, emotion_group_id, image_id, situation_text, correct_emotion_id) VALUES
(@CONTEXT_TYPE, @LEVEL_3, @IMG_CT_GIFT, 'Mở hộp quà ra và thấy một chú hề bật lò xo lên. Bạn cảm thấy...?', @EMO_NGAC);
SET @Q3_CT_L3 = LAST_INSERT_ID();
INSERT INTO lesson_option (core_lesson_id, emotion_id, option_text, is_correct) VALUES
(@Q3_CT_L3, @EMO_NGAC, 'Ngạc nhiên', 1), (@Q3_CT_L3, @EMO_GHE, 'Ghê tởm', 0), (@Q3_CT_L3, @EMO_VUI, 'Vui vẻ', 0), (@Q3_CT_L3, @EMO_SO, 'Sợ hãi', 0);

INSERT INTO lesson_core (lesson_type_id, emotion_group_id, image_id, situation_text, correct_emotion_id) VALUES
(@CONTEXT_TYPE, @LEVEL_3, @IMG_FC_GHE_1, 'Giẫm phải một vũng bùn bẩn thỉu. Cảm giác lúc đó là...?', @EMO_GHE);
SET @Q4_CT_L3 = LAST_INSERT_ID();
INSERT INTO lesson_option (core_lesson_id, emotion_id, option_text, is_correct) VALUES
(@Q4_CT_L3, @EMO_GHE, 'Ghê tởm', 1), (@Q4_CT_L3, @EMO_NGAC, 'Ngạc nhiên', 0), (@Q4_CT_L3, @EMO_VUI, 'Vui vẻ', 0), (@Q4_CT_L3, @EMO_SO, 'Sợ hãi', 0);

INSERT INTO lesson_core (lesson_type_id, emotion_group_id, image_id, situation_text, correct_emotion_id) VALUES
(@CONTEXT_TYPE, @LEVEL_3, @IMG_FC_NGAC_2, 'Bỗng nhiên thấy pháo hoa nổ đùng đoàng trên trời. Bạn sẽ...?', @EMO_NGAC);
SET @Q5_CT_L3 = LAST_INSERT_ID();
INSERT INTO lesson_option (core_lesson_id, emotion_id, option_text, is_correct) VALUES
(@Q5_CT_L3, @EMO_NGAC, 'Ngạc nhiên', 1), (@Q5_CT_L3, @EMO_GHE, 'Ghê tởm', 0), (@Q5_CT_L3, @EMO_VUI, 'Vui vẻ', 0), (@Q5_CT_L3, @EMO_SO, 'Sợ hãi', 0);


-- D. MATCHING CẤP ĐỘ 3
INSERT INTO matching_card (emotion_group_id, image_id, emotion_id, pair_key) VALUES
(@LEVEL_3, @IMG_MC_GHE_2_TXT - 7, @EMO_NGAC, 'NGAC_1'), -- ID 43
(@LEVEL_3, @IMG_MC_GHE_2_TXT - 6, @EMO_NGAC, 'NGAC_1'), -- ID 44
(@LEVEL_3, @IMG_MC_GHE_2_TXT - 5, @EMO_GHE, 'GHE_1'),  -- ID 45
(@LEVEL_3, @IMG_MC_GHE_2_TXT - 4, @EMO_GHE, 'GHE_1'),  -- ID 46
(@LEVEL_3, @IMG_MC_GHE_2_TXT - 3, @EMO_NGAC, 'NGAC_2'), -- ID 47
(@LEVEL_3, @IMG_MC_GHE_2_TXT - 2, @EMO_NGAC, 'NGAC_2'), -- ID 48
(@LEVEL_3, @IMG_MC_GHE_2_TXT - 1, @EMO_GHE, 'GHE_2'),  -- ID 49
(@LEVEL_3, @IMG_MC_GHE_2_TXT,     @EMO_GHE, 'GHE_2');  -- ID 50

-- E. TRAINING & AI CẤP ĐỘ 3
INSERT INTO lesson_training_ai (lesson_type_id, emotion_group_id, target_emotion_id, instruction, media_guide_id, success_message, tips) VALUES
(@TRAINING_TYPE, @LEVEL_3, @EMO_NGAC, 'Mở to mắt và miệng hình chữ O để thể hiện sự Ngạc nhiên nhé!', @IMG_TR_NGAC, 'Wow, trông con thật bất ngờ!', 'Hãy thử nhướn lông mày lên cao nữa nào.');

INSERT INTO lesson_training_ai (lesson_type_id, emotion_group_id, target_emotion_id, instruction, video_url, success_message, tips) VALUES
(@AI_TYPE, @LEVEL_3, @EMO_GHE, 'Hãy làm khuôn mặt Ghê tởm khi thấy đồ ăn hỏng nhé!', 'https://www.youtube.com/embed/example-disgust-face-video', 'AI đã nhận ra sự Ghê tởm của con!', 'Nhăn mũi lại một chút nữa là hoàn hảo.');

SELECT 'Dữ liệu Cấp độ 2 & 3 đã được thêm thành công!' AS Status;