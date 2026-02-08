import { type ComponentProps, forwardRef } from 'react'
import { css, cx } from 'styled-system/css'

const labelStyles = css({
  color: 'fg.default',
  fontWeight: 'medium',
  fontSize: 'sm',
  lineHeight: 'normal',
  userSelect: 'none',
})

export type LabelProps = ComponentProps<'label'>

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  function Label({ className, ...props }, ref) {
    return <label ref={ref} className={cx(labelStyles, className)} {...props} />
  },
)
