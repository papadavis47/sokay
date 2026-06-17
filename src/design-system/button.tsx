import { ark } from '@ark-ui/react/factory'
import type { ComponentProps } from 'react'
import { styled } from 'styled-system/jsx'
import { button } from 'styled-system/recipes'

// Thin wrapper over the `button` config recipe (see src/theme/recipes/). The
// styled factory exposes the recipe's `variant`/`size` as typed props, forwards
// `ref`, and natively accepts the `css` prop + style props (which land in
// `@layer utilities` and so override the recipe base — no custom merge needed).
export const Button = styled(ark.button, button, {
  defaultProps: { type: 'button' },
})

export type ButtonProps = ComponentProps<typeof Button>
