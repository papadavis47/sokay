import { Dialog as ArkDialog } from '@ark-ui/react/dialog'
import { Portal } from '@ark-ui/react/portal'
import { type ComponentProps, forwardRef } from 'react'
import { css, cx } from 'styled-system/css'

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

const contentStyles = css({
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
})

const titleStyles = css({
  fontSize: 'lg',
  fontWeight: 'semibold',
  lineHeight: 'tight',
})

const descriptionStyles = css({
  color: 'fg.muted',
  fontSize: 'sm',
})

export const DialogRoot = ArkDialog.Root
export const DialogTrigger = ArkDialog.Trigger

export const DialogContent = forwardRef<HTMLDivElement, ComponentProps<typeof ArkDialog.Content>>(
  function DialogContent({ className, children, ...props }, ref) {
    return (
      <Portal>
        <ArkDialog.Backdrop className={backdropStyles} />
        <ArkDialog.Positioner className={positionerStyles}>
          <ArkDialog.Content ref={ref} className={cx(contentStyles, className)} {...props}>
            {children}
          </ArkDialog.Content>
        </ArkDialog.Positioner>
      </Portal>
    )
  },
)

export const DialogTitle = forwardRef<HTMLHeadingElement, ComponentProps<typeof ArkDialog.Title>>(
  function DialogTitle({ className, ...props }, ref) {
    return <ArkDialog.Title ref={ref} className={cx(titleStyles, className)} {...props} />
  },
)

export const DialogDescription = forwardRef<HTMLParagraphElement, ComponentProps<typeof ArkDialog.Description>>(
  function DialogDescription({ className, ...props }, ref) {
    return <ArkDialog.Description ref={ref} className={cx(descriptionStyles, className)} {...props} />
  },
)

export const DialogCloseTrigger = ArkDialog.CloseTrigger
