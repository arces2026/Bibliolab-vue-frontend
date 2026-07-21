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
// const libro = ref({})

const autori = ref([])
const categ = ref([])

const libro = reactive({
  titolo: '',
  autore_oggetto: null,
  isbn: '',
  anno_pubblicazione: null,
  categorie: [],
  disponibile: true,
  descrizione: '',
  cover_url: '',
})

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

  // Fetch book data if editing
  if (props.isEdit && props.idLibro) {
    try {
      let result = await libriComp.getLibro(`/api/v1/libri/${props.idLibro}`)

      const autore = `${result.autore_oggetto.nome} ${result.autore_oggetto.cognome}`
      console.log({ autore: autore })
      // Populate form with existing data
      libro.titolo = result.titolo || ''
      libro.autore = result.autore || ''
      libro.isbn = result.isbn || ''
      libro.anno_pubblicazione = result.anno_pubblicazione || null
      libro.categorie = result.categorie[0] || []
      libro.disponibile = result.disponibile !== undefined ? result.disponibile : true
      libro.descrizione = result.descrizione || ''
      libro.cover_url = result.cover_url || ''
      console.log({ libro: libro.value })
    } catch (err) {
      console.log('Error:', err.message)
    }
  }
})

const props = defineProps({
  idLibro: {
    type: [Number, String],
    default: null,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
})

const formValido = computed(() => libro.titolo.trim() !== '')

// const nomeCompleto = computed(() => autori.value.map((a) => a.nome + ' ' + a.cognome))

const salva = async () => {
  console.log({ isAuthenticated: authStore.isAuthenticated, utente: authStore.utente })

  try {
    let result

    if (props.isEdit && props.idLibro) {
      // Update existing book
      result = await libriComp.updateLibro(`/api/v1/libri/${props.idLibro}/`, libro)

      console.log({ result: result })
      emit('updated', result)
      success.value = `Libro "${libro.titolo}" aggiornato correttamente`
    } else {
      // Create new book
      result = await libriComp.newLibro(`/api/v1/libri/`, libro)
      emit('saved', result)
      success.value = `Libro "${libro.titolo}" salvato correttamente`

      // Reset form for new book (optional)
      if (!props.isEdit) {
        Object.assign(libro, {
          titolo: '',
          autore: '',
          isbn: '',
          anno_pubblicazione: null,
          categorie: [],
          disponibile: true,
          descrizione: '',
          cover_url: '',
        })
      }
    }
  } catch (err) {
    console.log('Caught err', err.message)
    error.value = `Errore nel salvataggio del libro: ${err.message}`
  }
}

const emit = defineEmits(['saved', 'updated'])
</script>

<template>
  <h2>{{ isEdit ? 'Modifica libro' : 'Inserisci nuovo libro' }}</h2>

  <form @submit.prevent="salva" class="form">
    <LoadingSpinner v-if="loading" />

    <input type="text" v-model="libro.titolo" placeholder="titolo" required />

    <select v-model="libro.autore">
      <option disabled value="">Scegli autore...</option>
      <option v-for="autore in autori" :key="autore.id" :value="autore.id">
        {{ autore.cognome }} {{ autore.nome }}
      </option>
    </select>

    <input type="text" v-model="libro.isbn" placeholder="isbn" />
    <input type="number" v-model="libro.anno_pubblicazione" placeholder="anno" />

    <select v-model="libro.categorie">
      <option disabled value="">Seleziona categoria</option>
      <option v-for="categoria in categ" :key="categoria.id" :value="categoria">
        {{ categoria.nome }}
      </option>
    </select>

    <label for="disponibile">Disponibile</label>
    <input type="checkbox" v-model="libro.disponibile" id="disponibile" />

    <input type="url" v-model="libro.cover_url" placeholder="Inserisci URL cover..." />
    <textarea name="" id="" v-model="libro.descrizione"></textarea>
    <button :disabled="!formValido || loading">{{ isEdit ? 'Aggiorna' : 'Salva' }}</button>
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
