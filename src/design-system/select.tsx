import { Select as ArkSelect, createListCollection } from '@ark-ui/react/select'
import { Portal } from '@ark-ui/react/portal'
import { type ComponentProps, forwardRef } from 'react'
import { cx } from 'styled-system/css'
import { select } from 'styled-system/recipes'
import { ChevronDown } from 'lucide-react'

const styles = select()

export { createListCollection }

export const SelectRoot = ArkSelect.Root
export const SelectValueText = ArkSelect.ValueText

export const SelectTrigger = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof ArkSelect.Trigger>
>(function SelectTrigger({ className, children, ...props }, ref) {
  return (
    <ArkSelect.Control>
      <ArkSelect.Trigger
        ref={ref}
        className={cx(styles.trigger, className)}
        {...props}
      >
        {children}
        <ArkSelect.Indicator>
          <ChevronDown size={16} />
        </ArkSelect.Indicator>
      </ArkSelect.Trigger>
    </ArkSelect.Control>
  )
})

export const SelectContent = forwardRef<
  HTMLDivElement,
  ComponentProps<typeof ArkSelect.Content>
>(function SelectContent({ className, children, ...props }, ref) {
  return (
    <Portal>
      <ArkSelect.Positioner>
        <ArkSelect.Content
          ref={ref}
          className={cx(styles.content, className)}
          {...props}
        >
          {children}
        </ArkSelect.Content>
      </ArkSelect.Positioner>
    </Portal>
  )
})

export const SelectItem = forwardRef<
  HTMLDivElement,
  ComponentProps<typeof ArkSelect.Item>
>(function SelectItem({ className, children, ...props }, ref) {
  return (
    <ArkSelect.Item ref={ref} className={cx(styles.item, className)} {...props}>
      <ArkSelect.ItemText>{children}</ArkSelect.ItemText>
    </ArkSelect.Item>
  )
})
