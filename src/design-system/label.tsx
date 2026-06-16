import { type ComponentProps, forwardRef } from 'react'
import { css, cx } from 'styled-system/css'

const labelStyles = css({
  // No `color` here on purpose: the body inherits `fg.default` globally
  // (Park UI preset), so labels match by default while staying overridable
  // via the `className` prop — Panda's `cx` only concatenates classes, so a
  // hardcoded color would always win over the override by CSS source order.
  fontWeight: 'medium',
  fontSize: 'sm',
  lineHeight: 'normal',
  userSelect: 'none',
})

export type LabelProps = ComponentProps<'label'>

export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { className, ...props },
  ref,
) {
  return <label ref={ref} className={cx(labelStyles, className)} {...props} />
})
