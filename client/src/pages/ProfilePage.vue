<template>
  <div class="q-pa-xl q-gutter-md column">
    <div class="row">
    <q-table
      title="Váha"
      :rows="vaha"
      :columns="columns"
      row-key="id"
      virtual-scroll
      style="max-height: 400px"
      class="my-sticky-virtscroll-table col-6 q-mr-md"
    >
    </q-table>
    <LineChart class="col-4" :chartData="vahaChartData"/>
  </div>
  <div class="row">
    <q-table
      title="Spodný tlak"
      :rows="stlak"
      :columns="columns"
      row-key="id"
      virtual-scroll
      style="max-height: 400px"
      class="my-sticky-virtscroll-table col-6 q-mr-md"
    >
    </q-table>
    <LineChart class="col-4" :chartData="stlakChartData"/>
  </div>
  <div class="row">
    <q-table
      title="Horný tlak"
      :rows="htlak"
      :columns="columns"
      row-key="id"
      virtual-scroll
      style="max-height: 400px"
      class="my-sticky-virtscroll-table col-6 q-mr-md"
    >
    </q-table>
    <LineChart class="col-4" :chartData="htlakChartData"/>
  </div>
    <div class="column content-center q-gutter-md">
      <q-date class="row" title="Date range" v-model="date" range />
      <q-select
            outlined
            v-model="method"
            :options="methodsStore.getMethods.map(a => a.id + ' ' + a.name)"
            class="row-12"
            label="Method"
      />
      <q-btn class="row-2" color="primary" text-color="white" label="Filter" @click="setFilter"/>
      <q-btn class="row-2" color="primary" text-color="white" label="Filter Off" @click="measurmentsStore.turnOffFilter"/>

  </div>
  </div>
</template>

<script>
import { ref,computed } from 'vue'
import { useMeasurmentsStore } from 'stores/measurments-store'
import { useMethodsStore } from 'stores/methods-store'
import { authManager } from 'src/services'
import 'chart.js/auto'
import LineChart from 'src/components/LineChart.vue'


const columns = [
  { name: 'date', align: 'left', label: 'Date', field: 'date', sortable: true },
  { name: 'value', align:'left', label: 'Value', field: 'value', sortable: true },
  { name: 'method', align:'left', label: 'Method', field: 'method_name', sortable: true }

]

export default {
  components:{
    LineChart
  },
  computed: {
    methodID () {
      return this.method.split(' ')[0]
    },
    authToken () {
      return authManager.getToken()
    }
  },
  setup () {
    const measurmentsStore = useMeasurmentsStore()
    const methodsStore = useMethodsStore()
    const vaha = computed(() => measurmentsStore.getVaha)
    const htlak = computed(() => measurmentsStore.getHTlak)
    const stlak = computed(() => measurmentsStore.getSTlak)
    const vahaChartData = computed(() => {return {labels:vaha.value.map(o => o.date), datasets:[{tension: 0.2,label:'Váha',data:vaha.value.map(o => o.value)}]}})
    const htlakChartData = computed(() => {return {labels:htlak.value.map(o => o.date), datasets:[{tension: 0.2,label:'Spodný tlak',data:htlak.value.map(o => o.value)}]}})
    const stlakChartData = computed(() => {return {labels:stlak.value.map(o => o.date), datasets:[{tension: 0.2,label:'Horný tlak',data:stlak.value.map(o => o.value)}]}})
    const date = ref({ from: '', to: '' })
    const method = ref('')
    return {
      measurmentsStore,
      methodsStore,
      vaha,
      htlak,
      stlak,
      columns,
      date,
      method,
      currentURL : '',
      vahaChartData,
      htlakChartData,
      stlakChartData,
      setFilter(){
        measurmentsStore.setFilter(date.value,method.value)
      }
    }
  },
  mounted () {
    this.measurmentsStore.refreshMeasurments()
    this.methodsStore.refreshMethods()
  }
}
</script>
<style lang="sass">
.my-sticky-virtscroll-table
  /* height or max-height is important */
  height: 410px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th /* bg color is important for th; just specify one */
    background-color: #fff

  thead tr th
    position: sticky
    z-index: 1
  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
  thead tr:first-child th
    top: 0
</style>