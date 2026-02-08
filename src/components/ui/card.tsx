import { type ComponentProps, forwardRef } from 'react'
import { css, cx } from 'styled-system/css'

const cardStyles = css({
  bg: 'bg.default',
  borderRadius: 'l3',
  borderWidth: '1px',
  borderColor: 'border.default',
  boxShadow: 'xs',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  position: 'relative',
})

const cardHeaderStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1',
  p: '6',
})

const cardBodyStyles = css({
  display: 'flex',
  flexDirection: 'column',
  pb: '6',
  px: '6',
})

const cardFooterStyles = css({
  display: 'flex',
  alignItems: 'center',
  p: '6',
  pt: '0',
})

const cardTitleStyles = css({
  fontSize: 'lg',
  fontWeight: 'semibold',
  lineHeight: 'tight',
})

const cardDescriptionStyles = css({
  fontSize: 'sm',
  color: 'fg.muted',
})

export const Card = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  function Card({ className, ...props }, ref) {
    return <div ref={ref} className={cx(cardStyles, className)} {...props} />
  },
)

export const CardHeader = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  function CardHeader({ className, ...props }, ref) {
    return <div ref={ref} className={cx(cardHeaderStyles, className)} {...props} />
  },
)

export const CardBody = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  function CardBody({ className, ...props }, ref) {
    return <div ref={ref} className={cx(cardBodyStyles, className)} {...props} />
  },
)

export const CardFooter = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  function CardFooter({ className, ...props }, ref) {
    return <div ref={ref} className={cx(cardFooterStyles, className)} {...props} />
  },
)

export const CardTitle = forwardRef<HTMLHeadingElement, ComponentProps<'h3'>>(
  function CardTitle({ className, ...props }, ref) {
    return <h3 ref={ref} className={cx(cardTitleStyles, className)} {...props} />
  },
)

export const CardDescription = forwardRef<HTMLParagraphElement, ComponentProps<'p'>>(
  function CardDescription({ className, ...props }, ref) {
    return <p ref={ref} className={cx(cardDescriptionStyles, className)} {...props} />
  },
)
