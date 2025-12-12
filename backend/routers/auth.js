import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; // <--- ĐÃ THÊM DÒNG NÀY ĐỂ SỬA LỖI
import db from '../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// ==========================================
// ĐĂNG KÝ (SIGN UP)
// ==========================================
router.post('/register', async (req, res) => {
    const { username, parent_name, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Vui lòng nhập Tên của bé, Email và Mật khẩu' });
    }

    try {
        const [existingUsers] = await db.execute('SELECT * FROM user WHERE email = ?', [email]);
        
        if (existingUsers.length > 0) {
            return res.status(409).json({ message: 'Email này đã được sử dụng.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const validParentName = parent_name || '';

        await db.execute(
            'INSERT INTO user (username, parent_name, email, password) VALUES (?, ?, ?, ?)', 
            [username, validParentName, email, hashedPassword]
        );

        res.status(201).json({ message: 'Đăng ký thành công! Chào mừng bé đến với ứng dụng.' });

    } catch (error) {
        console.error("Lỗi đăng ký:", error);
        res.status(500).json({ message: 'Lỗi hệ thống, vui lòng thử lại sau.' });
    }
});

// ==========================================
// ĐĂNG NHẬP (LOGIN)
// ==========================================
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu' });
    }

    try {
        const [users] = await db.execute('SELECT * FROM user WHERE email = ?', [email]);
        
        if (users.length === 0) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
        }

        // Tạo Token (Cần import jwt ở trên cùng thì dòng này mới chạy được)
        const token = jwt.sign(
            { id: user.id, email: user.email, username: user.username }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        res.json({
            message: 'Đăng nhập thành công',
            token: token,
            user: {
                id: user.id,
                username: user.username,
                parent_name: user.parent_name,
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server khi đăng nhập' });
    }
});

export default router;