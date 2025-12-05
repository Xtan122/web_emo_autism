<template>
  <div class="w-full max-w-6xl mx-auto p-2 animate-fade-in">
    
    <div class="text-center mb-6">
      <h2 class="text-2xl md:text-3xl font-bold text-blue-600 mb-2">
        {{ data.instruction || "Quan sát và thể hiện cảm xúc nhé!" }}
      </h2>
      <p class="text-slate-500 text-lg">Hãy nhìn vào camera và bắt chước biểu cảm trong video</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[500px]">
      
      <div class="lg:col-span-2 h-full flex flex-col gap-4">
        
        <div class="relative w-full flex-1 bg-black rounded-3xl overflow-hidden shadow-xl border-4 border-white ring-1 ring-slate-200">
          <iframe 
            v-if="data.videoThumbnail"
            class="w-full h-full object-cover"
            :src="data.videoThumbnail" 
            title="Video player" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowfullscreen>
          </iframe>
          
          <div v-else class="w-full h-full flex items-center justify-center text-white">
            Đang tải video...
          </div>
        </div>

        <div class="flex justify-center gap-4 h-12 shrink-0">
             <button class="bg-slate-100 hover:bg-slate-200 text-slate-600 px-6 rounded-xl font-bold transition flex items-center gap-2">
               <i class="fas fa-redo"></i> Xem lại
             </button>
             <button @click="$emit('next', true)" class="bg-green-500 hover:bg-green-600 text-white px-8 rounded-xl font-bold shadow-lg transition active:scale-95 flex items-center gap-2">
               <i class="fas fa-check"></i> Hoàn thành
             </button>
        </div>
      </div>

      <div class="lg:col-span-1 h-full flex flex-col gap-4">
        
        <div class="h-[40%] bg-slate-800 rounded-3xl overflow-hidden shadow-lg border-4 border-slate-200 relative">
          <video id="user-camera" class="w-full h-full object-cover transform -scale-x-100" autoplay muted playsinline></video>
          
          <div class="absolute top-3 right-3 flex items-center gap-2 bg-black/40 px-2 py-1 rounded-md backdrop-blur">
            <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span class="text-white text-[10px] font-bold tracking-widest">REC</span>
          </div>

          <div class="absolute inset-0 flex flex-col items-center justify-center text-slate-500 z-0 pointer-events-none">
            <i class="fas fa-camera text-3xl mb-1 opacity-50"></i>
          </div>
        </div>

        <div class="flex-1 bg-white rounded-3xl p-4 shadow-lg border border-slate-100 flex flex-col">
          
          <div class="flex justify-between items-center mb-2 border-b pb-2">
            <h3 class="font-bold text-slate-700 text-sm">📊 Cảm xúc Real-time</h3>
            <span class="text-xs font-bold text-green-600 animate-pulse">AI Active</span>
          </div>

          <div class="flex-1 flex items-end justify-between gap-2 px-1 pb-2">
            <div v-for="(value, key) in mockStats" :key="key" class="flex flex-col items-center gap-1 flex-1 group h-full justify-end">
              <span class="text-[10px] font-bold text-slate-400 group-hover:text-slate-600 transition-colors">{{ value }}%</span>
              
              <div class="w-full bg-slate-100 rounded-t-md relative overflow-hidden transition-all duration-500 ease-out" style="height: 100%">
                 <div 
                    class="absolute bottom-0 left-0 w-full rounded-t-md transition-all duration-300"
                    :class="getColorClass(key)"
                    :style="{ height: value + '%' }"
                 ></div>
              </div>

              <div class="text-center" :title="getLabel(key)">
                <div class="text-lg leading-none">{{ getEmoji(key) }}</div>
              </div>
            </div>
          </div>

          <div class="bg-slate-50 rounded-xl p-2 text-center mt-auto">
            <p class="text-xs text-slate-400">Cảm xúc chủ đạo</p>
            <p class="text-lg font-bold text-blue-600 capitalize animate-pulse">{{ currentDominantEmotion }}</p>
          </div>

        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

const props = defineProps(['data']);
const emit = defineEmits(['next']);

// WebSocket & AI connection
const WS_URL = 'ws://localhost:8000/ws';
let ws = null;
let canvasCtx = null;

