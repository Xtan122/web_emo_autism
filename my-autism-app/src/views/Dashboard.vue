<template>
  <div class="flex h-screen bg-slate-50 font-quicksand overflow-hidden">

    <div class="hidden md:block w-64 shrink-0 h-full border-r border-slate-200 bg-white z-20 relative">
      <Sidebar />
    </div>

    <div class="flex-1 h-full overflow-y-auto relative no-scrollbar scroll-smooth">

      <div
        class="md:hidden sticky top-0 z-50 bg-white/90 backdrop-blur p-4 border-b border-slate-100 flex justify-between items-center">
        <span class="font-bold text-rose-400 text-xl">EmpathyKids</span>
        <div class="flex gap-3">
          <div class="text-slate-700 font-bold"><i class="fas fa-fire text-orange-500"></i> {{ store.currentStreak }}
          </div>
          <div class="text-slate-700 font-bold"><i class="fas fa-star text-yellow-400"></i> {{ store.stars }}</div>
        </div>
      </div>

      <div class="max-w-xl mx-auto px-4 py-10 relative z-10">

        <div v-for="(level, index) in store.levels" :key="level.id" class="relative mb-20">

          <div class="flex justify-center mb-16 relative z-20">
            <div :class="['px-40 py-3 rounded-xl font-bold text-white shadow-lg text-base uppercase tracking-wider text-center min-w-[280px]',
              level.locked ? 'bg-slate-300' : 'bg-emerald-400']">
              {{ level.name }} <span v-if="level.locked"><i class="fas fa-lock ml-1"></i></span>
            </div>
          </div>

          <div class="relative h-[850px] w-full">

            <svg class="absolute top-0 left-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 100"
              preserveAspectRatio="none">
              <path d="M 50 5 C 50 15 20 15 20 25 C 20 35 80 35 80 45 C 80 55 20 55 20 65 C 20 75 50 75 50 85 L 50 98"
                fill="none" stroke="#cbd5e1" stroke-width="2.5" stroke-dasharray="8,8" stroke-linecap="round" />
            </svg>

            <div class="absolute left-1/2 -translate-x-1/2 top-[2%] z-20 group">
              <div v-if="getLessonState(level, 'flashcard') === 'current'" id="current-lesson-node"
                class="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-30 w-32 animate-bounce">
                <div
                  class="bg-white text-amber-500 text-sm font-extrabold px-6 py-3 rounded-2xl shadow-xl border-2 border-amber-100 uppercase tracking-wide">
                  Bắt đầu</div>
                <div
                  class="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-white -mt-[1px]">
                </div>
              </div>
              <button @click="goToLesson(level.id, 'flashcard')" :class="getNodeClass(level, 'flashcard')">
                <i class="fas fa-book"></i>
                <div v-if="level.lessons.flashcard"
                  class="absolute -right-1 -bottom-1 bg-emerald-400 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm border-4 border-white shadow-sm z-20">
                  <i class="fas fa-check"></i>
                </div>
              </button>
            </div>

            <div class="absolute left-[10%] top-[23%] z-20 group">
              <div v-if="getLessonState(level, 'matching') === 'current'" id="current-lesson-node"
                class="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-30 w-32 animate-bounce">
                <div
                  class="bg-white text-rose-500 text-sm font-extrabold px-6 py-3 rounded-2xl shadow-xl border-2 border-rose-100 uppercase tracking-wide">
                  Bắt đầu</div>
                <div
                  class="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-white -mt-[1px]">
                </div>
              </div>
              <button @click="goToLesson(level.id, 'matching')" :class="getNodeClass(level, 'matching')">
                <i class="fas fa-puzzle-piece"></i>
                <div v-if="level.lessons.matching"
                  class="absolute -right-1 -bottom-1 bg-emerald-400 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm border-4 border-white shadow-sm z-20">
                  <i class="fas fa-check"></i>
                </div>
              </button>
            </div>

            <div class="absolute right-[10%] top-[43%] z-20 group">
              <div v-if="getLessonState(level, 'context') === 'current'" id="current-lesson-node"
                class="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-30 w-32 animate-bounce">
                <div
                  class="bg-white text-sky-500 text-sm font-extrabold px-6 py-3 rounded-2xl shadow-xl border-2 border-sky-100 uppercase tracking-wide">
                  Bắt đầu</div>
                <div
                  class="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-white -mt-[1px]">
                </div>
              </div>
              <button @click="goToLesson(level.id, 'context')" :class="getNodeClass(level, 'context')">
                <i class="fas fa-comments"></i>
                <div v-if="level.lessons.context"
                  class="absolute -right-1 -bottom-1 bg-emerald-400 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm border-4 border-white shadow-sm z-20">
                  <i class="fas fa-check"></i>
                </div>
              </button>
            </div>

            <div class="absolute left-[10%] top-[63%] z-20 group">
              <div v-if="getLessonState(level, 'emotion_training') === 'current'" id="current-lesson-node"
                class="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-30 w-32 animate-bounce">
                <div
                  class="bg-white text-orange-500 text-sm font-extrabold px-6 py-3 rounded-2xl shadow-xl border-2 border-orange-100 uppercase tracking-wide">
                  Bắt đầu</div>
                <div
                  class="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-white -mt-[1px]">
                </div>
              </div>
              <button @click="goToLesson(level.id, 'emotion_training')"
                :class="getNodeClass(level, 'emotion_training')">
                <i class="fas fa-solid fa-dumbbell"></i>
                <div v-if="level.lessons.emotion_training"
                  class="absolute -right-1 -bottom-1 bg-emerald-400 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm border-4 border-white shadow-sm z-20">
                  <i class="fas fa-check"></i>
                </div>
              </button>
            </div>

            <div class="absolute left-1/2 -translate-x-1/2 top-[83%] z-20 group">
              <div v-if="getLessonState(level, 'ai') === 'current'" id="current-lesson-node"
                class="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-30 w-32 animate-bounce">
                <div
                  class="bg-white text-violet-500 text-sm font-extrabold px-6 py-3 rounded-2xl shadow-xl border-2 border-violet-100 uppercase tracking-wide">
                  Bắt đầu</div>
                <div
                  class="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[10px] border-t-white -mt-[1px]">
                </div>
              </div>
              <button @click="goToLesson(level.id, 'ai')" :class="getNodeClass(level, 'ai')">
                <i class="fas fa-camera"></i>
                <div v-if="level.lessons.ai"
                  class="absolute -right-1 -bottom-1 bg-emerald-400 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm border-4 border-white shadow-sm z-20">
                  <i class="fas fa-check"></i>
                </div>
              </button>
            </div>

            <div
              class="absolute left-1/2 -translate-x-1/2 top-[98%] z-30 group cursor-pointer transition-transform active:scale-90 active:translate-y-1"
              @click="handleOpenChest(level, $event)">
              <img v-if="!isLevelDone(level)" src="/images/chest/Color=Gold, Open=False.svg"
                class="w-20 h-22 grayscale opacity-60 drop-shadow-sm" />
              <div v-else-if="!level.chestClaimed" class="relative">
                <div
                  class="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-amber-400 text-white text-xs font-bold px-6 py-3 rounded-xl animate-bounce border-2 border-white shadow-md z-40">
                  Mở quà!</div>
                <img src="/images/chest/Color=Gold, Open=False.svg"
                  class="w-22 h-24 drop-shadow-2xl animate-pulse hover:scale-105 transition" />
              </div>
              <img v-else src="/images/chest/Color=Gold, Open=True.svg" class="w-26 h-29 opacity-90" />
            </div>

          </div>

          <div class="flex flex-col items-center mt-20 relative z-0">
            <div v-if="index === store.levels.length - 1" class="h-20 w-0 border-l-4 border-dashed border-slate-300">
            </div>
            <div v-if="index === store.levels.length - 1" class="mt-2 flex flex-col items-center opacity-40">
              <i class="fas fa-flag-checkered text-3xl text-slate-400 mb-2"></i>
              <p class="text-xs font-bold text-slate-500 uppercase tracking-widest">Hết lộ trình hiện tại</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="hidden lg:flex w-80 shrink-0 h-full border-l border-slate-200 bg-white flex-col p-6 gap-8 z-20">

      <div class="flex justify-between items-center gap-4">
        <div
          class="flex items-center gap-2 font-extrabold text-slate-700 hover:bg-slate-100 px-3 py-2 rounded-xl transition cursor-pointer">
          <i class="fas fa-fire text-orange-500 text-xl"></i>
          <span class="text-slate-700">{{ store.currentStreak }}</span>
        </div>
        <div id="star-counter"
          class="flex items-center gap-2 font-extrabold text-slate-700 hover:bg-slate-100 px-3 py-2 rounded-xl transition cursor-pointer"
          :class="{ 'scale-125 text-yellow-400': starBump }">
          <i class="fas fa-star text-yellow-400 text-xl"></i>
          <span class="text-slate-700">{{ store.stars }}</span>
        </div>
        <div
          class="flex items-center gap-2 font-extrabold text-slate-400 hover:bg-slate-100 px-3 py-2 rounded-xl transition cursor-pointer">
          <img :src="store.userInfo.avatar" class="w-8 h-8 rounded-full object-cover border-2 border-slate-200" />
        </div>
      </div>

      <div class="border-2 border-slate-100 rounded-2xl p-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-bold text-slate-700 text-lg">Nhiệm vụ hôm nay</h3>
          <span class="text-xs font-bold text-sky-400 uppercase cursor-pointer hover:text-sky-500">Xem tất cả</span>
        </div>
        <div class="space-y-4">
          <div class="flex items-center gap-4">
            <div class="text-2xl">⚡</div>
            <div class="flex-1">
              <p class="font-bold text-slate-700 text-sm">Hoàn thành 1 bài học</p>
              <div class="w-full bg-slate-200 h-2.5 rounded-full mt-2 overflow-hidden">
                <div class="bg-amber-400 h-full w-1/2 rounded-full"></div>
              </div>
            </div>
            <div class="text-xs font-bold text-amber-400">1/2</div>
          </div>
          <div class="flex items-center gap-4">
            <div class="text-2xl">🎁</div>
            <div class="flex-1">
              <p class="font-bold text-slate-700 text-sm">Mở 1 rương kho báu</p>
              <div class="w-full bg-slate-200 h-2.5 rounded-full mt-2 overflow-hidden">
                <div class="bg-emerald-400 h-full w-full rounded-full"></div>
              </div>
            </div>
            <div class="text-emerald-500 font-bold text-xs"><i class="fas fa-check"></i></div>
          </div>
        </div>
      </div>

      <div class="border-2 border-slate-100 rounded-2xl p-4 relative overflow-hidden group cursor-pointer">
        <div
          class="absolute inset-0 bg-gradient-to-br from-violet-300 to-sky-300 opacity-20 group-hover:opacity-30 transition">
        </div>
        <h3 class="font-bold text-slate-700 mb-2">Mở khóa Super?</h3>
        <p class="text-sm text-slate-500 mb-4">Học không giới hạn và tắt quảng cáo.</p>
        <button
          class="w-full py-2 rounded-xl bg-slate-800 text-white font-bold text-sm shadow-lg active:scale-95 transition">Dùng
          thử miễn phí</button>
      </div>

      <div class="mt-auto text-center text-xs text-slate-300 font-bold space-x-4">
        <a href="#" class="hover:text-slate-400">Giới thiệu</a>
        <a href="#" class="hover:text-slate-400">Riêng tư</a>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Sidebar from '../components/Sidebar.vue';
