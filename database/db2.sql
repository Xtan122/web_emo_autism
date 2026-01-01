DROP DATABASE IF EXISTS autism_learning_v2;
CREATE DATABASE autism_learning_v2 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE autism_learning_v2;

-- ========================================================
-- 1. CẤU TRÚC BẢNG (Giữ nguyên)
-- ========================================================
CREATE TABLE emotion_group (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

CREATE TABLE emotion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    group_id INT,
    FOREIGN KEY (group_id) REFERENCES emotion_group(id) ON DELETE SET NULL
);

CREATE TABLE lesson_type (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE media_asset (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('IMAGE', 'VIDEO', 'AUDIO') NOT NULL,
    url VARCHAR(255) NOT NULL,
    emotion_id INT,
    FOREIGN KEY (emotion_id) REFERENCES emotion(id) ON DELETE SET NULL
);

CREATE TABLE lesson_core (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lesson_type_id INT NOT NULL,
    emotion_group_id INT NOT NULL,
    image_id INT,
    situation_text TEXT NOT NULL,
    correct_emotion_id INT NOT NULL,
    FOREIGN KEY (lesson_type_id) REFERENCES lesson_type(id),
    FOREIGN KEY (emotion_group_id) REFERENCES emotion_group(id),
    FOREIGN KEY (image_id) REFERENCES media_asset(id) ON DELETE SET NULL,
    FOREIGN KEY (correct_emotion_id) REFERENCES emotion(id)
);

CREATE TABLE lesson_option (
    id INT AUTO_INCREMENT PRIMARY KEY,
    core_lesson_id INT NOT NULL,
    emotion_id INT NOT NULL,
    option_text VARCHAR(255),
    is_correct TINYINT(1) DEFAULT 0,
    FOREIGN KEY (core_lesson_id) REFERENCES lesson_core(id) ON DELETE CASCADE,
    FOREIGN KEY (emotion_id) REFERENCES emotion(id)
);

CREATE TABLE matching_card (
    id INT AUTO_INCREMENT PRIMARY KEY,
    emotion_group_id INT NOT NULL,
    image_id INT NOT NULL,
    emotion_id INT NOT NULL,
    pair_key VARCHAR(50) NOT NULL,
    FOREIGN KEY (emotion_group_id) REFERENCES emotion_group(id),
    FOREIGN KEY (image_id) REFERENCES media_asset(id),
    FOREIGN KEY (emotion_id) REFERENCES emotion(id)
);

CREATE TABLE lesson_training_ai (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lesson_type_id INT NOT NULL,
    emotion_group_id INT NOT NULL,
    target_emotion_id INT NOT NULL,
    instruction TEXT,
    media_guide_id INT,
    video_url VARCHAR(255),
    success_message TEXT,
    tips TEXT,
    FOREIGN KEY (lesson_type_id) REFERENCES lesson_type(id),
    FOREIGN KEY (emotion_group_id) REFERENCES emotion_group(id),
    FOREIGN KEY (target_emotion_id) REFERENCES emotion(id),
    FOREIGN KEY (media_guide_id) REFERENCES media_asset(id) ON DELETE SET NULL
);

CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    password VARCHAR(255),
    parent_name VARCHAR(100),
    avatar VARCHAR(255) DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_activity_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    lesson_type_id INT NOT NULL,
    lesson_ref_id INT NOT NULL,
    chosen_emotion_id INT,
    is_correct TINYINT(1) DEFAULT NULL,
    score INT DEFAULT 0,
    session_duration INT,
    answered_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_type_id) REFERENCES lesson_type(id)
);

CREATE TABLE user_progress_stat (
    user_id INT NOT NULL,
    lesson_type_id INT NOT NULL,
    emotion_group_id INT NOT NULL,
    total_play INT NOT NULL DEFAULT 0,
    total_correct_count INT NOT NULL DEFAULT 0,
    last_played_at DATETIME,
    PRIMARY KEY (user_id, lesson_type_id, emotion_group_id),
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_type_id) REFERENCES lesson_type(id),
    FOREIGN KEY (emotion_group_id) REFERENCES emotion_group(id)
);