// Dữ liệu cảm xúc từ AI
const mockStats = ref({
  happy: 0, sad: 0, fear: 0, angry: 0, surprised: 0, disgust: 0
});

// Thông tin phát hiện
const aiData = ref({
  found: false,
  is_owner: false,
  emotion: 'neutral',
  confidence: 0.0,
  box: []
});

let intervalTimer = null;

// Helper màu sắc & nhãn
const getColorClass = (key) => {
  const map = {
    happy: 'bg-green-500', sad: 'bg-blue-400', fear: 'bg-purple-500',
    angry: 'bg-red-500', surprised: 'bg-yellow-400', disgust: 'bg-emerald-700'
  };
  return map[key] || 'bg-slate-400';
};

const getEmoji = (key) => {
  const map = { happy: '😄', sad: '😢', fear: '😨', angry: '😡', surprised: '😲', disgust: '🤢' };
  return map[key];
};

const getLabel = (key) => {
  const map = { happy: 'Vui vẻ', sad: 'Buồn bã', fear: 'Sợ hãi', angry: 'Giận dữ', surprised: 'Ngạc nhiên', disgust: 'Ghê tởm' };
  return map[key];
};

// Kết nối WebSocket
const connectWebSocket = () => {
  try {
    ws = new WebSocket(WS_URL);
    
    ws.onopen = () => {
      console.log('✅ WebSocket connected to AI server');
    };
    
    ws.onmessage = (event) => {
      try {
        const result = JSON.parse(event.data);
        aiData.value = result;
        
        // Cập nhật stats từ AI
        if (result.found && result.emotion && result.emotion !== 'neutral') {
          const emotion = result.emotion;
          const confidence = Math.round((result.confidence || 0) * 100);
          
          // Làm mượt animation: giảm dần các giá trị cũ
          Object.keys(mockStats.value).forEach(key => {
            mockStats.value[key] = Math.max(0, mockStats.value[key] * 0.85);
          });
          
          // Set giá trị mới cho cảm xúc hiện tại
          if (mockStats.value.hasOwnProperty(emotion)) {
            mockStats.value[emotion] = Math.min(100, confidence);
          }
        }
      } catch (e) {
        console.error('Error parsing AI response:', e);
      }
    };
    
    ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
    };
    
    ws.onclose = () => {
      console.log('🔌 WebSocket disconnected');
    };
  } catch (error) {
    console.error('Failed to connect WebSocket:', error);
  }
};

// Gửi frame đến AI server
const sendFrameToAI = (videoEl) => {
  if (!ws || ws.readyState !== WebSocket.OPEN) return;
  
  const canvas = document.createElement('canvas');
  canvas.width = videoEl.videoWidth;
  canvas.height = videoEl.videoHeight;
  canvasCtx = canvas.getContext('2d');
  
  canvasCtx.drawImage(videoEl, 0, 0);
  
  canvas.toBlob((blob) => {
    if (blob) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result;
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(base64data);
        }
      };
      reader.readAsDataURL(blob);
    }
  }, 'image/jpeg', 0.8);
};

// Lifecycle
onMounted(() => {
  const videoEl = document.getElementById('user-camera');
  
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      if(videoEl) {
        videoEl.srcObject = stream;
        
        // Đợi video sẵn sàng rồi kết nối AI
        videoEl.onloadedmetadata = () => {
          connectWebSocket();
          
          // Gửi frame mỗi 100ms (10 FPS)
          intervalTimer = setInterval(() => {
            sendFrameToAI(videoEl);
          }, 100);
        };
      }
    }).catch(e => console.log("Lỗi camera:", e));
  }
});

onUnmounted(() => {
  if(intervalTimer) clearInterval(intervalTimer);
  
  // Đóng WebSocket
  if (ws) {
    ws.close();
    ws = null;
  }
  
  // Tắt camera
  const videoEl = document.getElementById('user-camera');
  if (videoEl && videoEl.srcObject) {
    videoEl.srcObject.getTracks().forEach(t => t.stop());
  }
});

const currentDominantEmotion = computed(() => {
  let maxKey = 'happy';
  let maxValue = 0;
  for (const [key, value] of Object.entries(mockStats.value)) {
    if (value > maxValue) { maxValue = value; maxKey = key; }
  }
  return getLabel(maxKey);
});
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.6s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>