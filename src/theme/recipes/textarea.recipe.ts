import { defineRecipe } from '@pandacss/dev'

export const textarea = defineRecipe({
  className: 'textarea',
  jsx: ['Textarea'],
  base: {
    appearance: 'none',
    bg: 'transparent',
    borderColor: 'border.default',
    borderRadius: 'l2',
    borderWidth: '1px',
    color: 'fg.default',
    outline: 0,
    px: '3',
    py: '2',
    minH: '20',
    minW: '0',
    width: 'full',
    fontSize: 'sm',
    fontFamily: 'inherit',
    resize: 'vertical',
    transitionProperty: 'border-color, box-shadow',
    transitionDuration: '0.2s',
    _placeholder: { color: 'fg.subtle' },
    _focus: {
      borderColor: 'colorPalette.default',
      boxShadow: '0 0 0 1px var(--colors-color-palette-default)',
    },
    _disabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
})