import { useProgressStore } from '../stores/progress';

const router = useRouter();
const store = useProgressStore();
const starBump = ref(false);

onMounted(() => {
  setTimeout(() => {
    const currentEl = document.getElementById('current-lesson-node');
    if (currentEl) {
      // Tự động cuộn đến bài học hiện tại
      currentEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 300);
});

const isLevelDone = (level) => level.lessons.flashcard && level.lessons.matching && level.lessons.context && level.lessons.emotion_training && level.lessons.ai;

const handleOpenChest = (level, event) => {
  if (!isLevelDone(level) || level.chestClaimed) return;
  const chestRect = event.target.getBoundingClientRect();
  const starRect = document.getElementById('star-counter').getBoundingClientRect();
  for (let i = 0; i < 10; i++) createFlyingStar(chestRect, starRect, i * 100);
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
    setTimeout(() => { star.remove(); starBump.value = true; setTimeout(() => starBump.value = false, 100); }, 800);
  }, delay);
};

const getLessonState = (level, type) => {
  if (store.isLessonLocked(level.id, type)) return 'locked';
  if (level.lessons[type]) return 'completed';
  return 'current';
};

const getNodeClass = (level, type) => {
  const state = getLessonState(level, type);

  let classes = "w-20 h-20 rounded-full flex items-center justify-center text-3xl text-white transition-all duration-150 relative z-10 active:translate-y-[4px] ";

  if (state === 'locked') {
    return classes + "bg-slate-200 text-slate-400 cursor-default shadow-[0_6px_0_#cbd5e1]";
  }

  classes += "cursor-pointer hover:scale-105 ";

  // ĐÃ XÓA CÁC CLASS RING TẠI ĐÂY
  if (type === 'flashcard') classes += "bg-amber-300 shadow-[0_6px_0_#d97706]";
  else if (type === 'matching') classes += "bg-rose-300 shadow-[0_6px_0_#e11d48]";
  else if (type === 'context') classes += "bg-sky-400 shadow-[0_6px_0_#0284c7]";
  else if (type === 'emotion_training') classes += "bg-orange-300 shadow-[0_6px_0_#ea580c]";
  else classes += "bg-violet-300 shadow-[0_6px_0_#7c3aed]";

  return classes;
};

const goToLesson = (lvId, type) => {
  if (!store.isLessonLocked(lvId, type)) {
    setTimeout(() => {
      router.push(`/learn/${lvId}/${type}`);
    }, 100);
  }
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@500;700;800&display=swap');

.font-quicksand {
  font-family: 'Quicksand', sans-serif;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
