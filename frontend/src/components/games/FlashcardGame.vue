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
            :disabled="hasAnswered"
            :class="getButtonClass(opt)"
            class="btn-3d py-6 rounded-2xl text-xl font-bold flex flex-col items-center shadow-sm transition-all duration-300 disabled:cursor-default"
          >
            <span class="text-4xl mb-2">{{ getEmoji(opt) }}</span>
            {{ opt }}
          </button>
        </div>

      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps(['data']); 
const emit = defineEmits(['next']);

// State
const hasAnswered = ref(false); // Đã trả lời chưa (để khóa nút)
const selectedOpt = ref(null);  // Đáp án người dùng chọn

// Helper Emoji
const getEmoji = (text) => {
    if (text.includes('Vui')) return '😊';
    if (text.includes('Buồn')) return '😢';
    if (text.includes('Giận')) return '😡';
    if (text.includes('Sợ')) return '😨';
    if (text.includes('Ngạc')) return '😲';
    if (text.includes('Ghê')) return '🤢';
    return '😐';
}

// Logic màu sắc nút bấm (QUAN TRỌNG)
const getButtonClass = (opt) => {
    const base = "bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:-translate-y-1";
    
    // 1. Chưa chọn gì -> Style mặc định
    if (!hasAnswered.value) return base; 

    // 2. Đã chọn -> Logic hiển thị kết quả:
    
    // A. Nếu đây là đáp án ĐÚNG -> Luôn hiện màu Xanh (để sửa lỗi cho trẻ)
    if (opt === props.data.correct) {
        return "bg-green-500 border-green-700 text-white scale-105 shadow-md"; 
    }

    // B. Nếu đây là đáp án SAI mà người dùng ĐÃ CHỌN -> Hiện màu Đỏ
    if (opt === selectedOpt.value && opt !== props.data.correct) {
        return "bg-red-500 border-red-700 text-white opacity-80"; 
    }
    
    // C. Các đáp án còn lại -> Làm mờ đi
    return "bg-slate-100 border-slate-200 text-slate-300 opacity-40 grayscale"; 
}

// Xử lý chọn đáp án (Chế độ Sudden Death - 1 lần chọn)
const checkAnswer = (opt) => {
    if (hasAnswered.value) return; // Chặn click liên tục
    
    hasAnswered.value = true;
    selectedOpt.value = opt;
    
    const isCorrect = (opt === props.data.correct);

    // Phát âm thanh feedback (Tùy chọn)
    // if (isCorrect) playSound('correct'); else playSound('wrong');

    // Đợi 1.5 giây để trẻ nhìn thấy kết quả (Màu xanh/đỏ) rồi mới chuyển câu
    setTimeout(() => {
        // Gửi kết quả thật (true/false) về cha
        emit('next', isCorrect); 
    }, 1500); 
}

// Reset trạng thái khi câu hỏi thay đổi (Khi cha đổi props.data)
watch(() => props.data, () => {
    hasAnswered.value = false;
    selectedOpt.value = null;
});

const playAudio = () => {
  // Logic đọc audio
  console.log("Đọc câu hỏi:", props.data.question);
}
</script>

<style scoped>
/* CSS Animation cho chuyển cảnh */
.slide-fade-enter-active {
  transition: all 0.5s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from {
  transform: translateX(50px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateX(-50px);
  opacity: 0;
}
</style>