import { defineStore } from 'pinia';
import { RegisterData, User, Ad } from 'src/contracts'
import { api } from 'src/boot/axios'
import { authService } from 'src/services'

export const useAdminStore = defineStore('admin', {
  state: () => ({
    users : [] as User[],
    ads : [] as Ad[]
  }),

  getters: {
    getUsers (state) {
      return state.users;
    },
    getAds (state) {
      return state.ads
    },
    getRandomAd (state) {
      return state.ads[Math.floor(Math.random()*state.ads.length)]
    }
  },

  actions: {
    async addUser(user : RegisterData){
      user.password = await authService.sha256(user.password)
      user.passwordConfirmation = await authService.sha256(user.passwordConfirmation)
      console.log(user)
      await api.post('admin/addUser', user)
      this.refreshUsers()
    },
    async deleteUsers(userIDs : number[]){
      await api.post('admin/deleteUsers',userIDs)
      this.refreshUsers()
    },
    async refreshUsers(){
      const response = await api.get<User[]>('admin/getUsers')
      this.users = response.data
    },
    async refreshAds(){
      const response = await api.get<Ad[]>('admin/getAds')
      this.ads = response.data
      console.log(this.ads)
    },
    async addAd(ad : Ad){
      await api.post('admin/addAd',ad)
      this.refreshAds()
    },
    async deleteAds(adIDs : number[]){
      await api.post('admin/deleteAds',adIDs)
      this.refreshAds()
    }
  }
});
