import { Slider as ArkSlider } from '@ark-ui/react/slider'
import { type ComponentProps, forwardRef } from 'react'
import { css, cx } from 'styled-system/css'

const rootStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1',
  width: 'full',
})

const controlStyles = css({
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  py: '2',
})

const trackStyles = css({
  bg: 'gray.a3',
  borderRadius: 'full',
  height: '2',
  overflow: 'hidden',
  flex: '1',
})

const rangeStyles = css({
  bg: 'colorPalette.solid.bg',
  height: 'full',
})

const thumbStyles = css({
  bg: 'bg.default',
  borderColor: 'colorPalette.default',
  borderRadius: 'full',
  borderWidth: '2px',
  boxShadow: 'sm',
  h: '5',
  w: '5',
  outline: 0,
  transitionProperty: 'border-color, box-shadow',
  transitionDuration: '0.2s',
  _focus: {
    boxShadow: '0 0 0 2px var(--colors-color-palette-default)',
  },
})

export type SliderProps = ComponentProps<typeof ArkSlider.Root>

export const Slider = forwardRef<HTMLDivElement, SliderProps>(
  function Slider({ className, ...props }, ref) {
    return (
      <ArkSlider.Root ref={ref} className={cx(rootStyles, className)} {...props}>
        <ArkSlider.Control className={controlStyles}>
          <ArkSlider.Track className={trackStyles}>
            <ArkSlider.Range className={rangeStyles} />
          </ArkSlider.Track>
          {props.value?.map((_, index) => (
            <ArkSlider.Thumb key={index} index={index} className={thumbStyles} />
          ))}
        </ArkSlider.Control>
        <ArkSlider.HiddenInput />
      </ArkSlider.Root>
    )
  },
)
