import { Slider as ArkSlider } from '@ark-ui/react/slider'
import { type ComponentProps, forwardRef } from 'react'
import { cx } from 'styled-system/css'
import { slider } from 'styled-system/recipes'

const styles = slider()

export type SliderProps = ComponentProps<typeof ArkSlider.Root>

export const Slider = forwardRef<HTMLDivElement, SliderProps>(function Slider(
  { className, ...props },
  ref,
) {
  return (
    <ArkSlider.Root ref={ref} className={cx(styles.root, className)} {...props}>
      <ArkSlider.Control className={styles.control}>
        <ArkSlider.Track className={styles.track}>
          <ArkSlider.Range className={styles.range} />
        </ArkSlider.Track>
        <ArkSlider.Thumb index={0} className={styles.thumb}>
          <ArkSlider.HiddenInput />
        </ArkSlider.Thumb>
      </ArkSlider.Control>
    </ArkSlider.Root>
  )
})
