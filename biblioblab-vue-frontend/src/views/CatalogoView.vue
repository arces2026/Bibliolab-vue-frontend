<script setup>
import { ref, onMounted, computed } from 'vue'
import LibroCard from '@/components/LibroCard.vue'
import { useLibri } from '@/composable/useLibri'
import { usePreferiti } from '@/composable/usePreferiti'
import { useEliminaLibro } from '@/composable/useEliminaLibro'
import ModalVue from '@/components/ModalVue.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const libriComp = useLibri()
const libri = ref([])

// Use the preferiti composable
const { arrayPreferiti, togglePreferito, isPreferito } = usePreferiti()

//Use the delete composable
const {
  showModal,
  button1Text,
  button2Text,
  loading,
  removeConfirmation,
  onConferma,
  onAnnulla,
  isDeleting,
} = useEliminaLibro(libri, libriComp)

// DELETION ANIMATION - STEP 1: Create a Set to track which book IDs are currently being deleted
// This Set stores the IDs of books that should show the deletion animation (deletingIds)

const libriDisponibili = computed(() => {
  return libri.value.filter((l) => l.disponibile).length
})

const totaleLibri = computed(() => libri.value.length)

onMounted(async () => (libri.value = await libriComp.getLibri('/api/v1/libri/')))
</script>

<template>
  <LoadingSpinner v-if="loading" />
  <ModalVue
    v-if="showModal"
    @next="onConferma"
    @exit="onAnnulla"
    @modal-off="showModal = false"
    :success="success"
    :button1="button1Text"
    :button2="button2Text"
    class="modal"
  />
  <div class="container">
    <h1>Catalogo</h1>
    <h2>{{ libriDisponibili }} libri disponibili su {{ totaleLibri }}</h2>

    <!-- DELETION ANIMATION - STEP 7: TransitionGroup wrapper
         - 'name="card"' - Prefix for CSS classes (card-enter-active, card-leave-active, etc.)
         - 'tag="div"' - Renders as a div element
         - 'class="parent"' - Applies the grid layout styling
         - This component automatically handles enter/leave animations for its children -->
    <TransitionGroup name="card" tag="div" class="parent">
      <!-- DELETION ANIMATION - STEP 8: Individual card rendering
           - Each LibroCard is wrapped by TransitionGroup for animation
           - ':class' binding dynamically adds 'card-deleting' class when isDeleting() is true
           - The 'card-deleting' class triggers the CSS animation -->
      <div class="parent" v-for="libro in libri" :key="libro.id">
        <LibroCard
          v-bind="libro"
          @addPreferiti="togglePreferito"
          @onDelete="removeConfirmation"
          :preferito="arrayPreferiti.has(libro.id)"
          :class="['libro-card', { 'card-deleting': isDeleting(libro.id) }]"
        />
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
h2 {
  text-align: center;
  margin: 20px;
}

/* DELETION ANIMATION - STEP 9: Transition classes for Vue's TransitionGroup */
.card-enter-active, /*Not used, it's for added cards */
.card-leave-active {
  transition: all 0.4s ease;
}

/* DELETION ANIMATION - STEP 10: Starting state when element enters
   - Element starts invisible (opacity: 0)
   - Starts slightly below its final position (translateY: 30px)
   - Starts slightly smaller (scale: 0.9)
   - Transitions to its final state (opacity: 1, translateY: 0, scale: 1)
   Not needed in this case*/
.card-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.9);
}

/* DELETION ANIMATION - STEP 11: Ending state when element leaves
   - Element fades out (opacity: 0)
   - Slides left while shrinking (translateX: -50px, scale: 0.8)
   - This creates a "slide out and shrink" effect */
/* .card-leave-to {
  opacity: 0;
  transform: translateX(-50px) scale(0.8);
} */

/* DELETION ANIMATION - STEP 12: Critical positioning for leave animation
   - 'position: absolute' - Removes the element from the normal flow
   - This prevents other cards from shifting during the animation
   - 'width: 100%' - Maintains the width during the animation
   - Without this, the grid would reflow immediately, ruining the animation */
.card-leave-active {
  position: absolute;
  width: 100%;
}

/* DELETION ANIMATION - STEP 13: Custom deletion animation triggered manually
   - 'opacity: 0' - Fades the card out completely
   - 'transform: translateX(-100px) scale(0.5)' - Slides left and shrinks more dramatically
   - '!important' - Overrides any conflicting styles
   - 'transition: all 0.4s ease' - Applies the same duration and easing
   - This is applied via the JavaScript setTimeout, giving a different animation
   - than the standard leave animation */
.card-deleting {
  opacity: 0 !important;
  transform: scale(0.5) !important;
  /* transform: translateX(-100px) scale(0.5) !important; */
  transition: all 0.4s ease !important;
}

.modal {
  z-index: 10;
}

.container {
  background-color: rgb(120, 120, 180);
  padding: 20px;
}

h1 {
  text-align: center;
}

/* DELETION ANIMATION - STEP 14: Relative positioning for absolute children
     - Required because .card-leave-active uses position: absolute
     - This creates a positioning context for the absolutely positioned
       elements during the leave animation */
.parent {
  position: relative; /* Needed for deletion animation (absolute children) */
  display: grid;
  /* grid-template-columns: repeat(6, 1fr); */
  /* Automatically fits as many cards as possible, minimum width 280px */
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  /* grid-template-rows: repeat(4, 1fr); */
  gap: 32px;
}

.libro-card {
  grid-column: auto;
  grid-row: auto;
  /* DELETION ANIMATION - STEP 15: Smooth transitions for hover effects
     - Not directly related to deletion, but ensures consistent animations
     - Applies to any property changes on the card */
  transition: all 0.3s ease;
  background-color: rgb(152, 152, 177);
}
</style>
