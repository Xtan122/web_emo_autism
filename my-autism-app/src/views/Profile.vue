<template>
  <div class="min-h-screen md:pl-64 pt-6 bg-slate-50">
    <Sidebar />

    <div class="max-w-2xl mx-auto px-6 pb-20">


      <div
        class="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-8 mb-8">
        <div class="relative">
          <img :src="store.userInfo.avatar"
            class="w-32 h-32 rounded-full object-cover border-4 border-rose-100 shadow-md" alt="Avatar">
          <button
            class="absolute bottom-0 right-0 bg-rose-400 text-white w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm hover:bg-rose-500 transition">
            <i class="fas fa-camera"></i>
          </button>
        </div>

        <div class="text-center md:text-left flex-1 space-y-2">
          <h2 class="text-2xl font-bold text-slate-800">{{ store.userInfo.childName }}</h2>
          <p class="text-slate-500 flex items-center justify-center md:justify-start gap-2">
            <i class="fas fa-user-shield"></i> Phụ huynh: {{ store.userInfo.parentName }}
          </p>
          <p class="text-slate-400 text-sm">{{ store.userInfo.email }}</p>

          <div class="flex gap-3 justify-center md:justify-start mt-4">
            <div class="bg-yellow-100 text-yellow-600 px-4 py-1 rounded-full font-bold text-sm">
              <i class="fas fa-star mr-1"></i> {{ store.stars }} Sao
            </div>
            <div class="bg-orange-100 text-orange-600 px-4 py-1 rounded-full font-bold text-sm">
              <i class="fas fa-fire mr-1"></i> {{ store.currentStreak }} Ngày
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8">
        <h3 class="text-xl font-bold text-slate-700 mb-6">Cài đặt ứng dụng</h3>

        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 bg-sky-50 text-sky-500 rounded-full flex items-center justify-center text-lg">
                <i class="fas fa-volume-up"></i>
              </div>
              <span class="font-bold text-slate-600">Âm thanh nền</span>
            </div>
            <div class="w-12 h-6 bg-emerald-400 rounded-full relative cursor-pointer">
              <div class="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm"></div>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 bg-violet-50 text-violet-500 rounded-full flex items-center justify-center text-lg">
                <i class="fas fa-bell"></i>
              </div>
              <span class="font-bold text-slate-600">Nhắc nhở học tập</span>
            </div>
            <div class="w-12 h-6 bg-emerald-400 rounded-full relative cursor-pointer">
              <div class="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm"></div>
            </div>
          </div>
        </div>
      </div>

      <button @click="handleLogout"
        class="w-full md:hidden bg-slate-100 text-slate-500 font-bold py-4 rounded-2xl hover:bg-slate-200 transition">
        <i class="fas fa-sign-out-alt mr-2"></i> Đăng xuất
      </button>

    </div>
  </div>
</template>

<script setup>
import Sidebar from '../components/Sidebar.vue';
import { useProgressStore } from '../stores/progress';
import { useRouter } from 'vue-router';

const store = useProgressStore();
const router = useRouter();

const handleLogout = () => {
  if (confirm("Bạn có chắc muốn đăng xuất không?")) {
    store.logout();
    router.push('/'); // Về trang chủ
  }
}
</script>