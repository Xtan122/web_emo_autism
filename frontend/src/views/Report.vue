<template>
  <div class="min-h-screen md:pl-64 pt-6 bg-slate-50 font-quicksand">
    <Sidebar />

    <div class="max-w-5xl mx-auto px-6 pb-20">
      
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 class="text-3xl font-bold text-slate-700 flex items-center gap-3">
            <i class="fas fa-chart-line text-rose-500"></i> Báo cáo học tập
          </h1>
          <p class="text-slate-400 text-sm mt-1">Theo dõi sự tiến bộ của bé qua từng ngày</p>
        </div>
        <div class="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 text-slate-500 text-sm font-bold">
           <i class="far fa-calendar-alt mr-2 text-blue-500"></i> {{ currentDate }}
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-all group">
          <div class="w-12 h-12 mx-auto bg-yellow-50 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition">
             <i class="fas fa-star text-2xl text-yellow-400"></i>
          </div>
          <div class="text-3xl font-bold text-slate-700">{{ store.stars }}</div>
          <div class="text-xs text-slate-400 uppercase font-bold tracking-wide mt-1">Tổng sao</div>
        </div>

        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-all group">
          <div class="w-12 h-12 mx-auto bg-orange-50 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition">
             <i class="fas fa-fire text-2xl text-orange-500"></i>
          </div>
          <div class="text-3xl font-bold text-slate-700">{{ store.currentStreak }}</div>
          <div class="text-xs text-slate-400 uppercase font-bold tracking-wide mt-1">Ngày liên tiếp</div>
        </div>

        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-all group">
          <div class="w-12 h-12 mx-auto bg-sky-50 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition">
             <i class="fas fa-bullseye text-2xl text-sky-500"></i>
          </div>
          <div class="text-3xl font-bold text-sky-500">{{ store.reportData.accuracy }}%</div>
          <div class="text-xs text-slate-400 uppercase font-bold tracking-wide mt-1">Độ chính xác</div>
        </div>

        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-all group">
          <div class="w-12 h-12 mx-auto bg-emerald-50 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition">
             <i class="fas fa-smile-beam text-2xl text-emerald-500"></i>
          </div>
          <div class="text-xl font-bold text-emerald-500 truncate px-1" :title="store.reportData.dominantEmotion">
            {{ store.reportData.dominantEmotion }}
          </div>
          <div class="text-xs text-slate-400 uppercase font-bold tracking-wide mt-1">Cảm xúc sở trường</div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        <div class="lg:col-span-1 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
          <h2 class="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
             <i class="fas fa-brain text-purple-500"></i> Nhận thức cảm xúc
          </h2>
          
          <div class="flex-1 min-h-[300px] relative flex items-center justify-center">
            <Radar 
              v-if="chartReady && computedRadarData" 
              :data="computedRadarData" 
              :options="radarOptions" 
            />
            
            <div v-else class="flex flex-col items-center justify-center text-slate-300 gap-3">
               <i class="fas fa-spinner fa-spin text-3xl"></i>
               <span class="text-sm font-medium">Đang tải dữ liệu...</span>
            </div>
          </div>
          
          <p class="text-xs text-slate-400 mt-4 text-center italic border-t pt-3">
             Biểu đồ thể hiện khả năng nhận diện chính xác 6 loại cảm xúc cơ bản.
          </p>
        </div>

        <div class="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h2 class="text-lg font-bold text-slate-700 mb-6 flex items-center justify-between">
              <span class="flex items-center gap-2"><i class="fas fa-laptop-code text-blue-500"></i> Kỹ năng bài học</span>
              <span class="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  Đánh giá trung bình
              </span>
          </h2>
          
          <div v-if="store.reportData.skillData && store.reportData.skillData.length > 0" 
               class="space-y-6 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
            
            <div v-for="skill in store.reportData.skillData" :key="skill.code" class="group">
              <div class="flex justify-between items-end mb-2">
                <div class="flex items-center gap-3">
                   <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-50 text-slate-500 border border-slate-100 shadow-sm group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                       <i class="fas text-lg" :class="getLessonIcon(skill.code)"></i>
                   </div>
                   <div>
                       <h4 class="font-bold text-slate-700 text-sm group-hover:text-blue-600 transition">{{ skill.name }}</h4>
                       <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                           {{ getLessonSubtitle(skill.code) }}
                       </p>
                   </div>
                </div>
                <span class="font-bold text-lg" :class="getScoreColorText(skill.score)">
                    {{ skill.score }}%
                </span>
              </div>
              
              <div class="h-3 bg-slate-100 rounded-full overflow-hidden relative shadow-inner">
                  <div class="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden" 
                       :class="getScoreColorBg(skill.score)"
                       :style="{ width: skill.score + '%' }">
                       <div class="absolute inset-0 bg-white/20 w-full animate-shimmer"></div>
                  </div>
              </div>
              
              <p class="text-xs mt-1.5 pl-14 italic" :class="getCommentColor(skill.score)">
                  <i class="fas fa-comment-dots mr-1"></i> {{ getSkillComment(skill.score) }}
              </p>
            </div>

          </div>
          
          <div v-else class="h-64 flex flex-col items-center justify-center text-slate-300">
              <i class="fas fa-clipboard-list text-5xl mb-3 opacity-20"></i>
              <p>Chưa có dữ liệu kỹ năng.</p>
              <p class="text-sm">Hãy hoàn thành các bài học để xem đánh giá.</p>
          </div>

        </div>
      </div>

      <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-lg font-bold text-slate-700 flex items-center gap-2">
              <i class="fas fa-history text-slate-400"></i> Hoạt động gần đây
          </h2>
        </div>

        <div class="space-y-0 relative">
          <div class="absolute left-6 top-4 bottom-4 w-0.5 bg-slate-100"></div>

          <div v-for="(log, index) in store.reportData.recentLogs" :key="index"
               class="flex items-start gap-4 p-3 hover:bg-slate-50 rounded-xl transition relative z-10 animate-fade-in"
               :style="{ animationDelay: index * 50 + 'ms' }">
            
            <div class="w-12 h-12 rounded-full flex items-center justify-center text-lg shrink-0 border-4 border-white shadow-sm bg-white"
                 :class="log.is_correct ? 'text-emerald-500 ring-2 ring-emerald-100' : 'text-rose-500 ring-2 ring-rose-100'">
               <i v-if="log.is_correct" class="fas fa-check"></i>
               <i v-else class="fas fa-times"></i>
            </div>

            <div class="flex-1">
              <div class="flex justify-between items-start">
                <div>
                    <p class="font-bold text-slate-700">
                        {{ getLessonTypeName(log.lesson_type) }}
                    </p>
                    <p class="text-sm text-slate-500 font-medium mt-0.5">
                        <span class="bg-slate-100 px-2 py-0.5 rounded text-xs text-slate-600 border border-slate-200">
                            {{ log.emotion_name || 'Tổng hợp' }}
                        </span>
                    </p>
                </div>
                <span v-if="log.is_correct" class="font-bold text-emerald-600 text-xs bg-emerald-50 px-2 py-1 rounded border border-emerald-100 shadow-sm">
                    +{{ log.score }} Sao
                </span>
                <span v-else class="font-bold text-slate-400 text-xs bg-slate-50 px-2 py-1 rounded border border-slate-200">
                    0 Sao
                </span>
              </div>
              <p class="text-xs text-slate-400 mt-2 flex items-center gap-1">
                  <i class="far fa-clock"></i> {{ formatDate(log.answered_at) }}
              </p>
            </div>
          </div>

          <div v-if="!store.reportData.recentLogs || store.reportData.recentLogs.length === 0" class="text-center py-10 text-slate-400">
            <p>Chưa có dữ liệu hoạt động.</p>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { 
  Chart as ChartJS, 
  RadialLinearScale, 
  PointElement, 
  LineElement, 
  Filler, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Radar } from 'vue-chartjs';
