import { ref, onMounted } from 'vue';

export function usePreferiti() {
  const arrayPreferiti = ref(new Set())

  const togglePreferito = (id) => {
    if (arrayPreferiti.value.has(id)) {
      arrayPreferiti.value.delete(id)
    } else {
      arrayPreferiti.value.add(id)
    }

    // Create a new Set for Vue reactivitY
    arrayPreferiti.value = new Set(arrayPreferiti.value)
    localStorage.setItem('preferiti', JSON.stringify(Array.from(arrayPreferiti.value)))
  }

  const isPreferito = (id) => arrayPreferiti.value.has(id)

  const loadPreferiti = () => {
    const stored = localStorage.getItem('preferiti')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        arrayPreferiti.value = new Set(parsed)
      } catch(err){
        console.error('Errore caricando i preferiti da localStorage', err.message)
      }
    }
  }

  onMounted(() => {
    loadPreferiti()
  })


return {
  arrayPreferiti,
  togglePreferito,
  isPreferito,
  loadPreferiti
}
}
