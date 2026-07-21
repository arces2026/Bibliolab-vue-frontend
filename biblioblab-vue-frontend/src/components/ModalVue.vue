<script setup>
const props = defineProps({
  success: String,
  button1: String,
  button2: String,
})

const emit = defineEmits(['exit', 'next', 'modalOff'])

const exit = () => emit('exit')
const next = () => emit('next')
const modalOff = () => emit('modalOff')
</script>

<template>
  <div @click.stop="modalOff" class="overlay">
    <div @click.stop class="container">
      <p class="para success">{{ props.success }}</p>
      <p class="para error">{{ props.message }}</p>
      <button class="btn next" @click="next">{{ props.button1 }}</button>
      <button class="btn exit" @click="exit">{{ props.button2 }}</button>
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.7);
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  min-width: 30%;
  width: fit-content;
  min-height: 200px;
  height: fit-content;
  background-color: beige;
  border-radius: 20px;
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 16px;
}

.para.success {
  grid-column: span 2 / span 2;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn.next {
  grid-row-start: 2;
}

.btn.exit {
  grid-row-start: 2;
}

.para {
  font-size: 1.5rem;
  text-align: center;
}

.para.success {
  color: green;
}

.para.error {
  color: red;
}

.btn {
  padding: 20px;
  width: 100%;
  border-radius: 10px;
  background-color: aqua;
  color: white;
  font-size: 1.2rem;
  box-shadow: 3px 3px 6px black;
  border: none;
  transition: all 0.1s ease;
}

.btn:hover {
  scale: 1.05;
}
</style>
