<template>
  <div class="q-pa-xl">
    <q-table
      title="Measurments"
      :rows="measurments"
      :columns="columns"
      row-key="id"
      virtual-scroll
      style="max-height: 400px"
      class="my-sticky-virtscroll-table"
      selection="multiple"
      v-model:selected="selected"
    >
    <template v-slot:no-data>
      <q-btn color="primary" label="Add measurment" @click="createMeasurment" class="q-my-md q-mr-md"/>
      <q-btn color="primary" icon-right="file_upload" label="Import csv" @click="(uploadCard = true)" no-caps/>
    </template>
    <template v-slot:bottom>
      <q-btn color="primary" label="Add measurment" @click="createMeasurment" class="q-my-md q-mr-md"/>
      <q-btn color="primary" label="Delete measurments" @click="deleteMeasurments()" class="q-my-md q-mr-md"/>
      <q-btn color="primary" icon-right="file_download" label="Export to csv" @click="exportTable()" no-caps class="q-my-md q-mr-md"/>
      <q-btn color="primary" icon-right="file_upload" label="Import csv" @click="(uploadCard = true)" no-caps/>
    </template>
    </q-table>
    <q-dialog v-model="card">
      <q-card class="my-card">
        <q-card-section>
          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">
              Add Measurment
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row content-center">
            <q-select
            outlined
            v-model="measurment.type"
            :options="measurmentTypes"
            class="q-pr-sm col"
            label="Type"
          />
          <q-input
            outlined
            v-model="measurment.value"
            type="number"
            class="col"
            label="Value"
          />
          </div>
        </q-card-section>
        <q-card-section class="row justify-center">
          <q-date
            v-model="measurment.date"
            minimal
          />
        </q-card-section>
        <q-card-section>
          <q-select
            outlined
            v-model="measurment.method_id"
            :options="methodsStore.getMethods.map(a => a.id + ' ' + a.name)"
            class="row-12"
            label="Method"
          />
        </q-card-section>
        <q-separator />

        <q-card-actions align="right">
          <q-btn v-close-popup flat color="primary" label="Add" @click="measurmentsStore.addMeasurment(this.measurment)"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="uploadCard">
      <q-card class="my-card">
        <q-card-section>
          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">
              Upload CSV
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <q-uploader
            style="max-width: 300px"
            url="http://localhost:8080/measurments/import"
            :headers="[{name: 'Authorization', value: authToken}]"
            label="Select a CSV file"
            multiple
            auto-upload
            accept=".csv"
            max-files="1"
            @uploaded="measurmentsStore.refreshMeasurments()"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { exportFile } from 'quasar'
import { useMeasurmentsStore } from 'stores/measurments-store'
import { useMethodsStore } from 'stores/methods-store'
import { authManager } from 'src/services'


const columns = [
  { name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true },
  { name: 'type', align: 'left', label: 'Type', field: 'type', sortable: true },
  { name: 'date', align: 'left', label: 'Date', field: 'date', sortable: true },
  { name: 'value', align:'left', label: 'Value', field: 'value', sortable: true },
  { name: 'method_id', align:'left',label: 'Method ID', field: 'method_id' },
  { name: 'method_name', align:'left',label: 'Method Name', field: 'method_name' },
]

const measurmentTypes = ['Váha','Spodný tlak','Horný tlak']

function wrapCsvValue (val, formatFn, row) {
  let formatted = formatFn !== void 0
    ? formatFn(val, row)
    : val

  formatted = formatted === void 0 || formatted === null
    ? ''
    : String(formatted)

  formatted = formatted.split('"').join('""')
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`
}

export default {
  data () {
    return {
      measurment : {
        type : '',
        date : '2022/12/06',
        value : 0,
        method_id : null
      }
    }
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
    const card = ref(false)
    const uploadCard = ref(false)
    const measurmentsStore = useMeasurmentsStore()
    const methodsStore = useMethodsStore()
    const selected = ref([])
    const measurments = computed(() => measurmentsStore.getMeasurments)
    return {
      measurmentsStore,
      methodsStore,
      measurments,
      columns,
      measurmentTypes,
      card,
      uploadCard,
      selected,
      method : ref(''),
      currentURL : '',
      createMeasurment () {
        methodsStore.refreshMethods()
        card.value = true
      },
      deleteMeasurments () {
        var deleteIDs = selected.value.map(a => a.id)
        this.measurmentsStore.deleteMeasurments(deleteIDs)
      },
      exportTable () {
        const content = [columns.map(col => wrapCsvValue(col.name))].concat(
          this.measurments.map(row => columns.map(col => wrapCsvValue(
            typeof col.field === 'function'
              ? col.field(row)
              : row[ col.field === void 0 ? col.name : col.field ],
            col.format,
            row
          )).join(','))
        ).join('\r\n')

        const status = exportFile(
          'table-export.csv',
          content,
          'text/csv'
        )
        console.log(status)
      }
    }
  },
  mounted () {
    this.measurmentsStore.refreshMeasurments()
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