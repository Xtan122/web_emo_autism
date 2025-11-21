<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white text-slate-700 font-quicksand">
    
    <nav class="container mx-auto px-6 py-6 flex justify-between items-center">
      <div class="flex items-center gap-2">
        <div class="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-sm">E</div>
        <span class="text-2xl font-bold text-blue-600">Empathy<span class="text-yellow-500">Kids</span></span>
      </div>

      <div class="flex items-center gap-4">
        <router-link to="/login" class="hidden md:block font-bold text-slate-500 hover:text-blue-500 transition">
          Đăng nhập
        </router-link>
        <router-link to="/register" class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg transition transform active:scale-95">
          Đăng ký ngay
        </router-link>
      </div>
    </nav>

    <header class="container mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12">
      <div class="md:w-1/2 text-center md:text-left space-y-6">
        <div class="inline-block bg-blue-100 text-blue-600 px-4 py-1 rounded-full font-bold text-sm mb-2">
          👋 Dành riêng cho trẻ đặc biệt
        </div>
        <h1 class="text-4xl md:text-6xl font-bold text-slate-800 leading-tight">
          Giúp con thấu hiểu <br> <span class="text-blue-500">Cảm xúc</span> & Thế giới
        </h1>
        <p class="text-xl text-slate-500 leading-relaxed">
          Ứng dụng học tập tương tác với lộ trình khoa học: Từ nhận diện khuôn mặt, hiểu ngữ cảnh đến thực hành cảm xúc cùng AI.
        </p>
        
        <div class="flex flex-col md:flex-row gap-4 pt-4 justify-center md:justify-start">
          <router-link to="/register" class="bg-yellow-400 hover:bg-yellow-500 text-slate-900 px-8 py-4 rounded-2xl font-bold text-xl shadow-[0_4px_0_rgb(202,138,4)] transition active:shadow-none active:translate-y-1 text-center">
            Học thử miễn phí
          </router-link>
          <router-link to="/login" class="px-8 py-4 rounded-2xl font-bold text-xl text-slate-500 hover:bg-slate-100 transition text-center">
            Tôi đã có tài khoản
          </router-link>
        </div>
      </div>

      <div class="md:w-1/2 relative">
        <div class="absolute top-0 right-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div class="absolute -bottom-8 left-0 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        
        <div class="relative bg-white p-2 rounded-[3rem] shadow-2xl border-4 border-white rotate-2 hover:rotate-0 transition duration-500">
           <img src="https://img.freepik.com/free-vector/happy-children-jumping-summer-meadow_74855-5852.jpg" alt="Kids playing" class="rounded-[2.5rem] w-full h-auto">
        </div>
      </div>
    </header>

    <section class="py-20 bg-white rounded-t-[3rem] border-t border-slate-100">
      <div class="container mx-auto px-6 text-center">
        <h2 class="text-3xl font-bold text-slate-800 mb-12">Phương pháp học tập 3 bước</h2>

        <div class="grid md:grid-cols-3 gap-8">
          <div class="p-8 rounded-3xl bg-blue-50 border border-blue-100 hover:shadow-xl transition group cursor-default">
            <div class="w-16 h-16 mx-auto bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm mb-6 group-hover:scale-110 transition">📘</div>
            <h3 class="text-xl font-bold text-blue-600 mb-3">1. Nhận diện cơ bản</h3>
            <p class="text-slate-500">Trẻ học cách gọi tên 6 cảm xúc cơ bản qua Flashcard hình ảnh trực quan.</p>
          </div>

          <div class="p-8 rounded-3xl bg-green-50 border border-green-100 hover:shadow-xl transition group cursor-default">
            <div class="w-16 h-16 mx-auto bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm mb-6 group-hover:scale-110 transition">📗</div>
            <h3 class="text-xl font-bold text-green-600 mb-3">2. Hiểu ngữ cảnh</h3>
            <p class="text-slate-500">Phân tích các câu chuyện xã hội để hiểu "tại sao" cảm xúc lại xảy ra.</p>
          </div>

          <div class="p-8 rounded-3xl bg-purple-50 border border-purple-100 hover:shadow-xl transition group cursor-default">
            <div class="w-16 h-16 mx-auto bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm mb-6 group-hover:scale-110 transition">📷</div>
            <h3 class="text-xl font-bold text-purple-600 mb-3">3. Thực hành với AI</h3>
            <p class="text-slate-500">Camera AI giúp trẻ soi gương và tập biểu lộ cảm xúc thực tế.</p>
          </div>
        </div>
      </div>
    </section>

    <footer class="bg-slate-50 py-10 text-center text-slate-400 text-sm">
      <p>© 2024 EmpathyKids. Made with ❤️ for special children.</p>
    </footer>

  </div>
</template>

<style scoped>
/* Animation blob cho background sinh động */
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
.animate-blob {
  animation: blob 7s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
</style>