import Sidebar from '../components/Sidebar.vue';
import { useProgressStore } from '../stores/progress';

// --- CONFIGURATION ---
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const store = useProgressStore();
const chartReady = ref(false);
const currentDate = new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

const emotionLabels = ['Vui vẻ', 'Buồn bã', 'Tức giận', 'Sợ hãi', 'Ngạc nhiên', 'Ghê tởm'];

// --- HELPER FUNCTIONS ---

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('vi-VN', { 
      hour: '2-digit', minute:'2-digit', 
      day: '2-digit', month: '2-digit'
  });
};

// Map code bài học sang tên hiển thị
const getLessonTypeName = (code) => {
    const map = {
        'FLASHCARD': 'Học thẻ Flashcard',
        'CONTEXT': 'Tình huống ngữ cảnh',
        'MATCHING': 'Trò chơi ghép cặp',
        'TRAINING': 'Luyện tập biểu cảm',
        'AI': 'Thử thách cùng AI'
    };
    return map[code] || code;
};

// Subtitle cho từng loại kỹ năng
const getLessonSubtitle = (code) => {
    const map = {
        'FLASHCARD': 'Nhận diện hình ảnh',
        'CONTEXT': 'Hiểu nguyên nhân',
        'MATCHING': 'Phân biệt cảm xúc',
        'TRAINING': 'Bắt chước khuôn mặt',
        'AI': 'Tương tác thực tế'
    };
    return map[code] || 'Kỹ năng tổng hợp';
};

