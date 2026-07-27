<script setup>
import { computed, reactive, ref, onMounted } from 'vue'
import { useLibri } from '@/composable/useLibri'
import { useApi } from '@/composable/useApi.js'
import LoadingSpinner from './LoadingSpinner.vue'
import { useRoute } from 'vue-router'

// const { createItem } = useApi()
const { getLibro, updateLibro } = useLibri()
const { getItems } = useApi()
const error = ref(null)
const success = ref(null)
const route = useRoute()
const loading = ref(false)

const autori = ref([])
const categ = ref([])

const props = defineProps({
  idLibro: {
    type: [Number, String],
    default: null,
  },
  idAutore: {
    type: [Number, String],
    default: null,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
})

// Value are given to this reactive const if we are modifying a libro
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

const autore = reactive({
  nome: '',
  cognome: '',
  data_nascita: null,
  biografia: '',
})

onMounted(async () => {
  try {
    const [autoriData, categData] = await Promise.all([
      getItems('/api/v1/autori/'),
      getItems('/api/v1/categorie/'),
    ])
    autori.value = autoriData
    categ.value = categData
  } catch (err) {
    console.error('Errore nel recupero dei dati', err.message)
    error.value = 'Errore nel recupero dei dati'
  }

  // Fetch book data if editing

  try {
    if (props.isEdit && props.idLibro) {
      let result = await getLibro(`/api/v1/libri/${props.idLibro}`)

      // Populate form with existing data for Libro
      libro.titolo = result.titolo || ''
      libro.autore = result.autore || '' // it returns autore.id that in the select matches the full autore name
      libro.isbn = result.isbn || ''
      libro.anno_pubblicazione = result.anno_pubblicazione || null
      libro.categorie = result.categorie[0] || []
      libro.disponibile = result.disponibile !== undefined ? result.disponibile : true
      libro.descrizione = result.descrizione || ''
      libro.cover_url = result.cover_url || ''
    } else if (props.isEdit && props.idAutore) {
      let result = await getItems(`/api/v1/autori/${props.idAutore}`)
      console.log({ resultAutore: result })
      // Populate form with autore data
      autore.nome = result.nome || ''
      autore.cognome = result.cognome || ''
      autore.data_nascita = result.data_nascita || ''
      autore.biografia = result.biografia || ''
    }
  } catch (err) {
    console.error(`HTTP: ${err.message}`)
  }
})

const formLibroValido = computed(() => libro.titolo.trim() !== '')
const formAutoreValido = computed(() => autore.cognome.trim() !== '')

// const nomeCompleto = computed(() => autori.value.map((a) => a.nome + ' ' + a.cognome))

const salva = async () => {
  try {
    // let data

    // // const url = props.idLibro
    // const url =
    //   route.path === `/inserisci-libro/${props.idLibro}`
    //     ? `/api/v1/libri/${props.idLibro}`
    //     : `/api/v1/autori/${props.idAutore}`

    // const payload = route.path === `/inserisci-libro/${props.idLibro}` ? libro : autore

    if (props.isEdit) {
      // Update existing book or author
      if (route.path === `/modifica-libro/${props.idLibro}`) {
        // data = await updateLibro(url, payload)
        emit('patchLibro', libro)
      } else {
        emit('patchAutore', autore)
      }
    } else {
      if (route.path === '/inserisci-libro') {
        emit('creaLibro', libro)
      } else {
        emit('creaAutore', autore)
      }
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
    error.value = `Errore nel salvataggio del libro`
  }
}

const emit = defineEmits(['creaLibro', 'creaAutore', 'patchLibro', 'patchAutore'])
</script>

<template>
  <div>
    <form
      v-if="route.path === '/inserisci-libro' || route.path === `/modifica-libro/${idLibro}`"
      @submit.prevent="salva"
      class="form"
    >
      <LoadingSpinner v-if="loading" />
      <label for="titolo">Titolo</label>
      <input id="titolo" type="text" v-model="libro.titolo" placeholder="titolo" required />

      <label for="autore">Seleziona l'autore</label>
      <select id="autore" v-model="libro.autore">
        <option disabled value="">Scegli autore...</option>
        <option v-for="autore in autori" :key="autore.id" :value="autore.id">
          {{ autore.cognome }} {{ autore.nome }}
        </option>
      </select>

      <label for="isbn">ISBN</label>
      <input id="isbn" type="text" v-model="libro.isbn" placeholder="isbn" />

      <label for="data">Anno di pubblicazione</label>
      <input id="data" type="number" v-model="libro.anno_pubblicazione" placeholder="anno" />

      <label for="categoria">Seleziona il genere</label>
      <select id="categoria" v-model="libro.categorie">
        <option disabled value="">Seleziona categoria</option>
        <option v-for="categoria in categ" :key="categoria.id" :value="categoria">
          {{ categoria.nome }}
        </option>
      </select>

      <label for="disponibile">Disponibile</label>
      <input type="checkbox" v-model="libro.disponibile" id="disponibile" />

      <label for="url">URL cover</label>
      <input id="url" type="url" v-model="libro.cover_url" placeholder="Inserisci URL cover..." />

      <label for="descrizione">Descrizione</label>
      <textarea
        id="descrizione"
        v-model="libro.descrizione"
        placeholder="Il libro narra di..."
      ></textarea>
      <button :disabled="!formLibroValido || loading">{{ isEdit ? 'Aggiorna' : 'Salva' }}</button>
      <p v-if="success" class="para success">{{ success }}</p>
      <p v-else class="para error">{{ error }}</p>
    </form>

    <form v-else @submit.prevent="salva" class="form">
      <label for="nome">Nome</label>
      <input
        v-model="autore.nome"
        type="text"
        id="nome"
        autocomplete="name"
        placeholder="nome..."
      />
      <label for="cognome">Cognome</label>
      <input
        v-model="autore.cognome"
        type="text"
        id="cognome"
        autocomplete="family-name"
        placeholder="nome..."
      />
      <label for="data-nascita">Data di nascita</label>
      <input
        v-model="autore.data_nascita"
        type="date"
        id="data-nascita"
        autocomplete="bday-day"
        placeholder="data di nascita..."
      />
      <label for="biografia">Biografia</label>
      <textarea
        v-model="autore.biografia"
        type="text"
        id="biografia"
        autocomplete="name"
        placeholder="biografia..."
      ></textarea>
      <button :disabled="!formAutoreValido || loading">{{ isEdit ? 'Aggiorna' : 'Salva' }}</button>
    </form>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
  /* border: 1px solid; */
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

label {
  margin-bottom: -10px;
  margin-right: auto;
  color: white;
}

input,
select,
textarea {
  width: 100%;
  padding: 8px;
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
