<template>
  <div class="min-h-screen md:pl-64 pt-6 bg-slate-50 font-quicksand">
    <Sidebar />

    <div class="max-w-5xl mx-auto px-6 pb-20">
      
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 class="text-3xl font-bold text-slate-700 flex items-center gap-3">
            <i class="fas fa-chart-line text-rose-500"></i> Báo cáo học tập
          </h1>
          <p class="text-slate-400 text-sm mt-1">Theo dõi sự tiến bộ theo Cấp độ và Kỹ năng</p>
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
        
        <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 text-center">
            <div class="text-3xl font-bold text-sky-500">{{ store.reportData.accuracy || 0 }}%</div>
            <div class="text-xs text-slate-400 uppercase font-bold mt-1">Độ chính xác chung</div>
        </div>
        </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        <div class="lg:col-span-1 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
          <h2 class="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
             <i class="fas fa-layer-group text-purple-500"></i> Tiến độ theo Cấp độ
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
             Biểu đồ thể hiện mức độ hoàn thành chính xác của các cấp độ (Level).
          </p>
        </div>

        <div class="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h2 class="text-lg font-bold text-slate-700 mb-6 flex items-center justify-between">
              <span class="flex items-center gap-2"><i class="fas fa-laptop-code text-blue-500"></i> Kỹ năng bài học</span>
              <span class="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  Tỷ lệ chính xác
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
              <p>Chưa có dữ liệu học tập.</p>
          </div>

        </div>
      </div>

      </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Radar } from 'vue-chartjs';
import Sidebar from '../components/Sidebar.vue';
import { useProgressStore } from '../stores/progress';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const store = useProgressStore();
const chartReady = ref(false);
const currentDate = new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

// --- CONFIG RADAR DATA MỚI ---
const computedRadarData = computed(() => {
  // Lấy dữ liệu radar từ store (được API trả về dạng [{label: "Cấp độ 1", score: 80}, ...])
  const radarRaw = store.reportData.radarData; 
  
  if (!radarRaw || radarRaw.length === 0) return null;

  // Tách Label và Data ra 2 mảng riêng cho ChartJS
  const labels = radarRaw.map(item => item.label);
  const data = radarRaw.map(item => item.score);

  return {
    labels: labels,
    datasets: [
      {
        label: 'Độ chính xác (%)',
        backgroundColor: 'rgba(14, 165, 233, 0.2)',
        borderColor: '#0ea5e9',
        pointBackgroundColor: '#0ea5e9',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#0ea5e9',
        pointRadius: 5, // Tăng kích thước điểm vì số lượng điểm ít (3 cấp độ)
        pointHoverRadius: 7,
        data: data 
      }
    ]
  };
});

// Helper Functions hiển thị icon/màu sắc (Giữ nguyên hoặc chỉnh sửa nhẹ)
const getLessonIcon = (code) => {
    const map = { 'FLASHCARD': 'fa-images', 'CONTEXT': 'fa-book-reader', 'MATCHING': 'fa-puzzle-piece', 'TRAINING': 'fa-theater-masks', 'AI': 'fa-robot' };
    return map[code] || 'fa-star';
};

const getLessonSubtitle = (code) => {
    const map = { 'FLASHCARD': 'Nhận diện hình ảnh', 'CONTEXT': 'Hiểu ngữ cảnh', 'MATCHING': 'Ghép cặp cảm xúc', 'TRAINING': 'Thực hành biểu cảm', 'AI': 'Tương tác AI' };
    return map[code] || 'Kỹ năng chung';
};

const getScoreColorText = (score) => score >= 80 ? 'text-emerald-500' : (score >= 50 ? 'text-blue-500' : 'text-orange-500');
const getScoreColorBg = (score) => score >= 80 ? 'bg-emerald-500' : (score >= 50 ? 'bg-blue-500' : 'bg-orange-400');
const getCommentColor = (score) => score >= 80 ? 'text-emerald-600' : (score >= 50 ? 'text-blue-600' : 'text-orange-600');
const getSkillComment = (score) => {
    if (score === 0) return 'Chưa chơi bài này.';
    if (score >= 80) return 'Xuất sắc! Bé làm rất tốt.';
    if (score >= 50) return 'Tốt. Cố gắng thêm chút nữa!';
    return 'Cần luyện tập thêm.';
};

const radarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    r: {
      angleLines: { display: true, color: '#e2e8f0' },
      grid: { color: '#e2e8f0' },
      suggestedMin: 0,
      suggestedMax: 100, // Thang điểm 0-100
      ticks: { stepSize: 20, display: false },
      pointLabels: {
          font: { size: 12, family: "'Quicksand', sans-serif", weight: '700' },
          color: '#475569'
      }
    }
  },
  plugins: { legend: { display: false } }
};

onMounted(async () => {
    await store.fetchReportData();
    chartReady.value = true;
});
</script>