<template>
  <div class="w-full max-w-4xl mx-auto flex flex-col lg:flex-row gap-8 items-start animate-fade-in min-h-[500px]">
    
    <div class="w-full lg:w-1/3 flex flex-col items-center text-center space-y-4">
      <div class="bg-white p-4 rounded-3xl shadow-md border-2 border-blue-100 w-full">
        <h3 class="text-lg font-bold text-blue-600 mb-2">🎥 Hướng dẫn</h3>
        <div class="aspect-square rounded-2xl overflow-hidden border-4 border-yellow-300 shadow-sm mb-3 relative group">
           <img :src="data.guideImage" class="w-full h-full object-cover transform group-hover:scale-110 transition duration-500" alt="Guide">
           <button class="absolute bottom-2 right-2 bg-white text-blue-500 w-10 h-10 rounded-full shadow-md flex items-center justify-center hover:scale-110 transition">
             <i class="fas fa-volume-up"></i>
           </button>
        </div>
        <p class="text-slate-600 font-bold text-lg">"{{ data.guideText }}"</p>
      </div>
    </div>

    <div class="w-full lg:w-2/3 flex flex-col gap-4">
      
      <div class="relative bg-black rounded-3xl overflow-hidden shadow-xl border-4 border-slate-200 aspect-[4/3]">
        
        <video v-show="!capturedImage" ref="videoRef" class="w-full h-full object-cover transform -scale-x-100" autoplay muted playsinline></video>
        
        <img v-if="capturedImage" :src="capturedImage" class="w-full h-full object-cover transform -scale-x-100" />

        <canvas ref="canvasRef" class="hidden"></canvas>

        <div v-if="isAnalyzing" class="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white z-20 backdrop-blur-sm">
          <div class="animate-spin text-5xl mb-4">🤖</div>
          <p class="font-bold text-xl animate-pulse">AI đang xem ảnh...</p>
        </div>

      </div>

      <div class="flex justify-center items-center gap-6">
        
        <div v-if="!capturedImage" class="relative group">
           <button @click="takePhoto" class="w-20 h-20 bg-white rounded-full border-4 border-slate-200 flex items-center justify-center shadow-lg active:scale-90 transition group-hover:border-blue-400">
             <div class="w-16 h-16 bg-red-500 rounded-full border-4 border-white group-hover:bg-red-600 transition"></div>
           </button>
           <p class="absolute -bottom-8 left-1/2 -translate-x-1/2 text-slate-400 font-bold text-sm whitespace-nowrap">Bấm để chụp</p>
        </div>

        <div v-else class="flex gap-4 w-full">
           <button @click="resetCamera" class="flex-1 bg-slate-100 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-200 transition border-2 border-slate-200">
             <i class="fas fa-redo mr-2"></i> Chụp lại
           </button>
           <button @click="$emit('next', true)" class="flex-1 bg-green-500 text-white font-bold py-3 rounded-xl hover:bg-green-600 transition shadow-lg border-b-4 border-green-700 active:border-b-0 active:translate-y-1">
             Tiếp tục <i class="fas fa-arrow-right ml-2"></i>
           </button>
        </div>

      </div>

      <div v-if="aiResult" class="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-100 animate-slide-up">
        <div class="flex items-start gap-4">
          <div class="text-5xl animate-bounce">{{ aiResult.emoji }}</div>
          <div class="flex-1">
            <h4 class="text-purple-600 font-extrabold text-xl mb-1">AI Nhận xét:</h4>
            <p class="text-slate-700 font-bold text-lg mb-2">"{{ aiResult.message }}"</p>
            <div class="bg-yellow-50 text-yellow-700 px-3 py-2 rounded-lg text-sm font-medium border border-yellow-200 flex items-center gap-2">
              <i class="fas fa-lightbulb text-yellow-500"></i>
              Gợi ý: {{ aiResult.tip }}
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps(['data']);
const emit = defineEmits(['next']);

const videoRef = ref(null);
const canvasRef = ref(null);
const capturedImage = ref(null);
const isAnalyzing = ref(false);
const aiResult = ref(null);

// 1. KHỞI ĐỘNG CAMERA
const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.value) videoRef.value.srcObject = stream;
  } catch (err) {
    console.error("Lỗi camera:", err);
    alert("Không thể mở camera. Hãy kiểm tra quyền truy cập!");
  }
};

onMounted(() => {
  startCamera();
});

onUnmounted(() => {
  if (videoRef.value && videoRef.value.srcObject) {
    videoRef.value.srcObject.getTracks().forEach(track => track.stop());
  }
});

// 2. CHỤP ẢNH
const takePhoto = () => {
  if (!videoRef.value || !canvasRef.value) return;

  const video = videoRef.value;
  const canvas = canvasRef.value;
  const context = canvas.getContext('2d');

  // Set kích thước canvas bằng video
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Vẽ ảnh từ video sang canvas
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Lưu ảnh dạng base64 để hiển thị
  capturedImage.value = canvas.toDataURL('image/png');

  // Gọi hàm giả lập phân tích AI
  analyzeImage();
};

// 3. RESET
const resetCamera = () => {
  capturedImage.value = null;
  aiResult.value = null;
  // Video vẫn chạy nền nên không cần start lại, chỉ cần ẩn ảnh đi
};

// 4. MOCKUP API GEMINI (Giả lập phân tích)
const analyzeImage = () => {
  isAnalyzing.value = true;

  // Giả lập độ trễ mạng 2 giây
  setTimeout(() => {
    isAnalyzing.value = false;
    
    // Kết quả giả lập (Sau này sẽ gọi API thật ở đây)
    // Logic đơn giản: Random kết quả để test giao diện
    const randomScore = Math.random();
    
    if (randomScore > 0.3) {
        aiResult.value = {
            emoji: '🤩',
            message: props.data.successMessage || "Tuyệt vời! Con làm rất giống.",
            tip: "Giữ nguyên nụ cười này nhé!"
        };
        // Tự động lưu vào lịch sử (Todo sau này)
    } else {
        aiResult.value = {
            emoji: '🤔',
            message: "Hmm, hình như con chưa cười thì phải?",
            tip: props.data.tips || "Hãy thử mở miệng rộng hơn chút nữa."
        };
    }
  }, 2000);
};
</script>

<style scoped>
.animate-slide-up { animation: slideUp 0.5s ease-out; }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
</style>