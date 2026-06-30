import { css } from 'styled-system/css'
import { FadeIn } from '@/landing/fade-in'

/** Shifts in how we eat, surfaced one at a time as the reader scrolls. */
const SHIFTS = [
  'High-fructose corn syrup and added sugar worked into nearly everything.',
  'Burger and fried-chicken chains multiplied to a mind-boggling number.',
  'Food sold at gas stations and department stores at very high margins.',
  'Items engineered to taste good and look good—but not to keep you healthy.',
]

/** The bigger cultural current: how eating changed, revealed shift by shift. */
export function BiggerCurrent() {
  return (
    <section
      className={css({
        maxW: '4xl',
        mx: 'auto',
        px: '4',
        py: { base: '12', md: '16' },
        display: 'flex',
        flexDirection: 'column',
        gap: { base: '8', md: '10' },
      })}
    >
      <FadeIn>
        <h2
          className={css({
            fontSize: { base: '3xl', md: '4xl' },
            fontWeight: 'bold',
            letterSpacing: 'tight',
            lineHeight: 'tight',
            color: 'fg.default',
            maxW: '2xl',
            textWrap: 'balance',
          })}
        >
          This is bigger than{' '}
          <span className={css({ color: 'somber.solid' })}>willpower</span>.
        </h2>
      </FadeIn>

      <p
        className={css({
          fontSize: 'lg',
          color: 'fg.muted',
          lineHeight: 'relaxed',
          maxW: '2xl',
        })}
      >
        Over the past fifty years I've watched—and read about—a remarkable
        change in how Americans eat, and now, sadly, how more and more of the
        world eats too. Supermarkets transformed. Food crept onto the shelves of
        gas stations and department stores. And through it all, citizens kept
        getting sicker.
      </p>

      {/* Shifts revealed one by one */}
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '4',
          w: 'full',
          maxW: '2xl',
        })}
      >
        {SHIFTS.map((shift, i) => (
          <FadeIn key={shift} delay={i * 0.1} y={20}>
            <p
              className={css({
                pl: '6',
                py: '3',
                fontSize: { base: 'md', md: 'lg' },
                color: 'fg.default',
                lineHeight: 'relaxed',
                borderLeftWidth: '2px',
                borderLeftStyle: 'solid',
                borderLeftColor: 'somber.solid',
              })}
            >
              {shift}
            </p>
          </FadeIn>
        ))}
      </div>

      <FadeIn>
        <p
          className={css({
            fontSize: { base: 'xl', md: '2xl' },
            fontWeight: 'medium',
            color: 'fg.default',
            maxW: '2xl',
            textWrap: 'balance',
            lineHeight: 'snug',
          })}
        >
          Like the reckoning that came for the tobacco industry, I believe a
          backlash is coming for the food that makes us sicker as time goes on—a
          backlash against corporate greed.
        </p>
      </FadeIn>
    </section>
  )
}
