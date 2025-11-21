<template>
  <div class="w-full max-w-xl flex flex-col items-center relative min-h-[500px]">
    
    <Transition name="slide-fade" mode="out-in">
      
      <div :key="data.id" class="w-full flex flex-col items-center">
        
        <div class="relative w-64 h-64 md:w-80 md:h-80 bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-white ring-4 ring-blue-50 mb-8 transition-transform hover:scale-105 duration-300">
          <img :src="data.image" alt="Emotion" class="w-full h-full object-cover" />
          
          <button @click="playAudio" class="absolute top-4 right-4 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center text-blue-500 hover:bg-blue-500 hover:text-white transition shadow-sm z-10">
            <i class="fas fa-volume-up text-xl"></i>
          </button>
        </div>

        <h2 class="text-2xl font-bold text-slate-700 mb-8 text-center animate-fade-in">
          {{ data.question }}
        </h2>

        <div class="grid grid-cols-2 gap-6 w-full">
          <button 
            v-for="opt in data.options" 
            :key="opt"
            @click="checkAnswer(opt)"
            :disabled="isProcessing"
            :class="getButtonClass(opt)"
            class="btn-3d py-6 rounded-2xl text-xl font-bold flex flex-col items-center shadow-sm transition-all"
          >
            <span class="text-4xl mb-2">{{ getEmoji(opt) }}</span>
            {{ opt }}
          </button>
        </div>

      </div>
    </Transition>

    <div v-if="showSuccessFeedback" class="absolute top-1/3 left-1/2 -translate-x-1/2 z-50 animate-bounce-in pointer-events-none">
       <div class="bg-green-500 text-white text-3xl font-bold px-8 py-4 rounded-full shadow-2xl border-4 border-white">
         Chính xác! 🎉
       </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Nhận data: Là 1 object câu hỏi duy nhất (currentQuestion)
const props = defineProps(['data']); 
const emit = defineEmits(['next']);

// State
const isProcessing = ref(false); // Khóa nút khi đang xử lý chuyển câu
const selectedOpt = ref(null);
const showSuccessFeedback = ref(false);

// Helper Emoji
const getEmoji = (text) => {
    if (text.includes('Vui')) return '😊';
    if (text.includes('Buồn')) return '😢';
    if (text.includes('Giận')) return '😡';
    if (text.includes('Sợ')) return '😨';
    return '😐';
}

// Helper Class nút bấm
const getButtonClass = (opt) => {
    const base = "bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50";
    
    if (!selectedOpt.value) return base; // Chưa chọn

    // Logic màu sắc
    if (opt === props.data.correct) return "bg-green-500 border-green-700 text-white"; // Luôn hiện màu xanh ở đáp án đúng
    if (opt === selectedOpt.value && opt !== props.data.correct) return "bg-red-500 border-red-700 text-white"; // Chọn sai thì đỏ
    
    return "bg-slate-100 border-slate-200 text-slate-300 opacity-50"; // Các nút khác mờ đi
}

// LOGIC CHỌN ĐÁP ÁN (QUAN TRỌNG)
const checkAnswer = (opt) => {
    if (isProcessing.value) return; // Chặn click liên tục
    
    selectedOpt.value = opt;
    
    if (opt === props.data.correct) {
        // TRƯỜNG HỢP ĐÚNG
        isProcessing.value = true;
        showSuccessFeedback.value = true;
        
        // Play sound đúng (nếu có)
        // playSound('correct');

        // Đợi 1 giây để bé tận hưởng chiến thắng -> Rồi mới chuyển câu
        setTimeout(() => {
            emit('next', true); // Báo cha chuyển câu
            
            // Reset trạng thái nội bộ để đón câu mới
            resetState();
        }, 1000); 

    } else {
        // TRƯỜNG HỢP SAI
        // Rung lắc hoặc báo sai, cho chọn lại
        // playSound('wrong');
        setTimeout(() => {
            selectedOpt.value = null; // Reset để chọn lại
        }, 800);
    }
}

const resetState = () => {
    isProcessing.value = false;
    selectedOpt.value = null;
    showSuccessFeedback.value = false;
}

const playAudio = () => {
  // Logic đọc audio câu hỏi
}
</script>

<style scoped>
/* --- CSS ANIMATION CHUYỂN CÂU --- */

/* Trạng thái vào (Enter) */
.slide-fade-enter-active {
  transition: all 0.4s ease-out;
}

/* Trạng thái ra (Leave) */
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

/* Vị trí bắt đầu vào và kết thúc ra */
.slide-fade-enter-from {
  transform: translateX(40px); /* Trượt từ phải sang */
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-40px); /* Trượt sang trái mất đi */
  opacity: 0;
}

/* Animation Feedback */
@keyframes bounceIn {
  0% { transform: translate(-50%, -50%) scale(0); }
  60% { transform: translate(-50%, -50%) scale(1.2); }
  100% { transform: translate(-50%, -50%) scale(1); }
}
.animate-bounce-in {
  animation: bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
}
</style>