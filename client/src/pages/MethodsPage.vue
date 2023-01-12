<template>
  <div class="q-pa-xl">
    <q-table
      title="Training Methods"
      :rows="methods"
      :columns="columns"
      row-key="id"
      virtual-scroll
      style="max-height: 400px"
      class="my-sticky-virtscroll-table"
      selection="multiple"
      v-model:selected="selected"
    >
    <template v-slot:bottom>
      <div class="q-my-md">      
        <q-btn color="primary" label="Add method" @click="card = true" class="q-mr-md"/>
        <q-btn color="primary" label="Delete method" @click="deleteMethod()"/>

      </div>
    </template>
    <template v-slot:no-data>
      <div class="q-gutter-md q-my-md">      
        <q-btn color="primary" label="Add method" @click="card = true" class="q-mr-md"/>
      </div>
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
        <q-card-section class="q-pt-none column justify-center ">
          <div class="row justify-between content-between q-gutter-md">
          <q-input
            outlined
            v-model="method.name"
            class="col-sm"
            label="Name"
          />
          <q-input
            outlined
            v-model="method.description"
            class="col-sm"
            label="Description"
          />
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn v-close-popup flat color="primary" label="Add" @click="methodsStore.addMethod(method)"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { useMethodsStore } from 'stores/methods-store'
import { ref } from 'vue'
const columns = [
  {
    name: 'id',
    label: 'ID',
    field: 'id',
    align: 'left',
    sortable: true
  },
  { name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true },
  { name: 'description', align:'left', label: 'Description', field: 'description' },
]

export default {
  data () {
    return {
      method : {
        name : '',
        description : ''
      }
    }
  },
  setup () {
    var card = ref(false)
    var selected = ref([])
    return {
      methodsStore : useMethodsStore(),
      columns,
      card,
      selected,
      deleteMethod(){
        var deleteIds = selected.value.map(a => a.id)
        this.methodsStore.deleteMethods(deleteIds)
      }
    }
  },
  computed: {
    methods (){
      return this.methodsStore.getMethods
    }
  },
  mounted () {
    this.methodsStore.refreshMethods()
  }
}
</script>
