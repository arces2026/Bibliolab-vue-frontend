<script setup>
import { computed, reactive } from 'vue';

const libro = reactive({
  titolo: '',
  autore: '',
  isbn: '',
  anno: null,
  genere: 'narrativa',
  disponibile: true,
  descrizione: ''
})

const formValido = computed(() =>
  libro.titolo.trim() !== '' && libro.autore.trim() !== ''
)

const salva = () => {
  console.log('Libro salvato correttamente', libro)
  alert('Libro salvato correttamente')
  setTimeout(() => {
  for (const key in libro){
     libro[key] = ''
  }
  }, 4000)
}
</script>

<template>
  <h2>Scheda libro</h2>
  <form action="" @submit.prevent="salva" class="form">
    <input type="text" v-model="libro.titolo" placeholder="titolo" required>
    <input type="text" v-model="libro.autore" placeholder="autore" required>
    <input type="text" v-model="libro.isbn" placeholder="isbn">
    <input type="number" v-model="libro.anno" placeholder="anno">
    <select name="" id="">
      <option value="narrativa" selected>Narrativa</option>
      <option value="romanzo" >Romanzo</option>
      <option value="storico" >Storico</option>
      <option value="novella" >Novella</option>
      <option value="tecnico" >Tecnico</option>
    </select>
    <label for="disponibile">Disponibile</label>
    <input type="checkbox" v-model="libro.disponibile" id="disponibile">
    <textarea name="" id="" v-model="libro.descrizione"></textarea>
    <button :disabled="!formValido">Salva</button>
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
input, select, textarea {
  width: 100%;
  padding: 4px;
  border-radius: 4px;
}
input[type='checkbox'], select {
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
