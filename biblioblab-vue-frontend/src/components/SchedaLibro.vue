<script setup>
import { computed, reactive, ref, onMounted } from 'vue'
import { useLibri } from '@/composable/useLibri'
import LoadingSpinner from './LoadingSpinner.vue'
import { useAuthStore } from '@/stores/authStore.js'

const libriComp = useLibri()
const success = ref('')
const error = ref('')
const loading = ref(false)
const authStore = useAuthStore()

const autori = ref([])
const categ = ref([])

onMounted(async () => {
  try {
    autori.value = await libriComp.getAutori('/api/v1/autori/') //django api view da creare
    console.log({ autori: autori.value })
  } catch (err) {
    console.error('Errore nel recupero degli autori', err.message)
  }

  try {
    categ.value = await libriComp.getCategorie('/api/v1/categorie/')
  } catch (err) {
    console.error('Errore nel recupero delle categorie', err.message)
  }
})

const libro = reactive({
  titolo: '',
  autore: '',
  isbn: '',
  anno_pubblicazione: null,
  categorie: [],
  disponibile: true,
  descrizione: '',
  cover_url: '',
})

const formValido = computed(() => libro.titolo.trim() !== '')

// const nomeCompleto = computed(() => autori.value.map((a) => a.nome + ' ' + a.cognome))

const salva = async () => {
  console.log({isAuthenticated: authStore.isAuthenticated, utente: authStore.utente})

  try {
    const result = await libriComp.newLibro(`/api/v1/libri/`, libro) //using vite proxy server (vite.config.js)

    console.log('Success', result)
    success.value = `Libro ${libro.titolo} salvato correttamente`
  } catch (err) {
    console.log('Caught err', err.message)
    error.value = `Errore nel salvataggio del libro: ${err.message}`
  }
}
</script>

<template>
  <h2>Scheda libro</h2>
  <form @submit.prevent="salva" class="form">
    <input type="text" v-model="libro.titolo" placeholder="titolo" required />
    <select v-model="libro.autore">
      <option disabled value="">Scegli autore...</option>
      <option v-for="autore in autori" :key="autore.id" :value="autore.id">{{ autore.cognome }} {{autore.nome}}</option>
    </select>
    <input type="text" v-model="libro.isbn" placeholder="isbn" />
    <input type="number" v-model="libro.anno_pubblicazione" placeholder="anno" />
    <select v-model="libro.categorie">
      <option disabled value="">Seleziona categoria</option>
      <option v-for="categoria in categ" :key="categoria.id" :value="categoria">
        {{ categoria.nome }}
      </option>
    </select>
    <LoadingSpinner v-if="loading" />
    <label for="disponibile">Disponibile</label>
    <input type="checkbox" v-model="libro.disponibile" id="disponibile" />
    <input type="url" v-model="libro.cover_url" placeholder="Inserisci URL cover..." />
    <textarea name="" id="" v-model="libro.descrizione"></textarea>
    <button :disabled="!formValido">Salva</button>
    <p v-if="success">{{ success }}</p>
    <p v-else>{{ error }}</p>
  </form>
</template>

<style scoped>
* {
  box-sizing: border-box;
}
h2 {
  text-align: center;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 400px;
  align-items: center;
  justify-content: center;
  margin: 10px auto;
}
input,
select,
textarea {
  width: 100%;
  padding: 4px;
  border-radius: 4px;
}
input[type='checkbox'],
select {
  cursor: pointer;
}
textarea {
  height: 150px;
}
button {
  padding: 15px 30px;
  border-radius: 4px;
  background-color: green;
  color: white;
  cursor: pointer;
  transition: scale 0.3s ease-in-out;
}
button:hover {
  scale: 1.05;
  background-color: rgb(33, 180, 33);
}
button:disabled {
  background-color: gray;
  scale: 0.95;
  cursor: not-allowed;
}
</style>
