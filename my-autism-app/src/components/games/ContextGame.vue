<template>
  <div class="w-full max-w-5xl mx-auto relative min-h-[500px]">
    
    <Transition name="slide-fade" mode="out-in">
      
      <div :key="question.id" class="w-full flex flex-col md:flex-row items-start gap-8">
        
        <div class="w-full md:w-1/2">
          <div class="aspect-square rounded-3xl overflow-hidden border-4 border-white shadow-xl relative group">
            <img :src="question.image" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Tình huống" />
            
            <div class="absolute top-4 left-4 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-sm border-2 border-white">
              Tình huống
            </div>
          </div>
        </div>

        <div class="w-full md:w-1/2 flex flex-col">
          
          <div class="bg-white p-6 rounded-3xl shadow-sm border-2 border-slate-100 mb-6 relative">
            <i class="fas fa-quote-left text-green-200 text-4xl absolute top-4 left-4 -z-0 opacity-50"></i>
            <p class="text-lg text-slate-700 font-medium relative z-10 leading-relaxed indent-6">
              {{ question.story }}
            </p>
            <button class="mt-4 text-green-600 font-bold text-sm flex items-center gap-2 hover:bg-green-50 px-3 py-1 rounded-lg transition w-fit">
              <i class="fas fa-volume-up"></i> Nghe kể chuyện
            </button>
          </div>

          <h3 class="text-xl font-bold text-slate-700 mb-4 px-2">{{ question.question }}</h3>

          <div class="grid grid-cols-1 gap-4">
            <button 
              v-for="opt in question.options" 
              :key="opt"
              @click="checkAnswer(opt)"
              :disabled="isProcessing"
              :class="getButtonClass(opt)"
              class="btn-3d w-full py-4 px-6 rounded-2xl text-lg font-bold text-left flex items-center justify-between transition-all hover:scale-[1.02] hover:shadow-md"
            >
              <span>{{ opt }}</span>
              <span class="text-2xl">{{ getEmoji(opt) }}</span>
            </button>
          </div>

        </div>
      </div>
    </Transition>

    <div v-if="showSuccessFeedback" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 animate-bounce-in pointer-events-none whitespace-nowrap">
       <div class="bg-green-500 text-white text-2xl md:text-3xl font-bold px-8 py-4 rounded-full shadow-2xl border-4 border-white">
         Hiểu chuyện quá! 🌟
       </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps(['data']);
const emit = defineEmits(['next']);

const isProcessing = ref(false);
const selectedOpt = ref(null);
const showSuccessFeedback = ref(false);

const question = computed(() => props.data);

// Helper Emoji
const getEmoji = (text) => {
    if (text.includes('Vui')) return '😊';
    if (text.includes('Buồn')) return '😢';
    if (text.includes('Giận')) return '😡';
    if (text.includes('Sợ')) return '😨';
    if (text.includes('Ngạc')) return '😲';
    return '🤔';
}

// Xử lý Class cho nút 3D
const getButtonClass = (opt) => {
    // 1. Chưa chọn: Màu trắng
    if (!selectedOpt.value) return "btn-white";

    // 2. Đáp án đúng: Màu xanh lá
    if (opt === question.value.correct) return "btn-green";

    // 3. Chọn sai: Màu đỏ
    if (opt === selectedOpt.value && opt !== question.value.correct) return "btn-red";
    
    // 4. Các nút còn lại: Mờ đi
    return "btn-white opacity-50";
}

// LOGIC CHÍNH
const checkAnswer = (opt) => {
    if (isProcessing.value) return;

    selectedOpt.value = opt;

    if (opt === question.value.correct) {
        // ĐÚNG
        isProcessing.value = true;
        showSuccessFeedback.value = true;
        
        // playSound('correct');

        // Chờ 1.2s rồi chuyển câu
        setTimeout(() => {
            emit('next', true);
            resetState();
        }, 1200);

    } else {
        // SAI
        // playSound('wrong');
        
        // Rung hoặc reset sau 0.8s để chọn lại
        setTimeout(() => {
            selectedOpt.value = null;
        }, 800);
    }
}

const resetState = () => {
    isProcessing.value = false;
    selectedOpt.value = null;
    showSuccessFeedback.value = false;
}
</script>

<style scoped>
/* --- CSS TRANSITION (Trượt mượt mà) --- */
.slide-fade-enter-active {
  transition: all 0.4s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from {
  transform: translateX(30px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-30px);
  opacity: 0;
}

/* Animation Feedback */
@keyframes bounceIn {
  0% { transform: translate(-50%, -50%) scale(0); }
  60% { transform: translate(-50%, -50%) scale(1.1); }
  100% { transform: translate(-50%, -50%) scale(1); }
}
.animate-bounce-in {
  animation: bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
}
</style>