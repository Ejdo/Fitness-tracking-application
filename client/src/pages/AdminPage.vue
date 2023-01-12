<template>
  <div class="q-pa-xl">
    <q-table
      title="Users"
      :rows="users"
      :columns="columns"
      row-key="id"
      virtual-scroll
      style="max-height: 400px"
      class="my-sticky-virtscroll-table q-mb-lg"
      selection="multiple"
      v-model:selected="selected"
    >
    <template v-slot:bottom>
      <div class="q-my-md">      
        <q-btn color="primary" label="Add user" @click="card = true" class="q-mr-md"/>
        <q-btn color="primary" label="Delete user" @click="deleteUsers()" class="q-mr-md"/>
        <q-btn color="primary" icon-right="file_download" label="Export to csv" @click="exportTable()" no-caps class="q-mr-md"/>
        <q-btn color="primary" icon-right="file_upload" label="Import csv" @click="(uploadCard = true)" no-caps/>
      </div>
    </template>
    <template v-slot:no-data>
      <div class="q-gutter-md q-my-md">      
        <q-btn color="primary" label="Add user" @click="card = true" class="q-mr-md"/>
        <q-btn color="primary" icon-right="file_upload" label="Import csv" @click="(uploadCard = true)" no-caps/>
      </div>
    </template>
  </q-table>
  <q-table
      title="Advertisements"
      :rows="ads"
      :columns="adColumns"
      row-key="id"
      virtual-scroll
      style="max-height: 400px"
      class="my-sticky-virtscroll-table"
      selection="multiple"
      v-model:selected="selectedAds"
    >
    <template v-slot:bottom>
      <div class="q-my-md">      
        <q-btn color="primary" label="Add advertisement" @click="cardAd = true" class="q-mr-md"/>
        <q-btn color="primary" label="Delete advertisement" @click="deleteAds()" class="q-mr-md"/>
      </div>
    </template>
    <template v-slot:no-data>
      <div class="q-gutter-md q-my-md">      
        <q-btn color="primary" label="Add advertisement" @click="cardAd = true" class="q-mr-md"/>
      </div>
    </template>
  </q-table>
  <q-dialog v-model="card">
      <q-card class="my-card">
        <q-card-section>
          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">
              Add User
            </div>
          </div>
        </q-card-section>
        <q-card-section class="q-pt-none column justify-center ">
          <div class="column justify-center q-gutter-md">
    <q-input
      outlined
      v-model="user.email"
      class="col-12"
      label="Email"
      type="email"
    />
    <q-input
      outlined
      v-model="user.username"
      class="col-12"
      label="Username"
    />
    <div class="row justify-between content-between">
      <q-input
        outlined
        v-model="user.age"
        class="col-sm q-mr-md"
        label="Age"
        type="number"
      />
      <q-input
        outlined
        v-model="user.height"
        class="col-sm "
        label="Height"
        type="number"
      />
    </div>
    <q-input
      outlined
      v-model="user.password"
      class="col-12"
      :type="isPwd ? 'password' : 'text'"
      label="Password"
    >
      <template v-slot:append>
        <q-icon
          :name="isPwd ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="isPwd = !isPwd"
        />
      </template>
    </q-input>
    <q-input
      outlined
      v-model="user.passwordConfirmation"
      class="col-12"
      :type="isPwd ? 'password' : 'text'"
      label="Repeat password"
    >
      <template v-slot:append>
        <q-icon
          :name="isPwd ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="isPwd = !isPwd"
        />
      </template>
    </q-input>
    <q-checkbox
          v-model="user.admin"
          label="Is admin"
        />
  </div>
        </q-card-section>
        <q-separator />

        <q-card-actions align="right">
          <q-btn v-close-popup flat color="primary" label="Add" @click="adminStore.addUser(user)"/>
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
            url="http://localhost:8080/admin/importUsers"
            :headers="[{name: 'Authorization', value: authToken}]"
            label="Select a CSV file"
            multiple
            auto-upload
            accept=".csv"
            max-files="1"
            @uploaded="adminStore.refreshUsers()"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="cardAd">
      <q-card class="my-card">
        <q-card-section>
          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">
              Add advertisement
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row justify-between content-between q-gutter-md">
          <q-input
            outlined
            v-model="advertisement.image_url"
            class="col-sm"
            label="Image URL"
          />
          <q-input
            outlined
            v-model="advertisement.target_url"
            class="col-sm"
            label="Target URL"
          />
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn v-close-popup flat color="primary" label="Add" @click="adminStore.addAd(advertisement)"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { useAdminStore } from 'stores/admin-users-store'
import { ref, computed } from 'vue'
import { exportFile } from 'quasar'
import { authManager } from 'src/services'

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true},
  { name: 'admin', label: 'Admin', field: 'admin', align: 'left', sortable: true},
  { name: 'name', align: 'left', label: 'Name', field: 'name', sortable: true },
  { name: 'email', align:'left', label: 'Email', field: 'email' },
  { name: 'password', align:'left', label: 'Password', field: 'password' },
  { name: 'age', align:'left', label: 'Age', field: 'age', sortable: true },
  { name: 'height', align:'left', label: 'Height', field: 'height', sortable: true }
]

const adColumns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true},
  { name: 'image_url', label: 'Image url', field: 'image_url', align: 'left'},
  { name: 'target_url', align: 'left', label: 'Target url', field: 'target_url'},
  { name: 'clickcount', align:'left', label: 'Click count', field: 'clickcount' },
]

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
      user: { email: '',admin: false, password: '', passwordConfirmation: '', username: '', age: 0, height: 0},
    }
  },
  setup () {
    var card = ref(false)
    var cardAd = ref(false)
    const uploadCard = ref(false)
    const isPwd = ref(true)
    var selected = ref([])
    var selectedAds = ref([])
    const adminStore = useAdminStore()
    const users = computed(() => adminStore.getUsers)
    const ads = computed(() => adminStore.getAds)
    const authToken = computed(() => authManager.getToken())
    const advertisement = {
      image_url : '',
      target_url : ''
    }
    return {
      adminStore,
      ads,
      columns,
      card,
      cardAd,
      selected,
      selectedAds,
      users,
      uploadCard,
      authToken,
      isPwd, 
      advertisement,
      deleteUsers(){
        var deleteIds = selected.value.map(a => a.id)
        this.adminStore.deleteUsers(deleteIds)
      },
      deleteAds(){
        var deleteIDs = selectedAds.value.map(a => a.id)
        this.adminStore.deleteAds(deleteIDs)
      },
      exportTable () {
        const content = [columns.map(col => wrapCsvValue(col.name))].concat(
          this.users.map(row => columns.map(col => wrapCsvValue(
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
    this.adminStore.refreshUsers()
    this.adminStore.refreshAds()
  }
}
</script>
