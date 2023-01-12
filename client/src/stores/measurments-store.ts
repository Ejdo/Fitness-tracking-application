import { defineStore } from 'pinia';
import { Measurment } from 'src/contracts'
import { api } from 'src/boot/axios'

export const useMeasurmentsStore = defineStore('measurment', {
  state: () => ({
    measurments : [] as Measurment[],
    dateFilter : {from: new Date, to: new Date},
    methodFilter : '',
    filterOff : true
  }),

  getters: {
    getMeasurments (state) {
      return state.measurments;
    },
    getVaha (state){
      return state.measurments.filter(element => element.type === 'Váha' && (this.filterOff || ((new Date(element.date).getTime() > this.dateFilter.from.getTime()) && (new Date(element.date).getTime() < this.dateFilter.to.getTime()) && element.method_name == this.methodFilter)))
    },
    getHTlak (state){
      //return state.measurments.map(o => ({value: o.value, date: o.date}))
      return state.measurments.filter(element => element.type === 'Horný tlak' && (this.filterOff || ((new Date(element.date).getTime() > this.dateFilter.from.getTime()) && (new Date(element.date).getTime() < this.dateFilter.to.getTime()))))
    },
    getSTlak (state){
      //return state.measurments.map(o => ({value: o.value, date: o.date}))
      return state.measurments.filter(element => element.type === 'Spodný tlak' && (this.filterOff || ((new Date(element.date).getTime() > this.dateFilter.from.getTime()) && (new Date(element.date).getTime() < this.dateFilter.to.getTime()))))
    },
    
  },

  actions: {
    async addMeasurment(measurment : Measurment){
      if(measurment.method_id)
        measurment.method_id = measurment.method_id.split(' ')[0]
      console.log(measurment.method_id)

      await api.post('measurments/add', measurment)
      this.refreshMeasurments()
    },
    async deleteMeasurments(measurmentIDs : number[]){
      await api.post('measurments/delete',measurmentIDs)
      this.refreshMeasurments()
    },
    async refreshMeasurments(){
      const response = await api.get<Measurment[]>('measurments/get')
      response.data.forEach(row => {
        row.date = row.date.split('T')[0]
      })
      this.measurments = response.data
    },
    setFilter(filter : {from : string,to : string}, methodFilter : string){
      this.filterOff = false
      this.dateFilter.from = new Date(filter.from)
      this.dateFilter.to = new Date(filter.to)
      console.log(methodFilter)
      this.methodFilter = methodFilter.split(' ')[1]

    },
    turnOffFilter(){
      this.filterOff = true
    }
  }
});
