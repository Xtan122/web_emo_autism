import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useProgressStore = defineStore('progress', () => {
  // 1. STATE (Dữ liệu)
  const stars = ref(120); // Số sao hiện tại
  const currentStreak = ref(3); // Chuỗi ngày học liên tiếp
  
  const userInfo = ref({
    parentName: "Phụ Huynh A",
    childName: "Bé Bi",
    email: "phuhuynh@example.com",
    avatar: "https://img.freepik.com/free-vector/cute-astronaut-dance-cartoon-vector-icon-illustration-technology-science-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-3851.jpg"
  });
  
  // Danh sách các level và trạng thái khóa
  // Lưu ý: Cấu trúc lessons cần đồng nhất để logic chạy đúng
  const levels = ref([
    { 
      id: 1, 
      name: 'Cấp độ 1: Vui & Buồn', 
      locked: false, 
      chestClaimed: false,
      lessons: { flashcard: false, matching: false, context: false, ai: false } 
    },
    { 
      id: 2, 
      name: 'Cấp độ 2: Giận & Sợ', 
      locked: true, 
      chestClaimed: false,
      lessons: { flashcard: false, matching: false, context: false, ai: false }
    },
    {
      id: 3,
      name: 'Cấp độ 3: Ngạc nhiên & Ghê tởm',
      locked: true,
      chestClaimed: false,
      lessons: { flashcard: false, matching: false, context: false, ai: false }
    }
  ]);

  // Định nghĩa thứ tự bài học (Flow) để logic tự động hiểu
  // flashcard -> matching -> context -> ai
  const lessonOrder = ['flashcard', 'matching', 'context', 'ai'];

  // 2. ACTIONS (Hành động sửa dữ liệu)
  
  function addStars(count) {
    stars.value += count;
  }

  // HÀM HOÀN THÀNH BÀI HỌC (Đã nâng cấp logic tổng quát)
  function completeLesson(levelId, lessonType) {
    // Tìm level hiện tại
    const levelIndex = levels.value.findIndex(l => l.id == levelId);
    if (levelIndex === -1) return;
    
    const level = levels.value[levelIndex];

    // 1. Đánh dấu bài này đã xong
    level.lessons[lessonType] = true;

    // 2. Kiểm tra xem đã xong hết tất cả bài trong Level này chưa?
    const isLevelCompleted = lessonOrder.every(type => level.lessons[type] === true);

    // 3. Nếu xong hết Level này -> Mở khóa Level tiếp theo (nếu có)
    if (isLevelCompleted) {
        const nextLevel = levels.value[levelIndex + 1];
        if (nextLevel) {
            nextLevel.locked = false;
            // Có thể thêm thông báo hoặc hiệu ứng mở khóa level mới ở UI sau này
        }
    }
  }

  // HÀM KIỂM TRA KHÓA (Đã nâng cấp logic tổng quát)
  function isLessonLocked(levelId, lessonType) {
    const level = levels.value.find(l => l.id == levelId);
    
    // 1. Nếu không tìm thấy level hoặc level bị khóa -> Khóa tất cả bài con
    if (!level || level.locked) return true;

    // 2. Tìm vị trí của bài học hiện tại trong luồng (Order)
    const currentIndex = lessonOrder.indexOf(lessonType);
    
    // Nếu là bài đầu tiên (flashcard) -> Luôn mở (vì level đã mở)
    if (currentIndex === 0) return false;

    // 3. Với các bài sau: Kiểm tra xem bài ĐỨNG NGAY TRƯỚC NÓ đã xong chưa?
    const previousLessonType = lessonOrder[currentIndex - 1];
    
    // Nếu bài trước đó chưa xong -> Khóa bài hiện tại
    if (!level.lessons[previousLessonType]) return true;
    
    return false; // Mở
  }

  function claimChest(levelId) {
    const level = levels.value.find(l => l.id == levelId);
    if (level) {
      level.chestClaimed = true;
      // Cộng thưởng lớn (ví dụ 20 sao)
      stars.value += 20;
    }
  }

  function logout() {
    console.log("Đã đăng xuất");
    // Reset state hoặc chuyển trang login...
  }

  return { stars, currentStreak, levels, userInfo, 
    addStars, completeLesson, isLessonLocked, 
    logout, claimChest };
});