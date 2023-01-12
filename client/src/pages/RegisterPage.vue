<template>
  <h1 class="text-center">Register</h1>
  <div class="column justify-center q-gutter-md q-my-xl">
    <q-input
      outlined
      v-model="credentials.email"
      class="col-12"
      label="Email"
      type="email"
    />
    <q-input
      outlined
      v-model="credentials.username"
      class="col-12"
      label="Username"
    />
    <div class="row justify-between content-between">
      <q-input
        outlined
        v-model="credentials.age"
        class="col-sm q-mr-md"
        label="Age"
        type="number"
      />
      <q-input
        outlined
        v-model="credentials.height"
        class="col-sm "
        label="Height"
        type="number"
      />
    </div>
    <q-input
      outlined
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
    <q-input
      outlined
      v-model="credentials.passwordConfirmation"
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
  </div>
  <div class="column wrap content-center" style="margin:15px 35px">
    <q-btn
      class="shadow-4 q-px-xl"
      color="primary"
      text-color="white"
      no-caps
      label="Register"
      @click="onSubmit"
      style="font-size:20px;"
    />
    <q-btn
      :to="{ name: 'login' }"
      flat
      no-caps
      :ripple="false"
      color="light-blue-10"
      label="Back"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { RouteLocationRaw } from 'vue-router'
import { useAuthStore } from 'stores/auth-store'
import { mapActions } from 'pinia'


export default defineComponent({
  name: 'RegisterPage',
  data () {
    return {
      credentials: { email: '', password: '', passwordConfirmation: '', username: '', age: 0, height: 0},
      isPwd: true
    }
  },
  computed: {
    redirectTo (): RouteLocationRaw {
      return { name: 'login' }
    }
  },
  methods: {
    ...mapActions(useAuthStore, ['register']),
    onSubmit () {
      this.register(this.credentials).then(() => {
        this.$router.push(this.redirectTo)
      }).catch(console.log)
    }
  },
});
</script>
