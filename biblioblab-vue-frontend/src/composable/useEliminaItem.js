import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'

export function useEliminaItem(items, options = {}) {
  const { getCsrf } = useAuthStore()
  const showModal = ref(false)
  const button1Text = ref('Conferma')
  const button2Text = ref('Annulla')
  const itemDaRimuovere = ref(null)
  const loading = ref(false)
  const deletingIds = ref(new Set())

  // Check if items is a ref
  const isRef = items && typeof items === 'object' && 'value' in items

  //Default options
  const {
    baseUrl = '/api/v1/libri/', // Default for books
    itemName = 'libro',
    refreshFn = null, // What the hell is this ???
    deleteDelay = 400,
  } = options

  const eliminaItem = async (url) => {
    try {
      const res = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCsrf(),
        },
      })
      if (!res.ok)
        throw new Error(
          `Errore eliminando ${itemName} cond ID ${itemDaRimuovere.value}: ${res.status} ${res.statusText}`,
        )
      return { success: true, status: res.status }
    } catch (err) {
      console.error('Errore catturato eliminando il libro ', itemName, err.message)
      throw err
    }
  }

  const removeConfirmation = (id) => {
    itemDaRimuovere.value = id
    console.log({ itemDaRimuovere: itemDaRimuovere.value })
    showModal.value = true
  }

  const onConferma = async () => {
    loading.value = true
    const id = itemDaRimuovere.value
    console.log({ id: id })
    if (!id) return

    try {
      const result = await eliminaItem(`${baseUrl}${id}`)
      showModal.value = false
      console.log('Libro eliminato con successo', result)

      //Start deleting animation
      deletingIds.value.add(id)

      //Wait for animation to complete
      setTimeout(() => {
        if (refreshFn) {
          refreshFn()
        } else if (isRef && Array.isArray(items.value)) {
          const index = items.value.findIndex((item) => item.id === id)
          if (index !== -1) {
            items.value.splice(index, 1)
          }
        } else if (Array.isArray(items)) {
          const index = items.findIndex((item) => item.id === id)
          if (index !== -1) {
            items.splice(index, 1)
          }
        }

        deletingIds.value.delete(id)
        loading.value = false
      }, deleteDelay)
    } catch (err) {
      console.error('Errore durante la eliminazione del', itemName, err.message)
      alert('Errore eliminazione, usare paragrafo errore!!' + err.message)
      loading.value = false
    }
  }

  const onAnnulla = () => {
    showModal.value = false
  }

  const isDeleting = (id) => deletingIds.value.has(id)

  return {
    showModal,
    button1Text,
    button2Text,
    loading,
    deletingIds,
    removeConfirmation,
    onConferma,
    onAnnulla,
    isDeleting,
    eliminaItem,
  }
}
