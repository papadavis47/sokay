import { ark } from '@ark-ui/react/factory'
import { type ComponentProps, forwardRef } from 'react'
import { css, cx } from 'styled-system/css'

const buttonStyles = {
  base: css({
    alignItems: 'center',
    appearance: 'none',
    borderRadius: 'l2',
    cursor: 'pointer',
    display: 'inline-flex',
    flexShrink: '0',
    fontWeight: 'semibold',
    gap: '2',
    justifyContent: 'center',
    outline: '0',
    position: 'relative',
    transitionProperty:
      'background-color, border-color, color, box-shadow, transform',
    transitionDuration: '0.2s',
    userSelect: 'none',
    verticalAlign: 'middle',
    whiteSpace: 'nowrap',
    _disabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  }),
  solid: css({
    bg: 'colorPalette.solid.bg',
    color: 'colorPalette.solid.fg',
    _hover: { bg: 'colorPalette.solid.bg.hover' },
  }),
  outline: css({
    borderWidth: '1px',
    borderColor: 'colorPalette.outline.border',
    color: 'colorPalette.outline.fg',
    _hover: { bg: 'colorPalette.outline.bg.hover' },
  }),
  subtle: css({
    bg: 'colorPalette.subtle.bg',
    color: 'colorPalette.subtle.fg',
    _hover: { bg: 'colorPalette.subtle.bg.hover' },
  }),
  plain: css({
    color: 'colorPalette.plain.fg',
    _hover: { bg: 'colorPalette.plain.bg.hover' },
  }),
  // Warm brand accent CTA: solid fill, lifting shadow, and a trailing icon
  // (any <svg> child) that slides on hover. Colors come from the `brand`
  // semantic tokens, so light/dark is handled automatically.
  cta: css({
    bg: 'brand.solid',
    color: 'brand.onSolid',
    boxShadow: 'brand',
    '& svg': { transition: 'transform 0.2s' },
    _hover: {
      bg: 'brand.solidHover',
      boxShadow: 'brandHover',
      transform: 'translateY(-2px)',
      '& svg': { transform: 'translateX(3px)' },
    },
    _active: { transform: 'translateY(0)' },
  }),
}

const sizeStyles = {
  sm: css({ h: '9', minW: '9', fontSize: 'sm', px: '3' }),
  md: css({ h: '10', minW: '10', fontSize: 'sm', px: '3.5' }),
  lg: css({ h: '11', minW: '11', fontSize: 'md', px: '4' }),
}

export interface ButtonProps extends ComponentProps<typeof ark.button> {
  variant?: 'solid' | 'outline' | 'subtle' | 'plain' | 'cta'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ variant = 'solid', size = 'md', className, ...props }, ref) {
    return (
      <ark.button
        type="button"
        ref={ref}
        className={cx(
          buttonStyles.base,
          buttonStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      />
    )
  },
)
