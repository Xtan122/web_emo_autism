<template>
  <div class="min-h-screen md:pl-64 pt-6 bg-slate-50">
    <Sidebar />
    
    <div class="max-w-2xl mx-auto px-6 pb-20">
      <h1 class="text-3xl font-bold text-slate-700 mb-8">Báo cáo học tập</h1>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center">
          <div class="text-3xl mb-2">⭐</div>
          <div class="text-2xl font-bold text-slate-700">{{ store.stars }}</div>
          <div class="text-xs text-slate-400 uppercase font-bold">Tổng sao</div>
        </div>
        <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center">
          <div class="text-3xl mb-2">🔥</div>
          <div class="text-2xl font-bold text-slate-700">{{ store.currentStreak }}</div>
          <div class="text-xs text-slate-400 uppercase font-bold">Ngày liên tiếp</div>
        </div>
        <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center">
          <div class="text-3xl mb-2">✅</div>
          <div class="text-2xl font-bold text-slate-700">8/12</div>
          <div class="text-xs text-slate-400 uppercase font-bold">Bài hoàn thành</div>
        </div>
        <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-center">
          <div class="text-3xl mb-2">😊</div>
          <div class="text-2xl font-bold text-green-500">Cao</div>
          <div class="text-xs text-slate-400 uppercase font-bold">Cảm xúc</div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-8">
        <h2 class="text-xl font-bold text-slate-700 mb-6">Kỹ năng cảm xúc</h2>
        
        <div class="space-y-6">
          <div>
            <div class="flex justify-between mb-2">
              <span class="font-bold text-slate-600">Nhận diện khuôn mặt</span>
              <span class="font-bold text-blue-500">80%</span>
            </div>
            <div class="h-4 bg-slate-100 rounded-full overflow-hidden">
              <div class="h-full bg-blue-500 rounded-full" style="width: 80%"></div>
            </div>
          </div>

          <div>
            <div class="flex justify-between mb-2">
              <span class="font-bold text-slate-600">Hiểu ngữ cảnh</span>
              <span class="font-bold text-green-500">60%</span>
            </div>
            <div class="h-4 bg-slate-100 rounded-full overflow-hidden">
              <div class="h-full bg-green-500 rounded-full" style="width: 60%"></div>
            </div>
          </div>

          <div>
            <div class="flex justify-between mb-2">
              <span class="font-bold text-slate-600">Phản xạ biểu cảm (AI)</span>
              <span class="font-bold text-purple-500">30%</span>
            </div>
            <div class="h-4 bg-slate-100 rounded-full overflow-hidden">
              <div class="h-full bg-purple-500 rounded-full" style="width: 30%"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h2 class="text-xl font-bold text-slate-700 mb-4">Hoạt động gần đây</h2>
        <div class="space-y-4">
          <div class="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition">
            <div class="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-xl">
              <i class="fas fa-book"></i>
            </div>
            <div>
              <p class="font-bold text-slate-700">Hoàn thành bài Flashcard</p>
              <p class="text-xs text-slate-400">Hôm nay, 10:30 AM</p>
            </div>
            <div class="ml-auto font-bold text-yellow-500">+5 ⭐</div>
          </div>
          
          <div class="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition">
            <div class="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xl">
              <i class="fas fa-comments"></i>
            </div>
            <div>
              <p class="font-bold text-slate-700">Đọc truyện "Sinh nhật Nam"</p>
              <p class="text-xs text-slate-400">Hôm qua, 08:15 PM</p>
            </div>
            <div class="ml-auto font-bold text-yellow-500">+5 ⭐</div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import Sidebar from '../components/Sidebar.vue';
import { useProgressStore } from '../stores/progress';
const store = useProgressStore();
</script>