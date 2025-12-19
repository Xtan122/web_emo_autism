<template>
  <div class="w-full max-w-4xl mx-auto relative min-h-[400px]">
    
    <Transition name="slide-fade" mode="out-in">
      <div :key="question.id" class="w-full flex flex-col gap-8">
        
        <div class="w-full">
          <div class="bg-white p-6 md:p-8 rounded-3xl shadow-lg border-2 border-slate-100 relative group hover:border-blue-200 transition-all duration-300">
            <i class="fas fa-quote-left text-blue-100 text-6xl absolute -top-3 -left-1 z-0"></i>
            
            <p class="text-xl md:text-2xl text-slate-700 font-medium relative z-10 leading-relaxed indent-8">
              {{ question.story }}
            </p>

            <div class="mt-6 flex justify-end">
                <button class="text-blue-500 font-bold text-base flex items-center gap-2 hover:bg-blue-50 px-4 py-2 rounded-xl transition cursor-pointer active:scale-95">
                  <i class="fas fa-volume-up text-xl"></i> Nghe kể chuyện
                </button>
            </div>
          </div>
        </div>

        <div class="w-full flex flex-col items-center">
          
          <h3 class="text-2xl md:text-3xl font-bold text-slate-800 mb-8 text-center drop-shadow-sm">
            {{ question.question }}
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5 w-full px-2">
            <button 
              v-for="opt in question.options" 
              :key="opt"
              @click="checkAnswer(opt)"
              :disabled="isProcessing"
              class="relative w-full py-5 px-6 rounded-2xl text-xl font-bold text-left flex items-center justify-between transition-all duration-200 group"
              :class="getButtonClass(opt)"
            >
              <span class="relative z-10">{{ opt }}</span>
              <span class="text-4xl ml-3 relative z-10 filter drop-shadow-md transition-transform group-hover:scale-110">
                  {{ getEmoji(opt) }}
              </span>
            </button>
          </div>

        </div>

      </div>
    </Transition>

    <div v-if="showSuccessFeedback" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 animate-bounce-in pointer-events-none whitespace-nowrap">
       <div class="bg-green-500 text-white text-2xl md:text-4xl font-bold px-10 py-5 rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.2)] border-4 border-white flex items-center gap-3">
         <span>Chính xác!</span> <i class="fas fa-star text-yellow-300 animate-spin-slow"></i>
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

const getEmoji = (text) => {
    if (text.includes('Vui')) return '😄';
    if (text.includes('Buồn')) return '😢';
    if (text.includes('Giận')) return '😡';
    if (text.includes('Sợ')) return '😱';
    if (text.includes('Ngạc')) return '😲';
    if (text.includes('Ghê')) return '🤢';
    return '🤔';
}

const getButtonClass = (opt) => {
    // 1. Trạng thái ĐÚNG (Luôn hiện xanh khi đã có kết quả)
    // Giúp trẻ thấy đáp án đúng kể cả khi chọn sai
    if (selectedOpt.value && opt === question.value.correct) {
        return "bg-green-500 border-b-4 border-green-700 text-white shadow-lg scale-[1.02]";
    }

    // 2. Trạng thái SAI (Chỉ hiện đỏ ở nút vừa bấm)
    if (selectedOpt.value === opt && opt !== question.value.correct) {
        return "bg-red-500 border-b-4 border-red-700 text-white animate-shake";
    }

    // 3. Trạng thái KHÔNG CHỌN (Mờ đi khi đã có kết quả)
    if (selectedOpt.value) {
        return "bg-slate-100 border-b-4 border-slate-200 text-slate-400 opacity-50 cursor-not-allowed";
    }
    
    // 4. Trạng thái BÌNH THƯỜNG (Chưa bấm gì)
    // Màu trắng, viền xám dày, hover lên thì viền xanh
    return "bg-white border-b-4 border-slate-300 text-slate-600 hover:border-blue-400 hover:bg-blue-50 active:border-b-0 active:translate-y-1 active:shadow-inner";
}

const checkAnswer = (opt) => {
    if (isProcessing.value) return; 

    selectedOpt.value = opt;
    isProcessing.value = true; 

    if (opt === question.value.correct) {
        showSuccessFeedback.value = true;
        setTimeout(() => {
            emit('next', true); 
            resetState();
        }, 1200);
    } else {
        setTimeout(() => {
            emit('next', false); 
            resetState();
        }, 1500);
    }
}

const resetState = () => {
    isProcessing.value = false;
    selectedOpt.value = null;
    showSuccessFeedback.value = false;
}
</script>

<style scoped>
/* Transition */
.slide-fade-enter-active { transition: all 0.5s ease-out; }
.slide-fade-leave-active { transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1); }
.slide-fade-enter-from { transform: translateY(20px); opacity: 0; }
.slide-fade-leave-to { transform: translateY(-20px); opacity: 0; }

/* Animation Rung Lắc khi sai */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  75% { transform: translateX(8px); }
}
.animate-shake { animation: shake 0.4s ease-in-out; }

@keyframes bounceIn {
  0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
  60% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
}
.animate-bounce-in { animation: bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards; }

@keyframes spinSlow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin-slow { animation: spinSlow 3s linear infinite; }
</style>