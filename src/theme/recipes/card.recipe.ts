import { defineSlotRecipe } from '@pandacss/dev'

// Slot recipe for the Card compound component. The `size` variant flows to the
// header/body/footer/title/description slots via createStyleContext, replacing
// the hand-rolled CardSizeContext.
export const card = defineSlotRecipe({
  className: 'card',
  // Track every compound part so Panda extracts css/style/variant props from
  // <Card>, <CardHeader>, <CardTitle>, … (createStyleContext components).
  jsx: ['Card', /^Card.+$/],
  slots: ['root', 'header', 'body', 'footer', 'title', 'description'],
  base: {
    root: {
      bg: 'bg.default',
      borderRadius: 'l3',
      borderWidth: '1px',
      borderColor: 'border.default',
      boxShadow: 'xs',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
    },
    header: { display: 'flex', flexDirection: 'column', p: '6' },
    body: { display: 'flex', flexDirection: 'column', pb: '6', px: '6' },
    footer: { display: 'flex', alignItems: 'center', p: '6', pt: '0' },
    title: { fontWeight: 'semibold', lineHeight: 'tight' },
    description: { color: 'fg.muted' },
  },
  variants: {
    size: {
      sm: {
        header: { gap: '1' },
        title: { fontSize: 'lg' },
        description: { fontSize: 'sm' },
      },
      lg: {
        header: { gap: '2' },
        title: { fontSize: 'xl' },
        description: { fontSize: 'md', lineHeight: 'relaxed' },
      },
    },
  },
  defaultVariants: {
    size: 'sm',
  },
})
