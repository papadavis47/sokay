import { ark } from '@ark-ui/react/factory'
import { type ComponentProps, forwardRef } from 'react'
import { css, cx } from 'styled-system/css'
import type { SystemStyleObject } from 'styled-system/types'

// Base/variant/size styles are kept as raw style *objects* (not pre-computed
// class strings) so they can be merged with a caller's `css` override in a
// single `css()` call. Panda's `css(a, b, ...)` dedupes by property with
// last-wins semantics, so the `css` prop always beats the variant — no
// `!important` needed. (Merging class strings via `cx` can't do this: the
// classes land in the same cascade layer and the winner is decided by CSS
// source order, not attribute order.)
const baseStyles: SystemStyleObject = {
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
}

const variantStyles: Record<string, SystemStyleObject> = {
  solid: {
    bg: 'colorPalette.solid.bg',
    color: 'colorPalette.solid.fg',
    _hover: { bg: 'colorPalette.solid.bg.hover' },
  },
  outline: {
    borderWidth: '1px',
    borderColor: 'colorPalette.outline.border',
    color: 'colorPalette.outline.fg',
    _hover: { bg: 'colorPalette.outline.bg.hover' },
  },
  subtle: {
    bg: 'colorPalette.subtle.bg',
    color: 'colorPalette.subtle.fg',
    _hover: { bg: 'colorPalette.subtle.bg.hover' },
  },
  plain: {
    color: 'colorPalette.plain.fg',
    _hover: { bg: 'colorPalette.plain.bg.hover' },
  },
  // Warm brand accent CTA: solid fill, lifting shadow, and a trailing icon
  // (any <svg> child) that slides on hover. Colors come from the `brand`
  // semantic tokens, so light/dark is handled automatically.
  cta: {
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
  },
}

const sizeStyles: Record<string, SystemStyleObject> = {
  sm: { h: '9', minW: '9', fontSize: 'sm', px: '3' },
  md: { h: '10', minW: '10', fontSize: 'sm', px: '3.5' },
  lg: { h: '11', minW: '11', fontSize: 'md', px: '4' },
}

export interface ButtonProps extends ComponentProps<typeof ark.button> {
  variant?: 'solid' | 'outline' | 'subtle' | 'plain' | 'cta'
  size?: 'sm' | 'md' | 'lg'
  /** Style overrides merged after the variant/size styles (last-wins). */
  css?: SystemStyleObject
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant = 'solid', size = 'md', css: cssProp, className, ...props },
    ref,
  ) {
    return (
      <ark.button
        type="button"
        ref={ref}
        className={cx(
          css(baseStyles, variantStyles[variant], sizeStyles[size], cssProp),
          className,
        )}
        {...props}
      />
    )
  },
)
