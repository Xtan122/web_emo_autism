<template>
    <aside
        class="hidden md:flex flex-col w-64 h-screen bg-white border-r-2 border-slate-100 p-6 fixed left-0 top-0 z-20">
        <div class="flex items-center gap-2 mb-8 cursor-pointer" @click="$router.push('/')">
            <div
                class="w-10 h-10 bg-rose-300 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-sm">
                E</div>
            <span class="text-2xl font-bold text-rose-400">Empathy<span class="text-sky-400">Kids</span></span>
        </div>

        <nav class="flex flex-col gap-2 flex-1">
            <router-link to="/app" active-class="bg-rose-50 text-rose-500 border-rose-200"
                class="flex items-center gap-4 px-4 py-3 text-slate-500 border-2 border-transparent hover:bg-rose-50/50 rounded-2xl font-bold transition-all">
                <i class="fas fa-home text-xl w-8 text-center"></i>
                <span>Học tập</span>
            </router-link>

            <router-link to="/report" active-class="bg-rose-50 text-rose-500 border-rose-200"
                class="flex items-center gap-4 px-4 py-3 text-slate-500 border-2 border-transparent hover:bg-rose-50/50 rounded-2xl font-bold transition-all">
                <i class="fas fa-chart-pie text-xl w-8 text-center"></i>
                <span>Báo cáo</span>
            </router-link>

            <router-link to="/profile" active-class="bg-rose-50 text-rose-500 border-rose-200"
                class="flex items-center gap-4 px-4 py-3 text-slate-500 border-2 border-transparent hover:bg-rose-50/50 rounded-2xl font-bold transition-all">
                <i class="fas fa-user text-xl w-8 text-center"></i>
                <span>Hồ sơ</span>
            </router-link>
        </nav>

        <div class="border-t border-slate-100 pt-4">
            <button @click="handleLogout"
                class="w-full flex items-center gap-4 px-4 py-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl font-bold transition-all">
                <i class="fas fa-sign-out-alt text-xl w-8 text-center"></i>
                <span>Đăng xuất</span>
            </button>
        </div>
    </aside>

    <div
        class="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 flex justify-around py-4 z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
        <router-link to="/app" active-class="text-rose-500" class="text-slate-400 hover:text-rose-500 transition"><i
                class="fas fa-home text-2xl"></i></router-link>
        <router-link to="/report" active-class="text-rose-500" class="text-slate-400 hover:text-rose-500 transition"><i
                class="fas fa-chart-pie text-2xl"></i></router-link>
        <router-link to="/profile" active-class="text-rose-500" class="text-slate-400 hover:text-rose-500 transition"><i
                class="fas fa-user text-2xl"></i></router-link>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useProgressStore } from '../stores/progress';

const router = useRouter();
const store = useProgressStore();

const handleLogout = () => {
    // Hỏi xác nhận trước khi thoát
    if (confirm("Bạn có chắc muốn đăng xuất không?")) {
        store.logout();
        router.push('/'); // Quay về Landing Page
    }
}
</script>