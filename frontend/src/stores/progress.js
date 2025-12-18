import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router'; // Import Router để chuyển trang

export const useProgressStore = defineStore('progress', () => {
  const router = useRouter();

  // --- STATE ---
  const stars = ref(0);
  const currentStreak = ref(0);
  const levels = ref([]);
  const isLoading = ref(false); // Thêm biến loading state

  // State riêng cho Report
  const reportData = ref({
    accuracy: 0,
    dominantEmotion: '...',
    radarData: [0, 0, 0, 0, 0, 0], 
    skillData: [], // Dữ liệu kỹ năng (Flashcard, Matching...)
    recentLogs: []
  });

  const userInfo = ref({
    parentName: "Phụ Huynh",
    childName: "Bé Bi",
    avatar: "/default-avatar.png"
  });

  // --- ACTIONS ---

  // 1. Hàm LOGOUT (Bổ sung để sửa lỗi)
  function logout() {
      // Xóa token
      localStorage.removeItem('token');
      localStorage.removeItem('user_info');
      
      // Reset state về mặc định
      stars.value = 0;
      currentStreak.value = 0;
      reportData.value = { 
          accuracy: 0, 
          dominantEmotion: '...', 
          radarData: [], 
          skillData: [],
          recentLogs: [] 
      };

      // Chuyển về trang login
      // Dùng window.location để refresh lại app cho sạch state
      window.location.href = '/login';
  }

  // 2. Lấy Map
  async function fetchLevelsFromAPI() {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/progress-map', {
            headers: { Authorization: `Bearer ${token}` }
        });
        levels.value = response.data;
    } catch (error) {
        console.error("Lỗi tải tiến trình:", error);
    }
  }

  // 3. Lấy dữ liệu Báo cáo (Đã thêm xử lý Loading)
  async function fetchReportData() {
    isLoading.value = true; // Bắt đầu tải
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.warn("Chưa đăng nhập, không thể tải báo cáo");
            return; 
        }

        const response = await axios.get('http://localhost:3000/api/report', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = response.data;
        
        // Cập nhật State từ API
        stars.value = data.stats.stars;
        currentStreak.value = data.stats.streak;
        
        reportData.value.accuracy = data.stats.accuracy;
        reportData.value.dominantEmotion = data.stats.dominantEmotion;
        reportData.value.radarData = data.radar;
        reportData.value.skillData = data.skills; // Dữ liệu kỹ năng
        reportData.value.recentLogs = data.logs;

    } catch (error) {
        console.error("Lỗi tải báo cáo:", error);
        // Nếu token hết hạn (401), tự động logout
        if (error.response && error.response.status === 401) {
            logout();
        }
    } finally {
        isLoading.value = false; // Kết thúc tải (quan trọng để tắt spinner)
    }
  }

  // 4. Logic Check Khóa
  function isLessonLocked(levelId, lessonType) {
    const level = levels.value.find(l => l.id == levelId);
    if (!level) return true;
    if (level.locked) return true;

    const lessonOrder = ['flashcard', 'matching', 'context', 'emotion_training', 'ai'];
    const typeIndex = lessonOrder.indexOf(lessonType);

    if (typeIndex === 0) return false; 
    const prevType = lessonOrder[typeIndex - 1];
    
    if (!level.lessons) return true;
    return !level.lessons[prevType];
  }

  function addStars(count) {
      stars.value += count;
  }

  // 5. Xử lý Mở Rương
  async function claimChest(levelId) {
      try {
          const level = levels.value.find(l => l.id === levelId);
          if (!level || level.chestClaimed) return;

          const token = localStorage.getItem('token');
          const response = await axios.post(`http://localhost:3000/api/progress-map/claim-chest`, {
              levelId: levelId
          }, {
              headers: { Authorization: `Bearer ${token}` }
          });
          
          const rewardStars = response.data.reward || 10; 
          addStars(rewardStars);
          level.chestClaimed = true; 

      } catch (error) {
          console.error("Lỗi khi mở rương:", error);
      }
  }

  // 🔥 Đừng quên export logout ở đây
  return { 
    stars, currentStreak, levels, userInfo, reportData, isLoading,
    fetchLevelsFromAPI, fetchReportData, isLessonLocked, claimChest, logout, addStars
  };
});