import { Dialog as ArkDialog } from '@ark-ui/react/dialog'
import { Portal } from '@ark-ui/react/portal'
import { type ComponentProps, forwardRef } from 'react'
import { css, cx } from 'styled-system/css'
import type { SystemStyleObject } from 'styled-system/types'

const backdropStyles = css({
  bg: 'black/50',
  inset: '0',
  position: 'fixed',
  zIndex: 'overlay',
  _open: { animation: 'fade-in 0.2s ease-out' },
  _closed: { animation: 'fade-out 0.15s ease-in' },
})

const positionerStyles = css({
  alignItems: 'center',
  display: 'flex',
  inset: '0',
  justifyContent: 'center',
  position: 'fixed',
  zIndex: 'modal',
})

// Raw style objects so the parts can merge a caller's `css` override in one
// `css()` call (last-wins) instead of `cx`-ing class strings — see button.tsx
// for why that removes the need for `!important`.
const contentStyles: SystemStyleObject = {
  bg: 'bg.default',
  borderRadius: 'l3',
  boxShadow: 'lg',
  maxW: 'lg',
  p: '6',
  position: 'relative',
  w: 'full',
  mx: '4',
  _open: { animation: 'slide-in 0.2s ease-out' },
  _closed: { animation: 'slide-out 0.15s ease-in' },
}

const titleStyles: SystemStyleObject = {
  fontSize: 'lg',
  fontWeight: 'semibold',
  lineHeight: 'tight',
}

const descriptionStyles: SystemStyleObject = {
  color: 'fg.muted',
  fontSize: 'sm',
}

export const DialogRoot = ArkDialog.Root
export const DialogTrigger = ArkDialog.Trigger

export const DialogContent = forwardRef<
  HTMLDivElement,
  ComponentProps<typeof ArkDialog.Content> & { css?: SystemStyleObject }
>(function DialogContent({ className, css: cssProp, children, ...props }, ref) {
  return (
    <Portal>
      <ArkDialog.Backdrop className={backdropStyles} />
      <ArkDialog.Positioner className={positionerStyles}>
        <ArkDialog.Content
          ref={ref}
          className={cx(css(contentStyles, cssProp), className)}
          {...props}
        >
          {children}
        </ArkDialog.Content>
      </ArkDialog.Positioner>
    </Portal>
  )
})

export const DialogTitle = forwardRef<
  HTMLHeadingElement,
  ComponentProps<typeof ArkDialog.Title> & { css?: SystemStyleObject }
>(function DialogTitle({ className, css: cssProp, ...props }, ref) {
  return (
    <ArkDialog.Title
      ref={ref}
      className={cx(css(titleStyles, cssProp), className)}
      {...props}
    />
  )
})

export const DialogDescription = forwardRef<
  HTMLParagraphElement,
  ComponentProps<typeof ArkDialog.Description> & { css?: SystemStyleObject }
>(function DialogDescription({ className, css: cssProp, ...props }, ref) {
  return (
    <ArkDialog.Description
      ref={ref}
      className={cx(css(descriptionStyles, cssProp), className)}
      {...props}
    />
  )
})

export const DialogCloseTrigger = ArkDialog.CloseTrigger
