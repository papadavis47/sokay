import { defineSlotRecipe } from '@pandacss/dev'

// Avatar renders one of two slots — an `image` (when a src is present) or a
// text `fallback` (initials). The `size` variant carries literal dimensions so
// Panda can extract them statically (it can't read a runtime `${size}px`).
export const avatar = defineSlotRecipe({
  className: 'avatar',
  jsx: ['Avatar'],
  slots: ['image', 'fallback'],
  base: {
    image: {
      borderRadius: 'full',
      objectFit: 'cover',
      borderWidth: '1px',
      borderColor: 'border.default',
      flexShrink: 0,
    },
    fallback: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'full',
      bg: 'brand.subtle',
      color: 'brand.solid',
      fontWeight: 'semibold',
      flexShrink: 0,
      userSelect: 'none',
    },
  },
  variants: {
    size: {
      sm: {
        image: { w: '32px', h: '32px' },
        fallback: { w: '32px', h: '32px', fontSize: '13px' },
      },
      md: {
        image: { w: '40px', h: '40px' },
        fallback: { w: '40px', h: '40px', fontSize: '16px' },
      },
      lg: {
        image: { w: '56px', h: '56px' },
        fallback: { w: '56px', h: '56px', fontSize: '22px' },
      },
    },
  },
  defaultVariants: {
    size: 'sm',
  },
})
