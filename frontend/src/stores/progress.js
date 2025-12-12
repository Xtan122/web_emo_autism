// frontend/stores/progress.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useProgressStore = defineStore('progress', () => {
  // --- STATE ---
  const stars = ref(0);
  const currentStreak = ref(0);
  const levels = ref([]);
  
  // State riêng cho Report
  const reportData = ref({
    accuracy: 0,
    dominantEmotion: '...',
    radarData: [0, 0, 0, 0, 0, 0], // KHỞI TẠO MẢNG SỐ (Đừng để null hoặc rỗng)
    recentLogs: []
});

  const userInfo = ref({
    parentName: "Phụ Huynh",
    childName: "Bé Bi",
    avatar: "/default-avatar.png"
  });

  // --- ACTIONS ---

  // 1. Lấy Map (đã bao gồm trạng thái khóa từ DB)
  async function fetchLevelsFromAPI() {
    try {
        const response = await axios.get('http://localhost:3000/api/progress-map');
        levels.value = response.data;
        // console.log("Levels loaded:", levels.value);
    } catch (error) {
        console.error("Lỗi tải tiến trình:", error);
    }
  }

  // 2. Lấy dữ liệu Báo cáo
  async function fetchReportData() {
    try {
        const response = await axios.get('http://localhost:3000/api/report');
        const data = response.data;
        
        // Cập nhật State
        stars.value = data.stats.stars;
        currentStreak.value = data.stats.streak;
        
        reportData.value.accuracy = data.stats.accuracy;
        reportData.value.dominantEmotion = data.stats.dominantEmotion;
        reportData.value.radarData = data.radar;
        reportData.value.recentLogs = data.logs;

    } catch (error) {
        console.error("Lỗi tải báo cáo:", error);
    }
  }

  // 3. Logic Check Khóa (Bây giờ chỉ cần check thuộc tính 'locked' từ API trả về)
  function isLessonLocked(levelId, lessonType) {
    const level = levels.value.find(l => l.id == levelId);
    if (!level) return true;
    
    // Nếu Level bị khóa từ DB -> Khóa hết
    if (level.locked) return true;

    // Logic khóa từng bài trong level (Tuần tự)
    const lessonOrder = ['flashcard', 'matching', 'context', 'emotion_training', 'ai'];
    const typeIndex = lessonOrder.indexOf(lessonType);

    if (typeIndex === 0) return false; // Bài đầu luôn mở nếu Level mở

    // Bài trước đó phải hoàn thành (true) thì bài này mới mở
    const prevType = lessonOrder[typeIndex - 1];
    
    // Lưu ý: level.lessons[prevType] trả về true/false từ API
    return !level.lessons[prevType];
  }

  // Các hàm logout, claimChest giữ nguyên...
  function claimChest(levelId) { /* ... */ }

  return { 
    stars, currentStreak, levels, userInfo, reportData, // Export thêm reportData
    fetchLevelsFromAPI, fetchReportData, isLessonLocked, claimChest 
  };
});