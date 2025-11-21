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
  // CẬP NHẬT: Thêm 'emotion_training: false' vào object lessons
  const levels = ref([
    { 
      id: 1, 
      name: 'Cấp độ 1: Vui & Buồn', 
      locked: false, 
      chestClaimed: false,
      lessons: { flashcard: false, matching: false, context: false, emotion_training: false, ai: false } 
    },
    { 
      id: 2, 
      name: 'Cấp độ 2: Giận & Sợ', 
      locked: true, 
      chestClaimed: false,
      lessons: { flashcard: false, matching: false, context: false, emotion_training: false, ai: false }
    },
    {
      id: 3,
      name: 'Cấp độ 3: Ngạc nhiên & Ghê tởm',
      locked: true, 
      chestClaimed: false,
      lessons: { flashcard: false, matching: false, context: false, emotion_training: false, ai: false }
    }
  ]);

  // CẬP NHẬT: Thêm 'emotion_training' vào đúng thứ tự luồng học
  // flashcard -> matching -> context -> emotion_training -> ai
  const lessonOrder = ['flashcard', 'matching', 'context', 'emotion_training', 'ai'];

  // 2. ACTIONS (Hành động sửa dữ liệu)
  
  function addStars(count) {
    stars.value += count;
  }

  // HÀM HOÀN THÀNH BÀI HỌC (Logic tổng quát - Không cần sửa gì thêm)
  function completeLesson(levelId, lessonType) {
    const levelIndex = levels.value.findIndex(l => l.id == levelId);
    if (levelIndex === -1) return;
    
    const level = levels.value[levelIndex];

    // Đánh dấu bài này đã xong
    level.lessons[lessonType] = true;

    // Kiểm tra xem đã xong hết Level này chưa (dựa trên lessonOrder mới)
    const isLevelCompleted = lessonOrder.every(type => level.lessons[type] === true);

    // Nếu xong hết -> Mở khóa Level tiếp theo
    if (isLevelCompleted) {
        const nextLevel = levels.value[levelIndex + 1];
        if (nextLevel) {
            nextLevel.locked = false;
        }
    }
  }

  // HÀM KIỂM TRA KHÓA (Logic tổng quát - Tự động chạy theo lessonOrder mới)
  function isLessonLocked(levelId, lessonType) {
    const level = levels.value.find(l => l.id == levelId);
    
    if (!level || level.locked) return true;

    const currentIndex = lessonOrder.indexOf(lessonType);
    
    // Nếu là bài đầu tiên -> Mở
    if (currentIndex === 0) return false;

    // Kiểm tra bài đứng TRƯỚC nó đã xong chưa
    const previousLessonType = lessonOrder[currentIndex - 1];
    
    if (!level.lessons[previousLessonType]) return true;
    
    return false; 
  }

  function claimChest(levelId) {
    const level = levels.value.find(l => l.id == levelId);
    if (level) {
      level.chestClaimed = true;
      stars.value += 20;
    }
  }

  function logout() {
    console.log("Đã đăng xuất");
  }

  return { stars, currentStreak, levels, userInfo, 
    addStars, completeLesson, isLessonLocked, 
    logout, claimChest };
});