<template>
  <q-layout view="lHh LpR fFf">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          Fitness Tracker
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <q-list bordered padding class="rounded-borders text-primary q-pt-xl">
      <q-separator/>

      <q-item
        clickable
        v-ripple
        :active="link === 'profile'"
        active-class="my-menu-link"
        :to="{ name: 'profile' }"
      >
        <q-item-section avatar>
          <q-icon name="person" />
        </q-item-section>

        <q-item-section>Profile</q-item-section>
      </q-item>

      <q-item
        clickable
        v-ripple
        :active="link === 'measurments'"
        active-class="my-menu-link"
        :to="{ name: 'measurments' }"
      >
        <q-item-section avatar>
          <q-icon name="straighten" />
        </q-item-section>

        <q-item-section>Measurments</q-item-section>
      </q-item>

      <q-item
        clickable
        v-ripple
        :active="link === 'methods'"
        @click="methodsClicked"
        active-class="my-menu-link"
        :to="{ name: 'methods' }"
      >
        <q-item-section avatar>
          <q-icon name="fitness_center" />
        </q-item-section>

        <q-item-section>Training Methods</q-item-section>
      </q-item>
      <q-separator/>
      <q-item
        v-if="isAdmin"
        clickable
        v-ripple
        :active="link === 'admin'"
        @click="methodsClicked"
        active-class="my-menu-link"
        :to="{ name: 'admin' }"
      >
        <q-item-section avatar>
          <q-icon name="admin_panel_settings" />
        </q-item-section>

        <q-item-section>Admin menu</q-item-section>
      </q-item>
      <q-separator/>
      <q-item
        clickable
        v-ripple
        @click="authStore.logout()"
        :to="{ name: 'login'}"
      >
        <q-item-section avatar>
          <q-icon name="logout" />
        </q-item-section>

        <q-item-section>Logout</q-item-section>
      </q-item>
    </q-list>
    </q-drawer>

    <q-page-container>

      <q-dialog v-model="ad">
      <q-card class="my-card">
        <q-card-section>
          <div class="row no-wrap items-center">
            <div class="col text-h6 ellipsis">
              Advertisement
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <q-img :src=advertisement.image_url @click="adclicked"/>
        </q-card-section>
      </q-card>
    </q-dialog>

      <router-view />

    </q-page-container>

  </q-layout>
</template>

<script>
import { ref,computed } from 'vue'
import { useMethodsStore } from 'stores/methods-store'
import { useAuthStore } from 'stores/auth-store'
import { useAdminStore } from 'stores/admin-users-store'
import { useRoute } from 'vue-router';
import { openURL } from 'quasar'

export default {
  setup () {
    const leftDrawerOpen = ref(false)
    const ad = ref(false)
    const methodsStore = useMethodsStore()
    const authStore = useAuthStore()
    const adminStore = useAdminStore()
    const currentRoute = computed(() => {
      return useRoute().name
    })
  const advertisement = {
    id : 0,
    image_url : 'https://cdn.quasar.dev/img/parallax2.jpg',
    target_url : 'https://quasar.dev/'
  }
    return {
      leftDrawerOpen,
      link : currentRoute,
      authStore,
      adminStore,
      ad,
      advertisement,
      image_url : 'https://cdn.quasar.dev/img/parallax2.jpg',
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      methodsClicked () {
        methodsStore.refreshMethods()
      },
      showAd () {
        const adver = adminStore.getRandomAd
        if(adver){
          advertisement.id = adver.id
          advertisement.image_url = adver.image_url
          advertisement.target_url = adver.target_url
          ad.value = true
        }
      },
      adclicked () {
        openURL(advertisement.target_url)
      }
    }
  },
  computed: {
    isAdmin (){
      return this.authStore.isAdmin
    }
  },
  mounted () {
    this.adminStore.refreshAds()
    setInterval(this.showAd,60000)
  }
}
</script>
<style lang="sass">
.my-menu-link
  color: white
  background: $primary
</style>