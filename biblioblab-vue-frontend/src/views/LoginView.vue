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
    const redirect = route.query.redirect || '/ricerca'
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
        <label for="username">Username</label>
        <input id='username' autocomplete="username" type="text" v-model="form.username" placeholder="username">
        <label for="password">Password</label>
        <input id="password" autocomplete="current-password" type="password" v-model="form.password" placeholder="password">
      <button>Login</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  /* border: 1px solid; */
}

.login-card {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  width: 100vw;
}

form {
  display: flex;
  flex-direction: column;
  width: 40%;
  max-width: 400px;
  margin: 20px auto;
  gap: 40px;
}

label {
  margin-bottom: -40px;
  font-size: 1.3rem;
  color: white;
  text-shadow: 3px 3px 6px black;
}

input {
  padding: 10px;
  border-radius: 5px;
  font-size: 1.3rem;
}

button {
  padding: 15px;
  margin: 30px auto;
  width: 200px;
  border-radius: 8px;
  background-color: rgb(225, 225, 236);
  font-size: 1.5rem;
  color: rgb(89, 89, 201);
  box-shadow: 3px 3px 6px black;
  cursor: pointer;
  transition: all 0.3s ease;
}
</style>
