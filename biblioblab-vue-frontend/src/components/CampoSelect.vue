<script setup>
//per supportare il v-model custom il componente deve:
//1. Accettare la prop 'modelValue'
//2. Emettere l'evento 'update:modelValue'
const props = defineProps({
  modelValue: {
    type: String,
     default: ''
    },
  label: {
    type: String,
     default: '',
    },
    opzioni: {
      type: Array,
      default: () => []
    },
    errore: {
      type: String,
      default: ''
    }
})

const emit = defineEmits(['update:modelValue', 'change'])

const onChange = (e) => {
  emit('update:modelValue', e.target.value)
}
</script>

<template>
  <label :for="label">{{ label }}</label>
  <select :id='label' @change="onChange" :value='modelValue' :class="{'errore':errore}">
    <option v-for="opt in props.opzioni" :key=opt.value :value="opt.value">{{ opt.label }}</option>
  </select>
  <span v-if="errore" class="errore-msg">{{ errore }}</span>
</template>
