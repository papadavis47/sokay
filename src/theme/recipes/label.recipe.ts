import { defineRecipe } from '@pandacss/dev'

// No `color` on purpose: the body inherits `fg.default` globally (Park UI
// preset), so labels match by default while staying overridable via a plain
// `className={css({ color: ... })}` (utilities layer beats the recipe layer).
export const label = defineRecipe({
  className: 'label',
  jsx: ['Label'],
  base: {
    fontWeight: 'medium',
    fontSize: 'sm',
    lineHeight: 'normal',
    userSelect: 'none',
  },
})
