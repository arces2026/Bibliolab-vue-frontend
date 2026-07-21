<script setup>
import {reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = reactive({username:'', password: ''})
const error = ref('')
const loading = ref(false)

const onLogin = async() => {
  error.value = ''
  loading.value = true
  try {
    await authStore.login(form.username, form.password)
    // Dopo il login, torna dove l'utente voleva andare
    const redirect = route.query.redirect || '/libri'
    router.push(redirect)
  }catch(err){
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <LoadingSpinner v-if="loading"/>
  <div class="login-container">
    <div class="login-card">
      <form @submit.prevent="onLogin">
        <input type="text" v-model="form.username" placeholder="username">
        <input type="password" v-model="form.password" placeholder="password">
      <button>Login</button>
      </form>
    </div>
  </div>
</template>
