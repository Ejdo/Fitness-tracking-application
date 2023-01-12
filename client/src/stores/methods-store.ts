import { defineStore } from 'pinia';
import { Method } from 'src/contracts'
import { api } from 'src/boot/axios'

export const useMethodsStore = defineStore('methods', {
  state: () => ({
    methods : [] as Method[]
  }),

  getters: {
    getMethods (state) {
      return state.methods;
    }
  },

  actions: {
    async addMethod(method : Method){
      await api.post('methods/add', method)
      this.refreshMethods()
    },
    async deleteMethods(methodIDs : number[]){
      await api.post('methods/delete',methodIDs)
      this.refreshMethods()
    },
    async refreshMethods(){
      const response = await api.get<Method[]>('methods/get')
      this.methods = response.data
    }
  }
});
