import express from 'express';
import db from '../config/db.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

// ==========================================
// LẤY THÔNG TIN PROFILE (GET /api/user/profile)
// ==========================================
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id; // Lấy ID từ token đã decode qua middleware

        // 1. Lấy thông tin cơ bản từ bảng user
        const [users] = await db.execute(
            'SELECT id, username, parent_name, email, avatar FROM user WHERE id = ?', 
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        const user = users[0];

        // 2. Tính tổng số sao (Total Correct) từ bảng thống kê
        // 🔥 FIX TÊN CỘT: SỬ DỤNG 'total_correct_count' (tên cột trong schema mới)
        const [stats] = await db.execute(
            'SELECT SUM(total_correct_count) as total_stars FROM user_progress_stat WHERE user_id = ?',
            [userId]
        );
        const totalStars = stats[0].total_stars || 0;

        // 3. Tính Streak (Tạm thời trả về 0 hoặc random vì DB chưa có bảng log ngày)
        // Bạn có thể phát triển thêm bảng `daily_login_log` để tính cái này chính xác
        const currentStreak = 0; 

        // 4. Trả về đúng cấu trúc mà Frontend Vue đang cần
        res.json({
            userInfo: {
                childName: user.username,      // Map 'username' DB -> 'childName' Frontend
                parentName: user.parent_name,
                email: user.email,
                avatar: user.avatar || 'https://i.pravatar.cc/300' // Avatar mặc định nếu null
            },
            stars: totalStars,
            currentStreak: currentStreak
        });

    } catch (error) {
        console.error("Lỗi lấy profile:", error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// ==========================================
// CẬP NHẬT AVATAR (Optional)
// ==========================================
router.put('/update-avatar', verifyToken, async (req, res) => {
    const { avatarUrl } = req.body;
    try {
        await db.execute('UPDATE user SET avatar = ? WHERE id = ?', [avatarUrl, req.user.id]);
        res.json({ message: 'Cập nhật avatar thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi cập nhật' });
    }
});

export default router;