<template>
  <div class="min-h-screen md:pl-64 pt-6 bg-slate-50 font-quicksand">
    <Sidebar />

    <div class="max-w-4xl mx-auto px-6 pb-20">
      <h1 class="text-3xl font-bold text-slate-700 mb-8 flex items-center gap-3">
        <i class="fas fa-chart-line text-rose-400"></i> Báo cáo học tập
      </h1>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md transition">
          <div class="text-3xl mb-2"><i class="fas fa-star text-yellow-400"></i></div>
          <div class="text-2xl font-bold text-slate-700">{{ store.stars }}</div>
          <div class="text-xs text-slate-400 uppercase font-bold">Tổng sao</div>
        </div>
        <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md transition">
          <div class="text-3xl mb-2"><i class="fas fa-fire text-orange-500"></i></div>
          <div class="text-2xl font-bold text-slate-700">{{ store.currentStreak }}</div>
          <div class="text-xs text-slate-400 uppercase font-bold">Ngày liên tiếp</div>
        </div>
        <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md transition">
          <div class="text-3xl mb-2"><i class="fas fa-bullseye text-sky-500"></i></div>
          <div class="text-2xl font-bold text-sky-500">{{ store.reportData.accuracy }}%</div>
          <div class="text-xs text-slate-400 uppercase font-bold">Độ chính xác</div>
        </div>
        <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md transition">
          <div class="text-3xl mb-2"><i class="fas fa-smile text-emerald-400"></i></div>
          <div class="text-2xl font-bold text-emerald-400">{{ store.reportData.dominantEmotion }}</div>
          <div class="text-xs text-slate-400 uppercase font-bold">Cảm xúc chủ đạo</div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

        <div class="lg:col-span-1 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
          <h2 class="text-lg font-bold text-slate-700 mb-4 w-full text-left">Biểu đồ năng lực</h2>
          <div class="w-full h-64 relative">
            <Radar 
              v-if="chartReady && computedRadarData" 
              :data="computedRadarData" 
              :options="radarOptions" 
            />
            <div v-else class="flex items-center justify-center h-full text-slate-400">
               <i class="fas fa-spinner fa-spin mr-2"></i> Đang tải biểu đồ...
            </div>
          </div>
          <p class="text-xs text-slate-400 mt-4 text-center italic">So sánh khả năng nhận diện các loại cảm xúc</p>
        </div>

        <div class="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h2 class="text-lg font-bold text-slate-700 mb-6">Chi tiết kỹ năng</h2>
          <div class="space-y-5">
            <div class="group">
              <div class="flex justify-between mb-1">
                <span class="font-bold text-slate-600 text-sm flex items-center gap-2"><i class="fas fa-book text-amber-400 w-5 text-center"></i> Nhận diện (Flashcard)</span>
                <span class="font-bold text-amber-500 text-sm">92%</span>
              </div>
              <div class="h-2.5 bg-slate-100 rounded-full overflow-hidden"><div class="h-full bg-amber-300 rounded-full w-[92%]"></div></div>
            </div>
            <div class="text-center text-slate-400 text-xs italic mt-4">
                (Dữ liệu chi tiết đang được cập nhật từ hệ thống AI)
             </div>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-lg font-bold text-slate-700">Nhật ký hoạt động</h2>
          <button class="text-sky-400 text-sm font-bold hover:underline">Xem tất cả</button>
        </div>

        <div class="space-y-0 relative">
          <div class="absolute left-6 top-4 bottom-4 w-0.5 bg-slate-100"></div>

          <div v-for="(log, index) in store.reportData.recentLogs" :key="index"
               class="flex items-start gap-4 p-3 hover:bg-slate-50 rounded-xl transition relative z-10">
            
            <div class="w-12 h-12 rounded-full flex items-center justify-center text-xl shrink-0 border-4 border-white shadow-sm"
                 :class="log.is_correct ? 'bg-emerald-100 text-emerald-500' : 'bg-rose-100 text-rose-500'">
               <i v-if="log.is_correct" class="fas fa-check"></i>
               <i v-else class="fas fa-times"></i>
            </div>

            <div class="flex-1">
              <div class="flex justify-between">
                <p class="font-bold text-slate-700">
                    {{ log.lesson_type }} 
                    <span v-if="log.emotion_name" class="font-normal text-slate-500">- {{ log.emotion_name }}</span>
                </p>
                <span v-if="log.is_correct" class="font-bold text-emerald-400 text-sm">+5 ⭐</span>
                <span v-else class="font-bold text-slate-300 text-sm">0 ⭐</span>
              </div>
              <p class="text-xs text-slate-400 mt-1">{{ formatDate(log.answered_at) }}</p>
            </div>
          </div>

          <div v-if="!store.reportData.recentLogs || store.reportData.recentLogs.length === 0" class="text-center py-6 text-slate-400">
            Chưa có hoạt động nào được ghi lại.
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

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('vi-VN', { hour: '2-digit', minute:'2-digit', day: '2-digit', month: '2-digit' });
};

// Computed property để tạo dữ liệu cho Chart an toàn
const computedRadarData = computed(() => {
  // 1. Kiểm tra an toàn: Nếu store chưa có dữ liệu
  if (!store.reportData || !store.reportData.radarData || store.reportData.radarData.length === 0) {
    return null; 
  }

  // 2. Trả về cấu trúc dữ liệu chuẩn
  return {
    labels: ['Vui vẻ', 'Buồn bã', 'Tức giận', 'Sợ hãi', 'Ngạc nhiên', 'Ghê tởm'],
    datasets: [
      {
        label: 'Điểm kỹ năng',
        backgroundColor: 'rgba(251, 113, 133, 0.2)',
        borderColor: '#fb7185',
        pointBackgroundColor: '#fb7185',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#fb7185',
        data: store.reportData.radarData // Dữ liệu từ API
      }
    ]
  };
});

const radarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    r: {
      angleLines: { display: true },
      suggestedMin: 0,
      suggestedMax: 100,
      ticks: { stepSize: 20, display: false }
    }
  },
  plugins: { legend: { display: false } }
};

onMounted(async () => {
    // Gọi API lấy dữ liệu báo cáo
    await store.fetchReportData();
    // Đánh dấu là đã sẵn sàng để vẽ biểu đồ
    chartReady.value = true;
});
</script>