<template>
  <div class="w-full max-w-3xl mx-auto text-center py-4">
    
    <h2 class="text-2xl md:text-3xl font-bold text-slate-700 mb-2 animate-bounce-slow">
      Tìm cặp giống nhau 🧩
    </h2>
    <p class="text-slate-500 mb-8">Lật 2 thẻ để xem hình bên dưới nhé!</p>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 perspective-container">
      
      <div 
        v-for="card in shuffledCards" 
        :key="card.uuid"
        class="aspect-square relative cursor-pointer group"
        @click="flipCard(card)"
      >
        <div :class="['flip-card-inner w-full h-full transition-transform duration-500 transform-style-3d', 
             card.isFlipped || card.isMatched ? 'rotate-y-180' : '']">
          
          <div class="flip-card-front absolute w-full h-full backface-hidden rounded-2xl shadow-lg border-b-8 border-blue-600 bg-blue-400 hover:bg-blue-300 flex items-center justify-center transition-colors">
             <span class="text-5xl font-bold text-white opacity-50">?</span>
          </div>

          <div :class="['flip-card-back absolute w-full h-full backface-hidden rounded-2xl shadow-lg border-4 flex items-center justify-center rotate-y-180 bg-white overflow-hidden',
               card.isMatched ? 'border-green-400 ring-4 ring-green-200' : 'border-blue-200']">
             
             <img :src="card.image" class="w-full h-full object-cover p-2" alt="Card Image" />
             
             <div v-if="card.isMatched" class="absolute inset-0 bg-green-500/20 flex items-center justify-center animate-pulse">
               <i class="fas fa-check text-4xl text-green-600 drop-shadow-md"></i>
             </div>
          </div>

        </div>
      </div>

    </div>

    <div v-if="isAllMatched" class="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div class="bg-yellow-400 text-white text-4xl font-bold px-10 py-6 rounded-3xl shadow-2xl border-4 border-white animate-bounce-in">
        Xuất sắc! 🎉
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const props = defineProps(['data']); 
const emit = defineEmits(['next']);

const shuffledCards = ref([]);
const selectedCards = ref([]);
const isProcessing = ref(false); // Khóa click khi đang chờ úp bài

// Helper: Trộn mảng ngẫu nhiên
const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

onMounted(() => {
  if (!props.data || props.data.length === 0) return;

  // Tạo dữ liệu thẻ bài (Nhân bản logic từ data cha hoặc data mẫu)
  // Lưu ý: props.data truyền vào nên là danh sách các cặp.
  const cards = props.data.map(c => ({
    ...c,
    uuid: Math.random().toString(36).substr(2, 9), // ID duy nhất
    isFlipped: false,
    isMatched: false
  }));
  
  shuffledCards.value = shuffleArray(cards);
});

const isAllMatched = computed(() => {
  return shuffledCards.value.length > 0 && shuffledCards.value.every(c => c.isMatched);
});

const flipCard = (card) => {
  // Chặn click nếu: Đang xử lý, Đã lật, Đã ghép đúng
  if (isProcessing.value || card.isFlipped || card.isMatched) return;

  // 1. Lật thẻ
  card.isFlipped = true;
  selectedCards.value.push(card);
  
  // Play sound lật (nếu có)
  // playSound('flip');

  // 2. Kiểm tra logic khi đã lật 2 thẻ
  if (selectedCards.value.length === 2) {
    isProcessing.value = true; // Khóa bàn phím
    const [card1, card2] = selectedCards.value;

    if (card1.emotion === card2.emotion) {
      // --- ĐÚNG: MATCH ---
      setTimeout(() => {
        card1.isMatched = true;
        card2.isMatched = true;
        selectedCards.value = [];
        isProcessing.value = false;
        
        // Play sound match
        // playSound('correct');

        // Kiểm tra thắng
        if (isAllMatched.value) {
           setTimeout(() => emit('next', true), 1500); // Chờ 1.5s để bé tận hưởng chiến thắng
        }
      }, 600); // Chờ animation lật xong
    } else {
      // --- SAI: ÚP LẠI ---
      setTimeout(() => {
        card1.isFlipped = false;
        card2.isFlipped = false;
        selectedCards.value = [];
        isProcessing.value = false;
        // Play sound fail
        // playSound('wrong');
      }, 1000); // Cho bé xem 1s rồi mới úp
    }
  }
};
</script>

<style scoped>
/* --- 3D FLIP EFFECT CSS --- */
.perspective-container {
  perspective: 1000px;
}

.transform-style-3d {
  transform-style: preserve-3d;
}

.backface-hidden {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.rotate-y-180 {
  transform: rotateY(180deg);
}

/* Animation Feedback */
@keyframes bounceIn {
  0% { transform: scale(0); opacity: 0; }
  60% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); }
}
.animate-bounce-in {
  animation: bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
}
</style>