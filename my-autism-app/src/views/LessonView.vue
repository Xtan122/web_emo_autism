<template>
  <div class="h-screen flex flex-col bg-slate-50 text-slate-700 overflow-hidden font-quicksand relative">
    
    <header class="px-6 py-6 flex items-center gap-6 max-w-5xl mx-auto w-full z-50">
      <button @click="goBack" class="text-slate-400 hover:text-slate-600 text-2xl transition p-2 rounded-full hover:bg-slate-100">
        <i class="fas fa-times"></i>
      </button>
      
      <div class="flex-1 bg-slate-200 h-5 rounded-full overflow-hidden relative shadow-inner">
        <div 
          class="bg-green-500 h-full transition-all duration-500 ease-out relative" 
          :style="{ width: progress + '%' }"
        >
          <div class="absolute top-1 left-0 w-full h-1 bg-white/30 rounded-full"></div>
        </div>
      </div>

      <div v-if="lessonType !== 'matching' && questions.length > 0" class="font-bold text-slate-400 text-sm bg-white px-3 py-1 rounded-lg shadow-sm border border-slate-100">
         {{ Math.min(currentIndex + 1, questions.length) }} / {{ questions.length }}
      </div>
    </header>

    <main class="flex-1 flex flex-col items-center justify-center px-4 pb-20 w-full overflow-y-auto relative">
      
      <FlashcardGame 
        v-if="lessonType === 'flashcard' && !isCompleted && currentQuestion" 
        :data="currentQuestion"
        @next="handleNext"
      />

      <MatchingGame
        v-if="lessonType === 'matching' && !isCompleted && questions.length > 0"
        :data="questions" 
        @next="handleNext"
      />

      <ContextGame 
        v-if="lessonType === 'context' && !isCompleted && currentQuestion" 
        :data="currentQuestion"
        @next="handleNext"
      />

      <AiGame 
        v-if="lessonType === 'ai' && !isCompleted && currentQuestion" 
        :data="currentQuestion" 
        @next="handleNext" 
      />

      <div v-if="isCompleted" class="text-center animate-bounce-in z-50">
        <div class="w-32 h-32 bg-yellow-400 rounded-full flex items-center justify-center text-6xl text-white mx-auto mb-6 shadow-xl border-4 border-yellow-200">
          🏆
        </div>
        <h2 class="text-3xl font-bold text-yellow-600 mb-2">Tuyệt vời!</h2>
        <p class="text-slate-500 mb-8">Con đã hoàn thành bài học này.</p>
        <button @click="goBack" class="bg-blue-500 hover:bg-blue-600 text-white px-12 py-4 rounded-2xl font-bold text-xl shadow-lg active:scale-95 transition">
          Về bản đồ
        </button>
      </div>

      <div v-if="!currentQuestion && !isCompleted && lessonType !== 'matching'" class="text-center text-slate-400 mt-10">
         <div class="animate-spin text-2xl mb-2"><i class="fas fa-spinner"></i></div>
         <p>Đang tải dữ liệu...</p>
      </div>

    </main>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import confetti from 'canvas-confetti'; 
import { lessonData } from '../data/lessons';
import { useProgressStore } from '../stores/progress';

import FlashcardGame from '../components/games/FlashcardGame.vue';
import ContextGame from '../components/games/ContextGame.vue';
import AiGame from '../components/games/AiGame.vue';
import MatchingGame from '../components/games/MatchingGame.vue';

const route = useRoute();
const router = useRouter();
const store = useProgressStore();

const levelId = route.params.levelId;
const lessonType = route.params.lessonType; 

const currentIndex = ref(0);
const isCompleted = ref(false);

const goBack = () => {
  router.push('/app');
};

// Lấy danh sách câu hỏi
const questions = computed(() => {
    if (lessonData[levelId] && lessonData[levelId][lessonType]) {
        return lessonData[levelId][lessonType];
    }
    return [];
});

const currentQuestion = computed(() => questions.value[currentIndex.value]);

// TÍNH TOÁN TIẾN ĐỘ BÀI HỌC
const progress = computed(() => {
    if (isCompleted.value) return 100;
    if (questions.value.length === 0) return 0;
    
    // Matching game chỉ có 1 màn, nên mới vào là 0%, thắng là 100%
    if (lessonType === 'matching') return 0;

    // Các game khác: Tính % dựa trên câu hiện tại
    // Ví dụ: 3 câu. Làm câu 1 (index 0) -> 0%. Làm câu 2 (index 1) -> 33%. Xong -> 100%
    return ((currentIndex.value) / questions.value.length) * 100;
});

// XỬ LÝ CHUYỂN CÂU
const handleNext = (isCorrect) => {
    if (isCorrect) {
        // Nếu là Matching Game (chỉ có 1 level), thắng là xong luôn
        if (lessonType === 'matching') {
            finishLesson();
            return;
        }

        // Các game Flashcard, Context, AI:
        // Kiểm tra xem còn câu hỏi không
        if (currentIndex.value < questions.value.length - 1) {
            // Vẫn còn -> Tăng Index
            // Việc tăng Index sẽ làm thay đổi props 'data' truyền vào FlashcardGame
            // -> Kích hoạt Transition ở component con
            currentIndex.value++;
        } else {
            // Hết câu -> Hoàn thành
            finishLesson();
        }
    }
};

const finishLesson = () => {
    // Đẩy thanh progress lên 100% ngay lập tức
    // (Với Flashcard, currentIndex sẽ bằng length khi xong)
    if (lessonType !== 'matching') {
       currentIndex.value = questions.value.length; 
    }
    
    // Bắn pháo giấy
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    
    // Lưu Store
    store.addStars(5);
    store.completeLesson(Number(levelId), lessonType);

    setTimeout(() => { isCompleted.value = true; }, 500);
};
</script>

<style>
@keyframes bounceIn {
  0% { transform: scale(0.5); opacity: 0; }
  80% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); }
}
.animate-bounce-in { animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
</style>