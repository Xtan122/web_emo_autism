import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../views/LandingPage.vue'
import Dashboard from '../views/Dashboard.vue'
import LessonView from '../views/LessonView.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Report from '../views/Report.vue'
import Profile from '../views/Profile.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LandingPage
    },

    { 
        path: '/login', 
        name: 'login', 
        component: Login },

    { 
        path: '/register', 
        name: 'register', 
        component: Register 
    },

    {
      path: '/app',
      name: 'dashboard',
      component: Dashboard
    },

    {
      // Đường dẫn động: nhận id cấp độ và loại bài
      path: '/learn/:levelId/:lessonType', 
      name: 'lesson',
      component: LessonView
    },

    { 
       path: '/report', 
       name: 'report', 
       component: Report 
    },

    { 
        path: '/profile', 
        name: 'profile', 
        component: Profile 
    },
  ]
})

export default router