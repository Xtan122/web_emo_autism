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
          <div class="text-2xl font-bold text-sky-500">90%</div>
          <div class="text-xs text-slate-400 uppercase font-bold">Độ chính xác</div>
        </div>
        <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md transition">
          <div class="text-3xl mb-2"><i class="fas fa-smile text-emerald-400"></i></div>
          <div class="text-2xl font-bold text-emerald-400">Vui vẻ</div>
          <div class="text-xs text-slate-400 uppercase font-bold">Cảm xúc chủ đạo</div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

        <div
          class="lg:col-span-1 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
          <h2 class="text-lg font-bold text-slate-700 mb-4 w-full text-left">Biểu đồ năng lực</h2>
          <div class="w-full h-64 relative">
            <Radar :data="radarData" :options="radarOptions" />
          </div>
          <p class="text-xs text-slate-400 mt-4 text-center italic">So sánh khả năng nhận diện các loại cảm xúc</p>
        </div>

        <div class="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h2 class="text-lg font-bold text-slate-700 mb-6">Chi tiết kỹ năng</h2>
          <div class="space-y-5">

            <div class="group">
              <div class="flex justify-between mb-1">
                <span class="font-bold text-slate-600 text-sm flex items-center gap-2"><i
                    class="fas fa-book text-amber-400 w-5 text-center"></i> Nhận diện (Flashcard)</span>
                <span class="font-bold text-amber-500 text-sm">92%</span>
              </div>
              <div class="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  class="h-full bg-amber-300 rounded-full w-[92%] transition-all duration-1000 group-hover:brightness-110">
                </div>
              </div>
            </div>

            <div class="group">
              <div class="flex justify-between mb-1">
                <span class="font-bold text-slate-600 text-sm flex items-center gap-2"><i
                    class="fas fa-puzzle-piece text-rose-400 w-5 text-center"></i> Tư duy liên kết (Matching)</span>
                <span class="font-bold text-rose-500 text-sm">85%</span>
              </div>
              <div class="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  class="h-full bg-rose-300 rounded-full w-[85%] transition-all duration-1000 group-hover:brightness-110">
                </div>
              </div>
            </div>

            <div class="group">
              <div class="flex justify-between mb-1">
                <span class="font-bold text-slate-600 text-sm flex items-center gap-2"><i
                    class="fas fa-comments text-sky-400 w-5 text-center"></i> Hiểu ngữ cảnh (Context)</span>
                <span class="font-bold text-sky-500 text-sm">65%</span>
              </div>
              <div class="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  class="h-full bg-sky-400 rounded-full w-[65%] transition-all duration-1000 group-hover:brightness-110">
                </div>
              </div>
            </div>

            <div class="group">
              <div class="flex justify-between mb-1">
                <span class="font-bold text-slate-600 text-sm flex items-center gap-2"><i
                    class="fas fa-solid fa-dumbbell text-orange-400 w-5 text-center"></i> Luyện tập biểu cảm
                  (Training)</span>
                <span class="font-bold text-orange-500 text-sm">70%</span>
              </div>
              <div class="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  class="h-full bg-orange-300 rounded-full w-[70%] transition-all duration-1000 group-hover:brightness-110">
                </div>
              </div>
            </div>

            <div class="group">
              <div class="flex justify-between mb-1">
                <span class="font-bold text-slate-600 text-sm flex items-center gap-2"><i
                    class="fas fa-camera text-violet-400 w-5 text-center"></i> Phản xạ thực tế (AI)</span>
                <span class="font-bold text-violet-500 text-sm">40%</span>
              </div>
              <div class="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  class="h-full bg-violet-300 rounded-full w-[40%] transition-all duration-1000 group-hover:brightness-110">
                </div>
              </div>
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

          <div class="flex items-start gap-4 p-3 hover:bg-slate-50 rounded-xl transition relative z-10">
            <div
              class="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xl shrink-0 border-4 border-white shadow-sm">
              <i class="fas fa-smile-beam"></i>
            </div>
            <div class="flex-1">
              <div class="flex justify-between">
                <p class="font-bold text-slate-700">Luyện biểu cảm: Vui vẻ</p>
                <span class="font-bold text-emerald-400 text-sm">+5 ⭐</span>
              </div>
              <p class="text-xs text-slate-400 mt-1">Vừa xong • AI đánh giá: Tốt</p>
            </div>
          </div>

          <div class="flex items-start gap-4 p-3 hover:bg-slate-50 rounded-xl transition relative z-10">
            <div
              class="w-12 h-12 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center text-xl shrink-0 border-4 border-white shadow-sm">
              <i class="fas fa-puzzle-piece"></i>
            </div>
            <div class="flex-1">
              <div class="flex justify-between">
                <p class="font-bold text-slate-700">Ghép hình: Vui/Buồn</p>
                <span class="font-bold text-emerald-400 text-sm">+5 ⭐</span>
              </div>
              <p class="text-xs text-slate-400 mt-1">Hôm nay, 10:45 AM</p>
            </div>
          </div>

          <div class="flex items-start gap-4 p-3 hover:bg-slate-50 rounded-xl transition relative z-10">
            <div
              class="w-12 h-12 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center text-xl shrink-0 border-4 border-white shadow-sm">
              <i class="fas fa-book"></i>
            </div>
            <div class="flex-1">
              <div class="flex justify-between">
                <p class="font-bold text-slate-700">Học từ: Vui vẻ</p>
                <span class="font-bold text-emerald-400 text-sm">+5 ⭐</span>
              </div>
              <p class="text-xs text-slate-400 mt-1">Hôm nay, 10:30 AM</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js'
import { Radar } from 'vue-chartjs'
import Sidebar from '../components/Sidebar.vue';
import { useProgressStore } from '../stores/progress';

const store = useProgressStore();

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

const radarData = {
  labels: ['Vui vẻ', 'Buồn bã', 'Giận dữ', 'Sợ hãi', 'Ngạc nhiên', 'Ghê tởm'],
  datasets: [
    {
      label: 'Điểm kỹ năng',
      backgroundColor: 'rgba(251, 113, 133, 0.2)',
      borderColor: '#fb7185',
      pointBackgroundColor: '#fb7185',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#fb7185',
      data: [90, 75, 60, 40, 85, 50]
    }
  ]
}

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
  plugins: {
    legend: { display: false }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@500;700;800&display=swap');

.font-quicksand {
  font-family: 'Quicksand', sans-serif;
}
</style>
