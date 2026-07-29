<script setup>
import { useAuthStore } from '@/stores/authStore'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const username = ref('')
const password = ref('')
const password2 = ref('')
const nome = ref('')
const cognome = ref('')
const email = ref('')
// const avatar_url = ref('')

onMounted(() => {
  authStore.success = null
  authStore.error = null
})

const onSubmit = async () => {
  // Frontend validation
  if (password.value !== password2.value) {
    authStore.error = 'Le passwords non coincidono'
    return
  }

  //Create userData object from fields
  const userData = {
    username: username.value,
    password: password.value,
    password2: password2.value,
    nome: nome.value,
    cognome: cognome.value,
    email: email.value,
    // To get the same avatar for the same username from testingBot
    // The 'u' parameter is what testingBot uses for unique identifier
    avatar_url: `https://testingbot.com/free-online-tools/random-avatar/200?u=${username.value}`
    // avatar_url: avatar_url.value,
  }
  // Log the data being submitted
  console.log('📤 Submitting form data:', userData) // or whatever your form data variable is

  await authStore.register(userData)
  if (authStore.success) {
    // Save the avatar 
    localStorage.setItem('avatar_url', userData.avatar_url) 
    router.push('/ricerca')
  }
}
</script>

<template>
  <h2>Form registrazione</h2>
  <form @submit.prevent="onSubmit">
    <label for="nome">Nome</label>
    <input autocomplete="given-name" placeholder="es. Mario" type="text" id="nome" v-model="nome" />
    <label for="cognome">Cognome</label>
    <input
      autocomplete="family-name"
      placeholder="es. Rossi"
      type="text"
      id="cognome"
      v-model="cognome"
    />
    <label for="email">Email</label>
    <input
      autocomplete="email"
      placeholder="es. mario@example.com"
      type="email"
      id="email"
      v-model="email"
    />
    <!-- <label for="avatar">Avatar url</label>
    <input type="text" id="avatar" placeholder="avatar url..." v-model="avatar_url"> -->
    <label for="username">Username</label>
    <input
      autocomplete="username"
      placeholder="es. mario-rossi"
      type="text"
      id="username"
      v-model="username"
    />
    <label for="password1">Password</label>
    <input
      autocomplete="new-password"
      placeholder="inserisci password..."
      type="password"
      id="password1"
      v-model="password"
    />
    <label for="password2">Conferma password</label>
    <p v-if="password && password2 && password !== password2" class="error">
      Le password non coincidono
    </p>
    <input
      autocomplete="new-password"
      placeholder="reinserisci la password..."
      type="password"
      id="password2"
      v-model="password2"
    />
    <button
      :disabled="
        authStore.loading || !password || !password2 || !username || password !== password2
      "
    >
      {{ authStore.loading ? 'Registrazione...' : 'Registrati' }}
    </button>
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

h2 {
  text-align: center;
  margin: 30px auto;
}

form {
  display: flex;
  flex-direction: column;
  max-width: 400px;
  gap: 20px;
  margin: auto;
}

input {
  padding: 5px;
  border-radius: 5px;
}

label {
  margin-bottom: -20px;
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

button:hover {
  scale: 1.05;
}

button:active {
  scale: 0.95;
}

button:disabled {
  cursor: not-allowed;
  scale: 0.95;
  box-shadow: none;
  color: gray;
}
</style>