-- ========================================================
-- 2. CẤU HÌNH DỮ LIỆU CƠ BẢN
-- ========================================================

INSERT INTO lesson_type (code, name) VALUES
('FLASHCARD', 'Học Flashcard'),
('MATCHING', 'Nối cặp cảm xúc'),
('CONTEXT', 'Tình huống & Ngữ cảnh'),
('TRAINING', 'Tập biểu cảm'),
('AI', 'AI Nhận diện');

INSERT INTO emotion_group (name, description) VALUES
('Cấp độ 1', 'Cảm xúc cơ bản: Vui vẻ & Buồn bã'),
('Cấp độ 2', 'Cảm xúc nâng cao: Giận dữ & Sợ hãi'),
('Cấp độ 3', 'Cảm xúc phức tạp: Ngạc nhiên & Ghê tởm');

-- SET ID Variables
SET @LEVEL_1 = 1; SET @LEVEL_2 = 2; SET @LEVEL_3 = 3;
SET @FLASHCARD = 1; SET @MATCHING = 2; SET @CONTEXT = 3; SET @TRAINING = 4; SET @AI = 5;

INSERT INTO emotion (name, group_id) VALUES
('Vui vẻ', @LEVEL_1), ('Buồn bã', @LEVEL_1),
('Tức giận', @LEVEL_2), ('Sợ hãi', @LEVEL_2),
('Ngạc nhiên', @LEVEL_3), ('Ghê tởm', @LEVEL_3);

SET @VUI = 1; SET @BUON = 2; SET @GIAN = 3; SET @SO = 4; SET @NGAC = 5; SET @GHE = 6;

-- ========================================================
-- 3. INSERT MEDIA & CONTENT (SỬ DỤNG S3 HTTPS URL)
-- ========================================================

-- --- LEVEL 1: VUI & BUỒN ---

-- 1. Insert Media cho Level 1
INSERT INTO media_asset (type, url, emotion_id) VALUES
-- Flashcard (1-5)
('IMAGE', 'https://emotions-bucket.s3.us-east-1.amazonaws.com/happy/smile1.jpg', @VUI),
('IMAGE', 'https://emotions-bucket.s3.us-east-1.amazonaws.com/sad/s1.jpg', @BUON),
('IMAGE', 'https://emotions-bucket.s3.us-east-1.amazonaws.com/happy/smile2.jpg', @VUI),
('IMAGE', 'https://emotions-bucket.s3.us-east-1.amazonaws.com/sad/s2.jpg', @BUON),
('IMAGE', 'https://emotions-bucket.s3.us-east-1.amazonaws.com/angry/an1.jpg', @GIAN),

-- Context (6-8)
('IMAGE', 'https://emotions-bucket.s3.us-east-1.amazonaws.com/happy/smile3.jpg', @VUI),
('IMAGE', 'https://emotions-bucket.s3.us-east-1.amazonaws.com/sad/s3.jpg', @BUON),
('IMAGE', 'https://emotions-bucket.s3.us-east-1.amazonaws.com/sad/s5.jpg', @BUON),

-- Matching (9-16) - Cần nhiều ảnh khác nhau để ghép cặp
('IMAGE', 'https://emotions-bucket.s3.us-east-1.amazonaws.com/happy/smile4.jpg', @VUI), -- Vui A
('IMAGE', 'https://emotions-bucket.s3.us-east-1.amazonaws.com/happy/smile5.jpg', @VUI), -- Vui B (Ghép cặp với Vui A)
('IMAGE', 'https://emotions-bucket.s3.us-east-1.amazonaws.com/sad/s6.jpg', @BUON),      -- Buồn A
('IMAGE', 'https://emotions-bucket.s3.us-east-1.amazonaws.com/sad/s7.jpg', @BUON),      -- Buồn B (Ghép cặp với Buồn A)
('IMAGE', 'https://emotions-bucket.s3.us-east-1.amazonaws.com/happy/smile7.jpg', @VUI), -- Vui C
('IMAGE', 'https://emotions-bucket.s3.us-east-1.amazonaws.com/happy/smile8.jpg', @VUI), -- Vui D (Ghép cặp với Vui C)
('IMAGE', 'https://emotions-bucket.s3.us-east-1.amazonaws.com/sad/s8.jpg', @BUON),      -- Buồn C
('IMAGE', 'https://emotions-bucket.s3.us-east-1.amazonaws.com/sad/s9.jpg', @BUON),      -- Buồn D (Ghép cặp với Buồn C)

