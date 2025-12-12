import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    isAuthenticated: false
  }),
  
  getters: {
    getUserName: (state) => state.user?.name || 'Guest'
  },
  
  actions: {
    setUser(userData) {
      this.user = userData
      this.isAuthenticated = true
    },
    
    logout() {
      this.user = null
      this.isAuthenticated = false
    }
  }
})
