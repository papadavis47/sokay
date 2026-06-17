import { defineRecipe } from '@pandacss/dev'

// Config recipe for the Button primitive. Emits into `@layer recipes`, which
// sits below `@layer utilities`, so a consumer's plain `className={css({...})}`
// overrides the recipe automatically — no `css` prop / `!important` needed.
// `jsx` lets Panda track variant usage through the custom <Button> wrapper.
export const button = defineRecipe({
  className: 'button',
  jsx: ['Button'],
  base: {
    alignItems: 'center',
    appearance: 'none',
    borderRadius: 'l2',
    cursor: 'pointer',
    display: 'inline-flex',
    flexShrink: '0',
    fontWeight: 'semibold',
    gap: '2',
    justifyContent: 'center',
    outline: '0',
    position: 'relative',
    transitionProperty:
      'background-color, border-color, color, box-shadow, transform',
    transitionDuration: '0.2s',
    userSelect: 'none',
    verticalAlign: 'middle',
    whiteSpace: 'nowrap',
    _disabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
  variants: {
    variant: {
      // `solid` is the warm brand-orange primary (shares the `cta` brand fill,
      // minus the lift/shadow/icon). The quieter variants use neutral gray
      // (`colorPalette: 'gray'` + alpha steps) via the installed Park UI preset
      // (0.43.1) token names. Same brand/gray palette used everywhere else.
      solid: {
        bg: 'brand.solid',
        color: 'brand.onSolid',
        _hover: { bg: 'brand.solidHover' },
      },
      outline: {
        borderWidth: '1px',
        borderColor: 'colorPalette.a7',
        color: 'colorPalette.text',
        colorPalette: 'gray',
        _hover: { bg: 'colorPalette.a2' },
      },
      subtle: {
        bg: 'colorPalette.a3',
        color: 'colorPalette.text',
        colorPalette: 'gray',
        _hover: { bg: 'colorPalette.a4' },
      },
      plain: {
        color: 'colorPalette.text',
        colorPalette: 'gray',
        _hover: { bg: 'colorPalette.a3' },
      },
      // Warm brand accent CTA: solid fill, lifting shadow, and a trailing icon
      // (any <svg> child) that slides on hover. Colors come from the `brand`
      // semantic tokens, so light/dark is handled automatically.
      cta: {
        bg: 'brand.solid',
        color: 'brand.onSolid',
        boxShadow: 'brand',
        '& svg': { transition: 'transform 0.2s' },
        _hover: {
          bg: 'brand.solidHover',
          boxShadow: 'brandHover',
          transform: 'translateY(-2px)',
          '& svg': { transform: 'translateX(3px)' },
        },
        _active: { transform: 'translateY(0)' },
      },
    },
    size: {
      sm: { h: '9', minW: '9', fontSize: 'sm', px: '3' },
      md: { h: '10', minW: '10', fontSize: 'sm', px: '3.5' },
      lg: { h: '11', minW: '11', fontSize: 'md', px: '4' },
    },
  },
  defaultVariants: {
    variant: 'solid',
    size: 'md',
  },
})