-- Guide (17)
('IMAGE', 'https://emotions-bucket.s3.us-east-1.amazonaws.com/happy/smile6.jpg', @VUI);

-- 2. Insert Content Level 1

-- Flashcard
INSERT INTO lesson_core (lesson_type_id, emotion_group_id, image_id, situation_text, correct_emotion_id) VALUES
(@FLASHCARD, @LEVEL_1, 1, 'Bạn nhỏ này đang cảm thấy gì?', @VUI),
(@FLASHCARD, @LEVEL_1, 2, 'Khuôn mặt này thể hiện điều gì?', @BUON),
(@FLASHCARD, @LEVEL_1, 3, 'Bạn ấy có đang hạnh phúc không?', @VUI),
(@FLASHCARD, @LEVEL_1, 4, 'Bạn nhỏ này đang cảm thấy như thế nào?', @BUON);

-- Options (Tự động thêm options cho các câu hỏi trên - Code giả định logic thêm options)
INSERT INTO lesson_option (core_lesson_id, emotion_id, option_text, is_correct) 
SELECT id, @VUI, 'Vui vẻ', 1 FROM lesson_core WHERE image_id = 1;
INSERT INTO lesson_option (core_lesson_id, emotion_id, option_text, is_correct) 
SELECT id, @BUON, 'Buồn bã', 0 FROM lesson_core WHERE image_id = 1;

INSERT INTO lesson_option (core_lesson_id, emotion_id, option_text, is_correct) 
SELECT id, @BUON, 'Buồn bã', 1 FROM lesson_core WHERE image_id = 2;
INSERT INTO lesson_option (core_lesson_id, emotion_id, option_text, is_correct) 
SELECT id, @VUI, 'Vui vẻ', 0 FROM lesson_core WHERE image_id = 2;

-- Matching Level 1 (Ghép cặp khác ảnh - cùng cảm xúc)
INSERT INTO matching_card (emotion_group_id, image_id, emotion_id, pair_key) VALUES
(@LEVEL_1, 9, @VUI, 'PAIR_VUI_1'),  -- smile4
(@LEVEL_1, 10, @VUI, 'PAIR_VUI_1'), -- smile5 (Khác ảnh, cùng key PAIR_VUI_1)

(@LEVEL_1, 11, @BUON, 'PAIR_BUON_1'), -- s6
(@LEVEL_1, 12, @BUON, 'PAIR_BUON_1'), -- s7 (Khác ảnh, cùng key PAIR_BUON_1)

(@LEVEL_1, 13, @VUI, 'PAIR_VUI_2'),  -- smile7
(@LEVEL_1, 14, @VUI, 'PAIR_VUI_2'),  -- smile8

(@LEVEL_1, 15, @BUON, 'PAIR_BUON_2'), -- s8
(@LEVEL_1, 16, @BUON, 'PAIR_BUON_2'); -- s9

-- --- LEVEL 2: GIẬN & SỢ ---