// Map icon cho từng loại bài học
const getLessonIcon = (code) => {
    const map = {
        'FLASHCARD': 'fa-images',
        'CONTEXT': 'fa-book-reader',
        'MATCHING': 'fa-puzzle-piece',
        'TRAINING': 'fa-theater-masks',
        'AI': 'fa-robot'
    };
    return map[code] || 'fa-star';
};

// Màu sắc theo điểm số
const getScoreColorText = (score) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 50) return 'text-blue-500';
    return 'text-orange-500';
};

const getScoreColorBg = (score) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 50) return 'bg-blue-500';
    return 'bg-orange-400';
};

const getCommentColor = (score) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 50) return 'text-blue-600';
    return 'text-orange-600';
};

// Nhận xét tự động dựa trên điểm
const getSkillComment = (score) => {
    if (score === 0) return 'Chưa có dữ liệu. Hãy chơi thử nhé!';
    if (score >= 90) return 'Tuyệt vời! Bé rất thành thạo kỹ năng này.';
    if (score >= 70) return 'Làm tốt lắm! Bé đang tiến bộ rất nhanh.';
    if (score >= 50) return 'Khá tốt. Cần luyện tập thêm một chút.';
    return 'Kỹ năng này cần ba mẹ hỗ trợ bé nhiều hơn.';
};

// --- CHART DATA ---

const computedRadarData = computed(() => {
  if (!store.reportData || !store.reportData.radarData) return null;

  return {
    labels: emotionLabels,
    datasets: [
      {
        label: 'Độ chính xác (%)',
        backgroundColor: 'rgba(14, 165, 233, 0.2)', // Sky Blue
        borderColor: '#0ea5e9',
        pointBackgroundColor: '#0ea5e9',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#0ea5e9',
        pointRadius: 4,
        pointHoverRadius: 6,
        data: store.reportData.radarData 
      }
    ]
  };
});

const radarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    r: {
      angleLines: { display: true, color: '#e2e8f0' },
      grid: { color: '#e2e8f0' },
      suggestedMin: 0,
      suggestedMax: 100,
      ticks: { stepSize: 20, display: false, backdropColor: 'transparent' },
      pointLabels: {
          font: { size: 11, family: "'Quicksand', sans-serif", weight: '700' },
          color: '#64748b'
      }
    }
  },
  plugins: { 
      legend: { display: false },
      tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          titleColor: '#1e293b',
          bodyColor: '#334155',
          borderColor: '#cbd5e1',
          borderWidth: 1,
          padding: 10,
          titleFont: { family: "'Quicksand', sans-serif", size: 13 },
          bodyFont: { family: "'Quicksand', sans-serif", size: 13 },
          displayColors: false,
          callbacks: {
              label: (context) => ` Chính xác: ${context.raw}%`
          }
      }
  }
};

// --- LIFECYCLE ---

onMounted(async () => {
    await store.fetchReportData();
    chartReady.value = true;
});
</script>

<style scoped>
/* Scrollbar tùy chỉnh cho danh sách Skill */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9; 
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1; 
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8; 
}

/* Hiệu ứng fade in */
.animate-fade-in { 
  animation: fadeIn 0.5s ease-out forwards; 
  opacity: 0; 
  transform: translateY(10px);
}
@keyframes fadeIn { 
  to { opacity: 1; transform: translateY(0); } 
}

/* Hiệu ứng bóng sáng chạy qua thanh progress */
@keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
}
.animate-shimmer {
    animation: shimmer 2s infinite linear;
}
</style>