import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios' // 1. Import thêm axios
import './style.css'

import App from './App.vue'
import router from './router'

// --- CẤU HÌNH AXIOS (QUAN TRỌNG) ---
// Đặt URL mặc định cho backend
axios.defaults.baseURL = 'http://44.204.122.122:3000';


// Cấu hình Interceptor: Tự động gắn Token vào mọi request
axios.interceptors.request.use(
    config => {
        // Lấy token từ localStorage
        const token = localStorage.getItem('token'); 
        if (token) {
            // Gắn vào header: Authorization: Bearer <token>
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);
// ------------------------------------

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.mount('#app')