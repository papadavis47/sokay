import {
  type ComponentProps,
  createContext,
  forwardRef,
  useContext,
} from 'react'
import { css, cx } from 'styled-system/css'
import type { SystemStyleObject } from 'styled-system/types'

export type CardSize = 'sm' | 'lg'

// All card variant differences live in this file. Set `size` on <Card> and it
// flows to the header/title/description via context, so consumers only choose
// the variant in one place (e.g. <Card size="lg">).
const CardSizeContext = createContext<CardSize>('sm')

// Styles are raw style *objects* so each part can merge a caller's `css`
// override in a single `css()` call (last-wins dedup) — see button.tsx for why
// this beats `cx`-ing class strings and removes the need for `!important`.
type SubProps = ComponentProps<'div'> & { css?: SystemStyleObject }

const cardStyles: SystemStyleObject = {
  bg: 'bg.default',
  borderRadius: 'l3',
  borderWidth: '1px',
  borderColor: 'border.default',
  boxShadow: 'xs',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  position: 'relative',
}

const cardHeaderStyles: Record<CardSize, SystemStyleObject> = {
  sm: { display: 'flex', flexDirection: 'column', gap: '1', p: '6' },
  lg: { display: 'flex', flexDirection: 'column', gap: '2', p: '6' },
}

const cardBodyStyles: Record<CardSize, SystemStyleObject> = {
  sm: { display: 'flex', flexDirection: 'column', pb: '6', px: '6' },
  lg: { display: 'flex', flexDirection: 'column', pb: '6', px: '6' },
}

const cardFooterStyles: Record<CardSize, SystemStyleObject> = {
  sm: { display: 'flex', alignItems: 'center', p: '6', pt: '0' },
  lg: { display: 'flex', alignItems: 'center', p: '6', pt: '0' },
}

const cardTitleStyles: Record<CardSize, SystemStyleObject> = {
  sm: { fontSize: 'lg', fontWeight: 'semibold', lineHeight: 'tight' },
  lg: { fontSize: 'xl', fontWeight: 'semibold', lineHeight: 'tight' },
}

const cardDescriptionStyles: Record<CardSize, SystemStyleObject> = {
  sm: { fontSize: 'sm', color: 'fg.muted' },
  lg: { fontSize: 'md', color: 'fg.muted', lineHeight: 'relaxed' },
}

interface CardProps extends ComponentProps<'div'> {
  size?: CardSize
  /** Style overrides merged after the base styles (last-wins). */
  css?: SystemStyleObject
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, css: cssProp, size = 'sm', ...props },
  ref,
) {
  return (
    <CardSizeContext.Provider value={size}>
      <div
        ref={ref}
        className={cx(css(cardStyles, cssProp), className)}
        {...props}
      />
    </CardSizeContext.Provider>
  )
})

export const CardHeader = forwardRef<HTMLDivElement, SubProps>(
  function CardHeader({ className, css: cssProp, ...props }, ref) {
    const size = useContext(CardSizeContext)
    return (
      <div
        ref={ref}
        className={cx(css(cardHeaderStyles[size], cssProp), className)}
        {...props}
      />
    )
  },
)

export const CardBody = forwardRef<HTMLDivElement, SubProps>(function CardBody(
  { className, css: cssProp, ...props },
  ref,
) {
  const size = useContext(CardSizeContext)
  return (
    <div
      ref={ref}
      className={cx(css(cardBodyStyles[size], cssProp), className)}
      {...props}
    />
  )
})

export const CardFooter = forwardRef<HTMLDivElement, SubProps>(
  function CardFooter({ className, css: cssProp, ...props }, ref) {
    const size = useContext(CardSizeContext)
    return (
      <div
        ref={ref}
        className={cx(css(cardFooterStyles[size], cssProp), className)}
        {...props}
      />
    )
  },
)

export const CardTitle = forwardRef<
  HTMLHeadingElement,
  ComponentProps<'h3'> & { css?: SystemStyleObject }
>(function CardTitle({ className, css: cssProp, ...props }, ref) {
  const size = useContext(CardSizeContext)
  return (
    <h3
      ref={ref}
      className={cx(css(cardTitleStyles[size], cssProp), className)}
      {...props}
    />
  )
})

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  ComponentProps<'p'> & { css?: SystemStyleObject }
>(function CardDescription({ className, css: cssProp, ...props }, ref) {
  const size = useContext(CardSizeContext)
  return (
    <p
      ref={ref}
      className={cx(css(cardDescriptionStyles[size], cssProp), className)}
      {...props}
    />
  )
})
