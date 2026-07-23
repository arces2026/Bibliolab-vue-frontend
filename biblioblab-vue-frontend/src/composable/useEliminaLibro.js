import { ref } from 'vue'
import { useLibri } from './useLibri'


export function useEliminaLibro(libri, fetchLibri) {
  const showModal = ref(false)
  const button1Text = ref('Conferma')
  const button2Text = ref('Annulla')
  const libroDaRimuovere = ref(null)
  const loading = ref(false)
  const deletingIds = ref(new Set())
  const { eliminaLibro } = useLibri()

  const removeConfirmation = (id) => {
    libroDaRimuovere.value = id
    showModal.value = true
  }

  const onConferma = async () => {
    loading.value = true
    const id = libroDaRimuovere.value
    if (!id) return

    try{
      const result = await eliminaLibro(`/api/v1/libri/${id}/`)
      showModal.value = false
      console.log('Libro eliminato con successo', result)

      //Start deleting animation
      deletingIds.value.add(id)

      //Wait for animation to complete
      setTimeout(() => {
        //Remove from reactive array
        if (fetchLibri){
          // If we have a fetch function, refresh the list
          fetchLibri()
        } else {
          // Otherwise remove from the array directly
          const index = libri.value.findIndex(l => l.id === id)
          if (index !== -1){
            libri.value.splice(index, 1)
          }
        }
        deletingIds.value.delete(id)
        loading.value = false
      }, 400)
    } catch(err){
      console.error('Errore durante la eliminazione del libro', err.message)
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
    isDeleting
  }
}
