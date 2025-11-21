<template>
  <div class="min-h-screen flex items-center justify-center bg-blue-50 p-4">
    <div class="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden">
      <div class="p-8 md:p-10">
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-yellow-400 text-white rounded-full text-3xl font-bold mb-4 shadow-md">E</div>
          <h2 class="text-3xl font-bold text-slate-700">Chào mừng trở lại!</h2>
          <p class="text-slate-400 mt-2">Đăng nhập để tiếp tục bài học của bé</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label class="block text-slate-600 font-bold mb-2">Email phụ huynh</label>
            <input type="email" class="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition" placeholder="vi-du@gmail.com">
          </div>
          <div>
            <label class="block text-slate-600 font-bold mb-2">Mật khẩu</label>
            <input type="password" class="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition" placeholder="••••••••">
          </div>
          
          <button type="submit" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition text-lg">
            Đăng Nhập
          </button>
        </form>

        <div class="mt-8 text-center text-slate-500">
          Chưa có tài khoản? 
          <router-link to="/register" class="text-blue-500 font-bold hover:underline">Đăng ký ngay</router-link>
        </div>
        <div class="mt-4 text-center">
            <router-link to="/" class="text-sm text-slate-400 hover:text-slate-600">← Về trang chủ</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

const handleLogin = () => {
    // Giả lập đăng nhập thành công
    router.push('/app');
}
</script>