-- 1. Insert Media Level 2
INSERT INTO media_asset (type, url, emotion_id) VALUES
-- Flashcard
('IMAGE', 'https://emotions-bucket.s3.us-east-1.amazonaws.com/angry/an3.jpg', @GIAN), -- 18
('IMAGE', 'https://emotions-bucket.s3.us-east-1.amazonaws.com/scared/sc1.jpg', @SO),  -- 19
('IMAGE', 'https://emotions-bucket.s3.us-east-1.amazonaws.com/angry/an4.jpg', @GIAN), -- 20
('IMAGE', 'https://emotions-bucket.s3.us-east-1.amazonaws.com/scared/sc2.jpg', @SO),  -- 21
-- Context
('IMAGE', 'https://emotions-bucket.s3.us-east-1.amazonaws.com/angry/an5.jpg', @GIAN), -- 22
('IMAGE', 'https://emotions-bucket.s3.us-east-1.amazonaws.com/scared/sc3.jpg', @SO),  -- 23
-- Matching (Khác ảnh - cùng cảm xúc)
('IMAGE', 'https://emotions-bucket.s3.us-east-1.amazonaws.com/angry/an6.jpg', @GIAN), -- 24 (Giận A)
('IMAGE', 'https://emotions-bucket.s3.us-east-1.amazonaws.com/angry/an7.jpg', @GIAN), -- 25 (Giận B)
('IMAGE', 'https://emotions-bucket.s3.us-east-1.amazonaws.com/scared/sc4.jpg', @SO),  -- 26 (Sợ A)
('IMAGE', 'https://emotions-bucket.s3.us-east-1.amazonaws.com/scared/sc6.jpg', @SO),  -- 27 (Sợ B - né sc5.png)
('IMAGE', 'https://emotions-bucket.s3.us-east-1.amazonaws.com/angry/an8.jpg', @GIAN), -- 28 (Giận C)
('IMAGE', 'https://emotions-bucket.s3.us-east-1.amazonaws.com/angry/an9.jpg', @GIAN), -- 29 (Giận D)
-- Guide
('IMAGE', 'https://emotions-bucket.s3.us-east-1.amazonaws.com/angry/an2.jpg', @GIAN); -- 30

-- 2. Content Level 2
INSERT INTO lesson_core (lesson_type_id, emotion_group_id, image_id, situation_text, correct_emotion_id) VALUES
(@FLASHCARD, @LEVEL_2, 18, 'Bạn nhỏ cau mày, cảm thấy gì?', @GIAN),
(@FLASHCARD, @LEVEL_2, 19, 'Mắt mở to, miệng há hốc là gì?', @SO);

INSERT INTO lesson_option (core_lesson_id, emotion_id, option_text, is_correct) VALUES 
(5, @GIAN, 'Tức giận', 1), (5, @SO, 'Sợ hãi', 0); -- ID tiếp theo là 5
INSERT INTO lesson_option (core_lesson_id, emotion_id, option_text, is_correct) VALUES 
(6, @SO, 'Sợ hãi', 1), (6, @GIAN, 'Tức giận', 0);

-- Matching Level 2
INSERT INTO matching_card (emotion_group_id, image_id, emotion_id, pair_key) VALUES
(@LEVEL_2, 24, @GIAN, 'PAIR_GIAN_1'),
(@LEVEL_2, 25, @GIAN, 'PAIR_GIAN_1'), -- an6 nối với an7

(@LEVEL_2, 26, @SO, 'PAIR_SO_1'),
(@LEVEL_2, 27, @SO, 'PAIR_SO_1'),    -- sc4 nối với sc6

(@LEVEL_2, 28, @GIAN, 'PAIR_GIAN_2'),
(@LEVEL_2, 29, @GIAN, 'PAIR_GIAN_2'); -- an8 nối với an9


-- --- LEVEL 3: NGẠC NHIÊN & GHÊ TỞM ---

