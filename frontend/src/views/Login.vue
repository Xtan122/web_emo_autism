<template>
  <div class="min-h-screen flex items-center justify-center bg-rose-50 p-4">
    <div class="bg-white w-full max-w-md rounded-3xl shadow-xl shadow-rose-100 overflow-hidden">
      <div class="p-8 md:p-10">
        <div class="text-center mb-8">
          <div
            class="inline-flex items-center justify-center w-16 h-16 bg-rose-300 text-white rounded-full text-3xl font-bold mb-4 shadow-md">
            E</div>
          <h2 class="text-3xl font-bold text-slate-700">Chào mừng trở lại!</h2>
          <p class="text-slate-400 mt-2">Đăng nhập để tiếp tục bài học của bé</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label class="block text-slate-600 font-bold mb-2">Email phụ huynh</label>
            <!-- 👇 THÊM v-model="email" VÀO ĐÂY 👇 -->
            <input 
              v-model="email" 
              type="email"
              required
              class="w-full px-4 py-3 rounded-xl border-2 border-rose-100 focus:border-rose-300 focus:outline-none transition"
              placeholder="vi-du@gmail.com">
          </div>
          <div>
            <label class="block text-slate-600 font-bold mb-2">Mật khẩu</label>
            <!-- 👇 THÊM v-model="password" VÀO ĐÂY 👇 -->
            <input 
              v-model="password" 
              type="password"
              required
              class="w-full px-4 py-3 rounded-xl border-2 border-rose-100 focus:border-rose-300 focus:outline-none transition"
              placeholder="••••••••">
          </div>

          <!-- Hiển thị lỗi nếu có -->
          <div v-if="errorMessage" class="text-red-500 text-sm text-center">
            {{ errorMessage }}
          </div>

          <button type="submit"
            class="w-full bg-rose-300 hover:bg-rose-400 text-white font-bold py-4 rounded-2xl shadow-lg shadow-rose-200 active:scale-95 transition text-lg">
            Đăng Nhập
          </button>
        </form>

        <div class="mt-8 text-center text-slate-500">
          Chưa có tài khoản?
          <router-link to="/register" class="text-rose-400 font-bold hover:underline">Đăng ký ngay</router-link>
        </div>
        <div class="mt-4 text-center">
          <router-link to="/" class="text-sm text-slate-400 hover:text-slate-600">← Về trang chủ</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const email = ref('');    
const password = ref(''); 
const errorMessage = ref('');

const handleLogin = async () => {
  // Xóa thông báo lỗi cũ trước khi gửi mới
  errorMessage.value = '';

  try {
    const response = await axios.post('http://localhost:3000/api/auth/login', {
      email: email.value,
      password: password.value
    });

    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      alert('Đăng nhập thành công!'); // Thông báo nhẹ
      router.push('/app');
    }
  } catch (error) {
    if (error.response && error.response.data) {
        errorMessage.value = error.response.data.message;
    } else {
        errorMessage.value = 'Không thể kết nối đến Server';
    }
  }
}
</script>