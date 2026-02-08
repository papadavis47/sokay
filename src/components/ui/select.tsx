import { Select as ArkSelect, createListCollection } from '@ark-ui/react/select'
import { Portal } from '@ark-ui/react/portal'
import { type ComponentProps, forwardRef } from 'react'
import { css, cx } from 'styled-system/css'
import { ChevronDown } from 'lucide-react'

const triggerStyles = css({
  alignItems: 'center',
  appearance: 'none',
  bg: 'transparent',
  borderColor: 'border.default',
  borderRadius: 'l2',
  borderWidth: '1px',
  color: 'fg.default',
  cursor: 'pointer',
  display: 'flex',
  h: '10',
  justifyContent: 'space-between',
  outline: 0,
  px: '3',
  width: 'full',
  fontSize: 'sm',
  transitionProperty: 'border-color, box-shadow',
  transitionDuration: '0.2s',
  _focus: {
    borderColor: 'colorPalette.default',
    boxShadow: '0 0 0 1px var(--colors-color-palette-default)',
  },
})

const contentStyles = css({
  bg: 'bg.default',
  borderRadius: 'l2',
  borderWidth: '1px',
  borderColor: 'border.default',
  boxShadow: 'lg',
  maxH: '64',
  overflow: 'auto',
  outline: 0,
  p: '1',
  zIndex: 'dropdown',
})

const itemStyles = css({
  alignItems: 'center',
  borderRadius: 'l1',
  cursor: 'pointer',
  display: 'flex',
  fontSize: 'sm',
  h: '10',
  justifyContent: 'space-between',
  px: '2',
  transitionProperty: 'background-color, color',
  transitionDuration: '0.15s',
  _hover: { bg: 'gray.a3' },
  _highlighted: { bg: 'gray.a3' },
})

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
        className={cx(triggerStyles, className)}
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
          className={cx(contentStyles, className)}
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
    <ArkSelect.Item
      ref={ref}
      className={cx(itemStyles, className)}
      {...props}
    >
      <ArkSelect.ItemText>{children}</ArkSelect.ItemText>
    </ArkSelect.Item>
  )
})
