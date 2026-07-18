<script setup>
import { useAuthStore } from '@/stores/authStore';
import { ref } from 'vue';

const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const password2 = ref('')

const onSubmit = async() => {
  //Create userData object from fields
  const userData = {
  username: username.value,
  password: password.value,
  password2: password2.value
  }
   // Log the data being submitted
  console.log('📤 Submitting form data:', userData) // or whatever your form data variable is

  // Frontend validation
  if (password.value !== password2.value){
    authStore.error = 'Le passwords non coincidono'
    return
  }

  await authStore.register(userData)
}
 </script>

<template>
  <h2>Form registrazione</h2>
  <form @submit.prevent="onSubmit">
    <label for="username">Username</label>
    <input type="text" id="username" v-model="username">
    <label for="password1">Password</label>
    <input type="password" id="password1" v-model="password">
    <label for="password2">Retype password</label>
    <input type="password" id="password2" v-model="password2">
    <button :disabled="authStore.loading">{{ authStore.loading? 'Registrazione...' : 'Registrati'}}</button>
    <p v-if="authStore.success" class="success">{{ authStore.success }}</p>
    <p v-if="authStore.error" class="error">{{ authStore.error }}</p>
  </form>
</template>

<style scoped>
.success {
  color: green;
}

.error {
  color: red;
}
</style>
