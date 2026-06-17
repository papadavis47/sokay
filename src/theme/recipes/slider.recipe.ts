import { defineSlotRecipe } from '@pandacss/dev'

export const slider = defineSlotRecipe({
  className: 'slider',
  jsx: ['Slider'],
  slots: ['root', 'control', 'track', 'range', 'thumb'],
  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1',
      width: 'full',
    },
    control: {
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      py: '2',
    },
    track: {
      bg: 'gray.a3',
      borderRadius: 'full',
      height: '2',
      overflow: 'hidden',
      flex: '1',
    },
    range: {
      bg: 'colorPalette.default',
      height: 'full',
    },
    thumb: {
      bg: 'bg.default',
      borderColor: 'colorPalette.default',
      borderRadius: 'full',
      borderWidth: '2px',
      boxShadow: 'sm',
      h: '5',
      w: '5',
      outline: 0,
      transitionProperty: 'border-color, box-shadow',
      transitionDuration: '0.2s',
      _focus: {
        boxShadow: '0 0 0 2px var(--colors-color-palette-default)',
      },
    },
  },
})
