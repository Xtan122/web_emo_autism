<template>
  <div class="min-h-screen flex items-center justify-center bg-rose-50 p-4">
    <div class="bg-white w-full max-w-md rounded-3xl shadow-xl shadow-rose-100 overflow-hidden">
      <div class="p-8 md:p-10">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-slate-700">Tạo tài khoản mới 🚀</h2>
          <p class="text-slate-400 mt-2">Đồng hành cùng sự phát triển của con</p>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label class="block text-slate-600 font-bold mb-2">Tên phụ huynh</label>
            <input type="text"
              class="w-full px-4 py-3 rounded-xl border-2 border-rose-100 focus:border-rose-300 focus:outline-none"
              placeholder="Nguyễn Văn A">
          </div>
          <div>
            <label class="block text-slate-600 font-bold mb-2">Tên của bé</label>
            <input type="text"
              class="w-full px-4 py-3 rounded-xl border-2 border-rose-100 focus:border-rose-300 focus:outline-none"
              placeholder="Bé Bi">
          </div>
          <div>
            <label class="block text-slate-600 font-bold mb-2">Email</label>
            <input type="email"
              class="w-full px-4 py-3 rounded-xl border-2 border-rose-100 focus:border-rose-300 focus:outline-none"
              placeholder="email@vidu.com">
          </div>
          <div>
            <label class="block text-slate-600 font-bold mb-2">Mật khẩu</label>
            <input type="password"
              class="w-full px-4 py-3 rounded-xl border-2 border-rose-100 focus:border-rose-300 focus:outline-none"
              placeholder="••••••••">
          </div>

          <button type="submit"
            class="w-full bg-rose-300 hover:bg-rose-400 text-white font-bold py-4 rounded-2xl shadow-lg shadow-rose-200 active:scale-95 transition text-lg mt-4">
            Đăng Ký Miễn Phí
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
import { useRouter } from 'vue-router';
const router = useRouter();

const handleRegister = () => {
  // Giả lập đăng ký thành công
  router.push('/app');
}
</script>