import { defineStore } from 'pinia';
import { User } from 'src/contracts'
import { authService, authManager } from 'src/services'
import { LoginCredentials, RegisterData } from 'src/contracts'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    status: 'pending',
  }),
  getters: {
    isAuthenticated (state) {
      return state.user !== null
    },
    isAdmin (state) {
      return state.user?.admin
    }
  },
  actions: {
    async check(){
      const user = await authService.me()
      this.user = user?.user
      return user !== null
    },
    async register(form : RegisterData){
      const user = await authService.register(form)
      return user
    },
    async login(credentials: LoginCredentials){
      const apiToken = await authService.login(credentials)
      authManager.setToken(apiToken)
      return apiToken
    },
    async logout(){
      //await authService.logout()
      authManager.removeToken()
    }
  },
});
