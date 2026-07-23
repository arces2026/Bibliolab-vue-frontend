<script setup>
//per supportare il v-model custom il componente deve:
//1. Accettare la prop 'modelValue'
//2. Emettere l'evento 'update:modelValue'
// eslint-disable-next-line no-unused-vars
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  opzioni: {
    type: Array,
    default: () => [],
  },
  errore: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

const onChange = (e) => {
  const value = e.target.value

  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<template>
  <div class="container">
    <label :for="label">{{ label }}</label>
    <select :id="label" @change="onChange" :value="modelValue" :class="{ errore: errore }">
      <option value="tutti">Tutti</option>
      <option v-for="opt in opzioni" :key="opt.id" :value="opt.nome">{{ opt.nome }}</option>
    </select>
    <span v-if="errore" class="errore-msg">{{ errore }}</span>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
}

select {
  width: 200px;
  padding: 6px;
  margin-bottom: 30px;
  border-radius: 5px;
}
</style>
