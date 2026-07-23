# Animation Analysis: CatalogoView.vue

## Overview

This Vue component implements a smooth card-based catalog with two distinct animation types:
1. **Entry animation** when the component renders
2. **Exit animation** when a book card is deleted

The animations are powered by Vue's `<TransitionGroup>` component and CSS transitions.

---

## 1. Entry Animation

### Implementation

The entry animation uses Vue's `card-enter-*` classes:

```vue
<TransitionGroup name="card" tag="div" class="parent">
```

### CSS Classes

```css
.card-enter-active {
  transition: all 0.4s ease;
}

.card-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.9);
}
```

### Behavior

- **`card-enter-from`**: Sets the initial state for new cards
  - Fully transparent (opacity: 0)
  - Shifted down 30px from final position
  - Scaled down to 90% of final size

- **`card-enter-active`**: Controls the transition timing
  - Applies to both enter and leave states
  - Uses `all` properties with 0.4s duration and `ease` timing function

- **Result**: Cards smoothly fade in while moving upward and scaling to their final size

---

## 2. Exit (Deletion) Animation

### Implementation

The deletion animation uses a dynamic class `card-deleting`:

```vue
<LibroCard
  :class="['libro-card', { 'card-deleting': isDeleting(libro.id) }]"
/>
```

### CSS Classes

```css
.card-leave-active {
  position: absolute;
  width: 100%;
}

.card-deleting {
  opacity: 0 !important;
  transform: scale(0.5) !important;
  transition: all 0.4s ease !important;
}
```

### Behavior

1. **Before deletion**: `isDeleting(libro.id)` returns `true`, applying `card-deleting` class
2. **During deletion**: Vue's `card-leave-active` makes the card `position: absolute` and `width: 100%`
3. **Animation**: The card fades out and scales down to 50% size over 0.4 seconds

### Why `position: absolute`?

The `card-leave-active` with `position: absolute` is crucial because:
- It removes the card from the normal document flow during the exit animation
- This prevents other cards from jumping/shifting immediately while the animation runs
- Once the animation completes, the card is fully removed and the layout reflows naturally

---

## 3. Container Styling for Animation Support

```css
.parent {
  position: relative; /* Critical for absolute children during deletion */
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
}
```

- `position: relative` creates a positioning context for the absolutely positioned cards during deletion
- Grid layout with `auto-fit` makes the cards responsive

---

## 4. Integration with Composable

The deletion flow is managed by `useEliminaLibro` composable:

```javascript
const {
  showModal,
  loading,
  removeConfirmation,
  onConferma,
  onAnnulla,
  isDeleting,
} = useEliminaLibro(libri)
```

- **`removeConfirmation`**: Triggered when delete button is clicked → opens modal
- **`onConferma`**: Confirms deletion → triggers animation + data removal
- **`isDeleting`**: Checks if a specific card is currently in deletion state

---

## Animation Flow Summary

### User Deletes a Book:

1. User clicks delete on `LibroCard`
2. `removeConfirmation(libro.id)` is called
3. Modal opens for confirmation
4. On confirm → `onConferma()`:
   - Sets `isDeleting(libro.id) = true`
   - `card-deleting` class is applied
   - Card animates: fades out + scales down (0.4s)
   - After animation completes → card removed from DOM
   - Data updated in the array

### New Data Loads:

1. Cards are fetched from API via `getLibri()`
2. Each card triggers entry animation as it appears in the DOM
3. Cards fade in from bottom while scaling up

---

## Key Animations Comparison

| Property | Entry Animation | Exit Animation |
|----------|----------------|----------------|
| **Trigger** | Component mounted / Data added | User confirms deletion |
| **Duration** | 0.4s | 0.4s |
| **Effect** | Fade in + scale up + slide up | Fade out + scale down |
| **Layout impact** | Smooth addition | Removed from flow during animation |
| **Class used** | `card-enter-from` → `card-enter-to` | `card-deleting` + `card-leave-active` |

---

## Technical Notes

1. **`!important` usage**: Used in `card-deleting` to ensure animation styles override other styles during the critical deletion moment

2. **Keyframe animation vs CSS transitions**: This implementation uses CSS transitions for better performance and simpler code

3. **TransitionGroup limitations**: The comment mentions that `card-enter-from` may not be needed in this specific case (possibly due to initial render optimization)

4. **Positioning**: `position: absolute` during leave ensures smooth visual experience by preventing layout shift

---

## Potential Improvements

1. **Add stagger effect**: Use `transition-delay` for sequential card animations
2. **Swipe animation**: Add horizontal swipe during deletion for more visual variety
3. **Undo functionality**: Could add reverse animation if user cancels deletion
4. **Loading state integration**: Currently loading spinner covers the whole view during delete operation