<template>
  <div class="min-h-screen md:pl-64 bg-slate-50 font-quicksand overflow-x-hidden">
    <Sidebar />
    
    <div class="max-w-md mx-auto px-4 pt-6 pb-32 relative z-10">
      
      <div class="flex justify-end gap-4 mb-8 sticky top-4 z-50">
        <div class="bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-sm flex items-center gap-2 text-orange-500 font-extrabold border border-slate-200">
            <i class="fas fa-fire"></i> {{ store.currentStreak }}
        </div>
        <div id="star-counter" class="bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-sm flex items-center gap-2 text-yellow-500 font-extrabold border border-slate-200 transition-transform duration-200" :class="{ 'scale-125': starBump }">
            <i class="fas fa-star"></i> {{ store.stars }}
        </div>
      </div>

      <div v-for="(level, index) in store.levels" :key="level.id" class="relative mb-30">
        
        <div class="flex justify-center mb-8 relative z-20">
           <div :class="['px-6 py-2 rounded-full font-bold text-white shadow-sm text-sm uppercase tracking-wider', 
            level.locked ? 'bg-slate-400' : 'bg-blue-500']">
            {{ level.name }} <span v-if="level.locked"><i class="fas fa-lock ml-1"></i></span>
          </div>
        </div>

        <div class="relative h-[750px] w-full">
          
          <svg class="absolute top-0 left-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path 
              d="M 50 5 C 50 15 20 15 20 30 C 20 45 80 45 80 60 C 80 75 50 70 50 80 L 50 95" 
              fill="none" 
              stroke="#cbd5e1" 
              stroke-width="2.5" 
              stroke-dasharray="8,8" 
              stroke-linecap="round"
            />
          </svg>

          <div class="absolute left-1/2 -translate-x-1/2 top-[2%] z-20 group">
            <div v-if="getLessonState(level, 'flashcard') === 'current'" id="current-lesson-node" class="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-30 w-32 animate-bounce">
              <div class="bg-white text-green-600 text-sm font-extrabold px-6 py-3 rounded-2xl shadow-xl border-2 border-green-100 uppercase tracking-wide">Bắt đầu</div>
              <div class="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-white -mt-[1px]"></div>
            </div>
            <button @click="goToLesson(level.id, 'flashcard')" :class="getNodeClass(level, 'flashcard')">
              <i class="fas fa-book"></i>
              <div v-if="level.lessons.flashcard" class="absolute -right-1 -bottom-1 bg-green-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm border-4 border-slate-50 shadow-sm z-20"><i class="fas fa-check"></i></div>
            </button>
          </div>

          <div class="absolute left-[10%] top-[28%] z-20 group">
            <div v-if="getLessonState(level, 'matching') === 'current'" id="current-lesson-node" class="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-30 w-32 animate-bounce">
              <div class="bg-white text-pink-500 text-sm font-extrabold px-6 py-3 rounded-2xl shadow-xl border-2 border-pink-100 uppercase tracking-wide">Bắt đầu</div>
              <div class="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-white -mt-[1px]"></div>
            </div>
            <button @click="goToLesson(level.id, 'matching')" :class="getNodeClass(level, 'matching')">
              <i class="fas fa-puzzle-piece"></i>
              <div v-if="level.lessons.matching" class="absolute -right-1 -bottom-1 bg-green-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm border-4 border-slate-50 shadow-sm z-20"><i class="fas fa-check"></i></div>
            </button>
          </div>

          <div class="absolute right-[10%] top-[53%] z-20 group">
            <div v-if="getLessonState(level, 'context') === 'current'" id="current-lesson-node" class="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-30 w-32 animate-bounce">
              <div class="bg-white text-blue-600 text-sm font-extrabold px-6 py-3 rounded-2xl shadow-xl border-2 border-blue-100 uppercase tracking-wide">Bắt đầu</div>
              <div class="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-white -mt-[1px]"></div>
            </div>
            <button @click="goToLesson(level.id, 'context')" :class="getNodeClass(level, 'context')">
              <i class="fas fa-comments"></i>
              <div v-if="level.lessons.context" class="absolute -right-1 -bottom-1 bg-green-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm border-4 border-slate-50 shadow-sm z-20"><i class="fas fa-check"></i></div>
            </button>
          </div>

          <div class="absolute left-1/2 -translate-x-1/2 top-[78%] z-20 group">
            <div v-if="getLessonState(level, 'ai') === 'current'" id="current-lesson-node" class="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-30 w-32 animate-bounce">
              <div class="bg-white text-purple-600 text-sm font-extrabold px-6 py-3 rounded-2xl shadow-xl border-2 border-purple-100 uppercase tracking-wide">Bắt đầu</div>
              <div class="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-white -mt-[1px]"></div>
            </div>
            <button @click="goToLesson(level.id, 'ai')" :class="getNodeClass(level, 'ai')">
              <i class="fas fa-camera"></i>
              <div v-if="level.lessons.ai" class="absolute -right-1 -bottom-1 bg-green-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm border-4 border-slate-50 shadow-sm z-20"><i class="fas fa-check"></i></div>
            </button>
          </div>

          <div class="absolute left-1/2 -translate-x-1/2 top-[98%] z-30 group cursor-pointer transition-transform active:scale-90 active:translate-y-1"
               @click="handleOpenChest(level, $event)">
            
            <img v-if="!isLevelDone(level)" 
                 src="/images/chest/Color=Gold, Open=False.svg" 
                 class="w-20 h-22 object-contain grayscale opacity-60 drop-shadow-sm" />

            <div v-else-if="!level.chestClaimed" class="relative">
               <div class="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-yellow-400 text-white text-xs font-bold px-3 py-1.5 rounded-xl animate-bounce border-2 border-white shadow-md z-40">
                 Mở quà! 🎁
               </div>
               <img src="/images/chest/Color=Gold, Open=False.svg"
                    class="w-22 h-24 object-contain drop-shadow-2xl animate-pulse hover:scale-105 transition" />
            </div>

            <img v-else 
                src="/images/chest/Color=Gold, Open=True.svg"
                class="w-26 h-29 object-contain opacity-90" />
          </div>

        </div>

        <div v-if="index === store.levels.length - 1" class="flex flex-col items-center mt-20 relative z-0">
           <div class="h-20 w-0 border-l-4 border-dashed border-slate-300"></div>
           <div class="mt-4 flex flex-col items-center opacity-40">
              <i class="fas fa-flag-checkered text-3xl text-slate-400 mb-2"></i>
              <p class="text-xs font-bold text-slate-500 uppercase tracking-widest">Hết lộ trình hiện tại</p>
           </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'; 
