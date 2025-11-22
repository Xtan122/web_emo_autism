<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-rose-50 to-white text-slate-600 font-quicksand">

    <nav
      class="container mx-auto px-6 py-6 flex justify-between items-center sticky top-0 z-50 bg-white/80 backdrop-blur-md rounded-b-2xl shadow-sm">
      <div class="flex items-center gap-2 cursor-pointer" @click="router.push('/')">
        <div
          class="w-10 h-10 bg-rose-300 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-sm">
          E</div>
        <span class="text-2xl font-bold text-rose-400">Empathy<span class="text-sky-400">Kids</span></span>
      </div>

      <div class="flex items-center gap-4">
        <router-link to="/login" class="hidden md:block font-bold text-slate-500 hover:text-rose-400 transition">
          Đăng nhập
        </router-link>
        <router-link to="/register"
          class="bg-rose-300 hover:bg-rose-400 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-rose-100 transition transform active:scale-95">
          Đăng ký ngay
        </router-link>
      </div>
    </nav>

    <!-- Hero Section -->
    <header class="container mx-auto px-6 py-12 md:py-20 flex flex-col md:flex-row items-center gap-12">
      <div class="md:w-1/2 text-center md:text-left space-y-6">
        <div
          class="inline-block bg-rose-100 text-rose-500 px-4 py-1 rounded-full font-bold text-sm mb-2 animate-bounce">
          <i class="fa-solid fa-handshake"></i>
          Dành riêng cho trẻ đặc biệt
        </div>
        <h1 class="text-4xl md:text-6xl font-bold text-slate-700 leading-tight">
          Học vui như chơi <br> <span class="text-rose-400">Phát triển</span> cảm xúc
        </h1>
        <p class="text-xl text-slate-500 leading-relaxed">
          Nền tảng giáo dục tương tác giúp trẻ hòa nhập xã hội thông qua các trò chơi thú vị, bài học sinh động và công
          nghệ AI tiên tiến.
        </p>

        <div class="flex flex-col md:flex-row gap-4 pt-4 justify-center md:justify-start">
          <router-link to="/register"
            class="bg-rose-300 hover:bg-rose-400 text-white px-8 py-4 rounded-2xl font-bold text-xl shadow-lg shadow-rose-200 transition active:shadow-none active:translate-y-1 text-center">
            Học thử miễn phí
          </router-link>
          <router-link to="/login"
            class="px-8 py-4 rounded-2xl font-bold text-xl text-slate-500 hover:bg-slate-50 transition text-center border-2 border-transparent hover:border-slate-100">
            Tôi đã có tài khoản
          </router-link>
        </div>

        <div class="pt-8 flex items-center justify-center md:justify-start gap-6 text-slate-400 font-bold text-sm">
          <div class="flex items-center gap-2"><i class="fas fa-check text-emerald-400"></i> Khoa học</div>
          <div class="flex items-center gap-2"><i class="fas fa-check text-emerald-400"></i> An toàn</div>
          <div class="flex items-center gap-2"><i class="fas fa-check text-emerald-400"></i> Hiệu quả</div>
        </div>
      </div>

      <div class="md:w-1/2 relative">
        <div
          class="absolute top-0 right-0 w-72 h-72 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob">
        </div>
        <div
          class="absolute -bottom-8 left-0 w-72 h-72 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000">
        </div>
        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000">
        </div>

        <div
          class="relative bg-white p-3 rounded-[3rem] shadow-2xl shadow-rose-100 border-4 border-white rotate-2 hover:rotate-0 transition duration-500 transform hover:scale-105">
          <img src="https://img.freepik.com/free-vector/happy-children-jumping-summer-meadow_74855-5852.jpg"
            alt="Kids playing" class="rounded-[2.5rem] w-full h-auto">
        </div>
      </div>
    </header>

    <!-- Features Grid -->
    <section class="py-20 bg-white rounded-t-[3rem] border-t border-slate-50 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
      <div class="container mx-auto px-6">
        <div class="text-center max-w-2xl mx-auto mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-slate-700 mb-4">Hệ sinh thái học tập toàn diện</h2>
          <p class="text-slate-500 text-lg">Kết hợp giữa phương pháp giáo dục đặc biệt và công nghệ hiện đại để tạo ra
            trải nghiệm học tập tốt nhất.</p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div
            class="p-8 rounded-3xl bg-sky-50 border border-sky-100 hover:shadow-xl hover:shadow-sky-100 transition group hover:-translate-y-1">
            <div
              class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm mb-6 group-hover:scale-110 transition text-sky-400">
              <i class="fas fa-shapes"></i>
            </div>
            <h3 class="text-xl font-bold text-sky-500 mb-3">Bài học đa dạng</h3>
            <p class="text-slate-500">Từ Flashcard nhận diện, Ghép hình tư duy đến Câu chuyện xã hội, giúp trẻ phát
              triển toàn diện kỹ năng nhận thức.</p>
          </div>

          <!-- Feature 2 -->
          <div
            class="p-8 rounded-3xl bg-violet-50 border border-violet-100 hover:shadow-xl hover:shadow-violet-100 transition group hover:-translate-y-1">
            <div
              class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm mb-6 group-hover:scale-110 transition text-violet-400">
              <i class="fas fa-robot"></i>
            </div>
            <h3 class="text-xl font-bold text-violet-500 mb-3">Công nghệ AI</h3>
            <p class="text-slate-500">Camera AI phân tích biểu cảm khuôn mặt theo thời gian thực, giúp trẻ soi gương và
              điều chỉnh cảm xúc chính xác.</p>
          </div>

          <!-- Feature 3 -->
          <div
            class="p-8 rounded-3xl bg-amber-50 border border-amber-100 hover:shadow-xl hover:shadow-amber-100 transition group hover:-translate-y-1">
            <div
              class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm mb-6 group-hover:scale-110 transition text-amber-400">
              <i class="fas fa-gamepad"></i>
            </div>
            <h3 class="text-xl font-bold text-amber-500 mb-3">Học mà chơi</h3>
            <p class="text-slate-500">Hệ thống Gamification với Chuỗi ngày học, Huy hiệu và Rương kho báu giúp duy trì
              hứng thú học tập mỗi ngày.</p>
          </div>

          <!-- Feature 4 -->
          <div
            class="p-8 rounded-3xl bg-emerald-50 border border-emerald-100 hover:shadow-xl hover:shadow-emerald-100 transition group hover:-translate-y-1">
            <div
              class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm mb-6 group-hover:scale-110 transition text-emerald-400">
              <i class="fas fa-chart-line"></i>
            </div>
            <h3 class="text-xl font-bold text-emerald-500 mb-3">Báo cáo chi tiết</h3>
            <p class="text-slate-500">Theo dõi sự tiến bộ của trẻ qua biểu đồ trực quan, giúp phụ huynh nắm bắt điểm
              mạnh và điểm cần cải thiện.</p>
          </div>

          <!-- Feature 5 -->
          <div
            class="p-8 rounded-3xl bg-rose-50 border border-rose-100 hover:shadow-xl hover:shadow-rose-100 transition group hover:-translate-y-1">
            <div
              class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm mb-6 group-hover:scale-110 transition text-rose-400">
              <i class="fas fa-heart"></i>
            </div>
            <h3 class="text-xl font-bold text-rose-500 mb-3">Huấn luyện cảm xúc</h3>
            <p class="text-slate-500">Các bài tập chuyên sâu giúp trẻ gọi tên, hiểu và quản lý các cảm xúc phức tạp
              trong cuộc sống hàng ngày.</p>
          </div>

          <!-- Feature 6 -->
          <div
            class="p-8 rounded-3xl bg-teal-50 border border-teal-100 hover:shadow-xl hover:shadow-teal-100 transition group hover:-translate-y-1">
            <div
              class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm mb-6 group-hover:scale-110 transition text-teal-400">
              <i class="fas fa-shield-alt"></i>
            </div>
            <h3 class="text-xl font-bold text-teal-500 mb-3">An toàn tuyệt đối</h3>
            <p class="text-slate-500">Môi trường không quảng cáo, nội dung được kiểm duyệt kỹ lưỡng, đảm bảo an toàn cho
              sự phát triển của trẻ.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-rose-100 relative overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-full opacity-20">
        <div class="absolute top-10 left-10 text-9xl text-rose-300"><i class="fas fa-star"></i></div>
        <div class="absolute bottom-10 right-10 text-9xl text-rose-300"><i class="fas fa-heart"></i></div>
      </div>

      <div class="container mx-auto px-6 text-center relative z-10">
        <h2 class="text-3xl md:text-5xl font-bold text-slate-700 mb-6">Sẵn sàng cùng con khôn lớn?</h2>
        <p class="text-slate-500 text-xl mb-10 max-w-2xl mx-auto">Tham gia cùng hàng ngàn phụ huynh khác để giúp con
          phát
          triển kỹ năng xã hội và cảm xúc ngay hôm nay.</p>
        <router-link to="/register"
          class="inline-block bg-rose-400 hover:bg-rose-500 text-white px-10 py-5 rounded-2xl font-bold text-2xl shadow-lg shadow-rose-200 transition active:shadow-none active:translate-y-1">
          Bắt đầu ngay miễn phí
        </router-link>
        <p class="mt-6 text-slate-400 text-sm font-bold">Không cần thẻ tín dụng • Hủy bất cứ lúc nào</p>
      </div>
    </section>

    <footer class="bg-white py-12 text-slate-400 text-sm border-t border-slate-100">
      <div class="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-rose-300 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
            E
          </div>
          <span class="text-xl font-bold text-slate-600">Empathy<span class="text-rose-400">Kids</span></span>
        </div>
        <div class="flex gap-6 font-bold">
          <a href="#" class="hover:text-rose-400 transition">Về chúng tôi</a>
          <a href="#" class="hover:text-rose-400 transition">Liên hệ</a>
          <a href="#" class="hover:text-rose-400 transition">Chính sách</a>
        </div>
        <p>© 2024 EmpathyKids. Made with ❤️ for special children.</p>
      </div>
    </footer>

  </div>
</template>

<style scoped>
/* Animation blob cho background sinh động */
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }

  33% {
    transform: translate(30px, -50px) scale(1.1);
  }

  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }

  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>