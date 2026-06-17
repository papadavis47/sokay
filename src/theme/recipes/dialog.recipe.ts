import { defineSlotRecipe } from '@pandacss/dev'

export const dialog = defineSlotRecipe({
  className: 'dialog',
  jsx: ['Dialog'],
  slots: ['backdrop', 'positioner', 'content', 'title', 'description'],
  base: {
    backdrop: {
      bg: 'black/50',
      inset: '0',
      position: 'fixed',
      zIndex: 'overlay',
      _open: { animation: 'fade-in 0.2s ease-out' },
      _closed: { animation: 'fade-out 0.15s ease-in' },
    },
    positioner: {
      alignItems: 'center',
      display: 'flex',
      inset: '0',
      justifyContent: 'center',
      position: 'fixed',
      zIndex: 'modal',
    },
    content: {
      bg: 'bg.default',
      borderRadius: 'l3',
      boxShadow: 'lg',
      maxW: 'lg',
      p: '6',
      position: 'relative',
      w: 'full',
      mx: '4',
      _open: { animation: 'slide-in 0.2s ease-out' },
      _closed: { animation: 'slide-out 0.15s ease-in' },
    },
    title: {
      fontSize: 'lg',
      fontWeight: 'semibold',
      lineHeight: 'tight',
    },
    description: {
      color: 'fg.muted',
      fontSize: 'sm',
    },
  },
})