import { useRouter } from 'vue-router';
import { onMounted } from 'vue'; 
import Sidebar from '../components/Sidebar.vue';
import { useProgressStore } from '../stores/progress';

const router = useRouter();
const store = useProgressStore();
const starBump = ref(false); 

onMounted(() => {
  setTimeout(() => {
    const currentEl = document.getElementById('current-lesson-node');
    if (currentEl) {
      currentEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 300);
});

const isLevelDone = (level) => {
  return level.lessons.flashcard && level.lessons.matching && level.lessons.context && level.lessons.ai;
};

const handleOpenChest = (level, event) => {
  if (!isLevelDone(level) || level.chestClaimed) return;

  const chestRect = event.target.getBoundingClientRect();
  const starRect = document.getElementById('star-counter').getBoundingClientRect();
  
  for (let i = 0; i < 10; i++) {
    createFlyingStar(chestRect, starRect, i * 100);
  }
  store.claimChest(level.id);
};

const createFlyingStar = (startRect, endRect, delay) => {
  const star = document.createElement('div');
  star.innerHTML = '⭐';
  star.style.position = 'fixed';
  star.style.fontSize = '24px';
  star.style.zIndex = '9999';
  star.style.left = (startRect.left + startRect.width / 2) + 'px';
  star.style.top = (startRect.top) + 'px';
  star.style.transition = 'all 0.8s cubic-bezier(0.42, 0, 0.58, 1)'; 
  star.style.opacity = '1';
  star.style.pointerEvents = 'none';

  document.body.appendChild(star);

  setTimeout(() => {
    star.style.left = (endRect.left + 10) + 'px';
    star.style.top = (endRect.top + 5) + 'px';
    star.style.opacity = '0';
    star.style.transform = 'scale(0.5) rotate(360deg)';

    setTimeout(() => {
      star.remove();
      triggerStarBump();
    }, 800);
  }, delay);
};

const triggerStarBump = () => {
  starBump.value = true;
  setTimeout(() => { starBump.value = false; }, 100);
};

const getLessonState = (level, type) => {
  if (store.isLessonLocked(level.id, type)) return 'locked';
  if (level.lessons[type]) return 'completed';
  return 'current';
};

const getNodeClass = (level, type) => {
  const isLocked = store.isLessonLocked(level.id, type);
  
  // Class chung cho cả khóa và mở (đều có active:translate-y)
  let classes = "w-20 h-20 rounded-full flex items-center justify-center text-3xl text-white transition-all duration-150 relative active:scale-95 active:translate-y-[4px] ";

  if (isLocked) {
    // Nút khóa: Vẫn lún nhưng màu xám
    return classes + "bg-slate-200 text-slate-400 cursor-default shadow-[0_6px_0_#cbd5e1]";
  }

  // Nút mở: Con trỏ bàn tay
  classes += "cursor-pointer hover:scale-105 ";

  if (type === 'flashcard') classes += "bg-yellow-400 shadow-[0_6px_0_#ca8a04]"; 
  else if (type === 'matching') classes += "bg-pink-400 shadow-[0_6px_0_#db2777]";
  else if (type === 'context') classes += "bg-green-500 shadow-[0_6px_0_#15803d]";
  else classes += "bg-purple-500 shadow-[0_6px_0_#7e22ce]";

  return classes;
};

const goToLesson = (lvId, type) => {
  if (!store.isLessonLocked(lvId, type)) {
    setTimeout(() => {
      router.push(`/learn/${lvId}/${type}`);
    }, 100);
  } else {
    // Không làm gì (chỉ lún nút)
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@500;700;800&display=swap');
.font-quicksand { font-family: 'Quicksand', sans-serif; }
</style>