-- 1. Insert Media Level 3
INSERT INTO media_asset (type, url, emotion_id) VALUES
-- Flashcard
('IMAGE', 'https://emotions-bucket.s3.us-east-1.amazonaws.com/surprise/sp1.jpg', @NGAC), -- 31
('IMAGE', 'https://emotions-bucket.s3.us-east-1.amazonaws.com/disgusted/d1.jpg', @GHE),  -- 32
('IMAGE', 'https://emotions-bucket.s3.us-east-1.amazonaws.com/surprise/sp2.jpg', @NGAC), -- 33
('IMAGE', 'https://emotions-bucket.s3.us-east-1.amazonaws.com/disgusted/d2.jpg', @GHE),  -- 34
-- Context
('IMAGE', 'https://emotions-bucket.s3.us-east-1.amazonaws.com/surprise/sp3.jpg', @NGAC), -- 35
('IMAGE', 'https://emotions-bucket.s3.us-east-1.amazonaws.com/disgusted/d3.jpg', @GHE),  -- 36
-- Matching (Khác ảnh - cùng cảm xúc)
('IMAGE', 'https://emotions-bucket.s3.us-east-1.amazonaws.com/surprise/sp4.jpg', @NGAC), -- 37
('IMAGE', 'https://emotions-bucket.s3.us-east-1.amazonaws.com/surprise/sp5.jpg', @NGAC), -- 38
('IMAGE', 'https://emotions-bucket.s3.us-east-1.amazonaws.com/disgusted/d4.jpg', @GHE),  -- 39
('IMAGE', 'https://emotions-bucket.s3.us-east-1.amazonaws.com/disgusted/d5.jpg', @GHE),  -- 40
('IMAGE', 'https://emotions-bucket.s3.us-east-1.amazonaws.com/surprise/sp7.jpg', @NGAC), -- 41
('IMAGE', 'https://emotions-bucket.s3.us-east-1.amazonaws.com/surprise/sp8.jpg', @NGAC), -- 42
-- Guide
('IMAGE', 'https://emotions-bucket.s3.us-east-1.amazonaws.com/surprise/sp6.jpg', @NGAC); -- 43

-- 2. Content Level 3
INSERT INTO lesson_core (lesson_type_id, emotion_group_id, image_id, situation_text, correct_emotion_id) VALUES
(@FLASHCARD, @LEVEL_3, 31, 'Mắt mở to, miệng chữ O?', @NGAC),
(@FLASHCARD, @LEVEL_3, 32, 'Mũi nhăn lại, miệng méo?', @GHE);

INSERT INTO lesson_option (core_lesson_id, emotion_id, option_text, is_correct) VALUES 
(7, @NGAC, 'Ngạc nhiên', 1), (7, @GHE, 'Ghê tởm', 0);
INSERT INTO lesson_option (core_lesson_id, emotion_id, option_text, is_correct) VALUES 
(8, @GHE, 'Ghê tởm', 1), (8, @NGAC, 'Ngạc nhiên', 0);

-- Matching Level 3
INSERT INTO matching_card (emotion_group_id, image_id, emotion_id, pair_key) VALUES
(@LEVEL_3, 37, @NGAC, 'PAIR_NGAC_1'),
(@LEVEL_3, 38, @NGAC, 'PAIR_NGAC_1'), -- sp4 nối với sp5

(@LEVEL_3, 39, @GHE, 'PAIR_GHE_1'),
(@LEVEL_3, 40, @GHE, 'PAIR_GHE_1'),   -- d4 nối với d5

(@LEVEL_3, 41, @NGAC, 'PAIR_NGAC_2'),
(@LEVEL_3, 42, @NGAC, 'PAIR_NGAC_2'); -- sp7 nối với sp8

-- Training
INSERT INTO lesson_training_ai (lesson_type_id, emotion_group_id, target_emotion_id, instruction, media_guide_id, success_message, tips) VALUES
(@TRAINING, @LEVEL_1, @VUI, 'Cười thật tươi nào!', 17, 'Tốt lắm!', 'Mở miệng rộng ra nhé'),
(@TRAINING, @LEVEL_2, @GIAN, 'Cau mày lại nào!', 30, 'Trông rất uy quyền!', 'Nhíu mày chặt hơn chút'),
(@TRAINING, @LEVEL_3, @NGAC, 'Mắt mở to ra!', 43, 'Bất ngờ chưa!', 'Nhướn mày lên cao');

SELECT 'Dữ liệu đã cập nhật: URL HTTPS chuẩn & Matching nối ảnh khác nhau thành công!' AS Status;