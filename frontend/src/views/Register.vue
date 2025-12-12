<template>
  <div class="min-h-screen flex items-center justify-center bg-rose-50 p-4">
    <div class="bg-white w-full max-w-md rounded-3xl shadow-xl shadow-rose-100 overflow-hidden">
      <div class="p-8 md:p-10">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-slate-700">Tạo tài khoản mới 🚀</h2>
          <p class="text-slate-400 mt-2">Đồng hành cùng sự phát triển của con</p>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <!-- Tên phụ huynh (Optional hoặc Required tùy bạn) -->
          <div>
            <label class="block text-slate-600 font-bold mb-2">Tên phụ huynh</label>
            <input 
              v-model="parentName" 
              type="text"
              class="w-full px-4 py-3 rounded-xl border-2 border-rose-100 focus:border-rose-300 focus:outline-none transition"
              placeholder="Nguyễn Văn A">
          </div>

          <!-- Tên của bé (Quan trọng - Chính là Username) -->
          <div>
            <label class="block text-slate-600 font-bold mb-2">Tên của bé</label>
            <input 
              v-model="childName"
              type="text"
              required
              class="w-full px-4 py-3 rounded-xl border-2 border-rose-100 focus:border-rose-300 focus:outline-none transition"
              placeholder="Bé Bi (Tên hiển thị)">
          </div>

          <!-- Email -->
          <div>
            <label class="block text-slate-600 font-bold mb-2">Email đăng nhập</label>
            <input 
              v-model="email"
              type="email"
              required
              class="w-full px-4 py-3 rounded-xl border-2 border-rose-100 focus:border-rose-300 focus:outline-none transition"
              placeholder="email@vidu.com">
          </div>

          <!-- Mật khẩu -->
          <div>
            <label class="block text-slate-600 font-bold mb-2">Mật khẩu</label>
            <input 
              v-model="password"
              type="password"
              required
              class="w-full px-4 py-3 rounded-xl border-2 border-rose-100 focus:border-rose-300 focus:outline-none transition"
              placeholder="••••••••">
          </div>

          <!-- Hiển thị lỗi -->
          <div v-if="errorMessage" class="text-red-500 text-sm text-center font-medium">
            {{ errorMessage }}
          </div>

          <button type="submit"
            :disabled="isLoading"
            class="w-full bg-rose-300 hover:bg-rose-400 text-white font-bold py-4 rounded-2xl shadow-lg shadow-rose-200 active:scale-95 transition text-lg mt-4 disabled:opacity-70">
            {{ isLoading ? 'Đang xử lý...' : 'Đăng Ký Miễn Phí' }}
          </button>
        </form>

        <div class="mt-8 text-center text-slate-500">
          Đã có tài khoản?
          <router-link to="/login" class="text-rose-400 font-bold hover:underline">Đăng nhập</router-link>
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

const parentName = ref('');
const childName = ref('');
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const handleRegister = async () => {
  errorMessage.value = '';
  isLoading.value = true;

  try {
    const response = await axios.post('http://localhost:3000/api/auth/register', {
      // Logic mapping:
      username: childName.value,    // Tên bé -> lưu vào cột username
      parent_name: parentName.value,// Tên phụ huynh -> lưu vào cột parent_name
      email: email.value,
      password: password.value
    });

    alert('Đăng ký thành công!');
    router.push('/login');

  } catch (error) {
    if (error.response && error.response.data) {
      errorMessage.value = error.response.data.message;
    } else {
      errorMessage.value = 'Không thể kết nối đến máy chủ.';
    }
  } finally {
    isLoading.value = false;
  }
}
</script>