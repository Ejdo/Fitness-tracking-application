<template>
  <h1 class="text-center">Log in</h1>
  <div class="column justify-center q-gutter-md q-my-xl">
    <q-input
      outlined
      autofocus
      id="email"
      v-model="credentials.email"
      class="col-12"
      label="Email"
    />
    <q-input
      outlined
      id="email"
      v-model="credentials.password"
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
    <q-checkbox
      id="rememberMe"
      v-model="credentials.remember"
      label="Remember me"
    />
  </div>
  <div class="column wrap content-center" style="margin:15px 35px">
    <q-btn
      class="shadow-4 q-px-xl"
      color="primary"
      text-color="white"
      no-caps
      label="Log in"
      @click="onSubmit"
      style="font-size:20px;"
    />
    <q-btn
      :to="{ name: 'register' }"
      flat
      no-caps
      :ripple="true"
      color="light-blue-10"
      label="Register"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { RouteLocationRaw } from 'vue-router'
import { useAuthStore } from 'stores/auth-store'
import { mapActions } from 'pinia'


export default defineComponent({
  name: 'LoginPage',
  data () {
    return {
      credentials: {
        email: '',
        password: '',
        remember: false
      },
      isPwd: true
    }
  },
  computed: {
    redirectTo (): RouteLocationRaw {
      return (this.$route.query.redirect as string) || { name: 'profile' }
    }
  },
  methods: {
    ...mapActions(useAuthStore, ['login']),
    onSubmit () {
      this.login(this.credentials).then(() => {
        this.$router.push(this.redirectTo)
      }).catch(console.log)
    },

    onRedirect () {
      this.$router.push({ name: 'profile' })
    }
  }
})
</script>
