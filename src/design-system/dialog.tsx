import { Dialog as ArkDialog } from '@ark-ui/react/dialog'
import { Portal } from '@ark-ui/react/portal'
import { type ComponentProps, forwardRef } from 'react'
import { cx } from 'styled-system/css'
import { dialog } from 'styled-system/recipes'

// Slot classes from the `dialog` config recipe (no variants → call once).
// Consumers override any slot with a plain `className={css({...})}`; the
// utilities layer beats the recipe layer, so no merge helper is needed.
const styles = dialog()

export const DialogRoot = ArkDialog.Root
export const DialogTrigger = ArkDialog.Trigger

export const DialogContent = forwardRef<
  HTMLDivElement,
  ComponentProps<typeof ArkDialog.Content>
>(function DialogContent({ className, children, ...props }, ref) {
  return (
    <Portal>
      <ArkDialog.Backdrop className={styles.backdrop} />
      <ArkDialog.Positioner className={styles.positioner}>
        <ArkDialog.Content
          ref={ref}
          className={cx(styles.content, className)}
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
  ComponentProps<typeof ArkDialog.Title>
>(function DialogTitle({ className, ...props }, ref) {
  return (
    <ArkDialog.Title
      ref={ref}
      className={cx(styles.title, className)}
      {...props}
    />
  )
})

export const DialogDescription = forwardRef<
  HTMLParagraphElement,
  ComponentProps<typeof ArkDialog.Description>
>(function DialogDescription({ className, ...props }, ref) {
  return (
    <ArkDialog.Description
      ref={ref}
      className={cx(styles.description, className)}
      {...props}
    />
  )
})

export const DialogCloseTrigger = ArkDialog.CloseTrigger
