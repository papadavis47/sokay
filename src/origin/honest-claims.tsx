import { css } from 'styled-system/css'
import { FadeIn } from '@/landing/fade-in'

/** Honest claims: what the author does and doesn't claim about Sokay. */
export function HonestClaims() {
  return (
    <section
      className={css({
        maxW: '3xl',
        mx: 'auto',
        px: '4',
        py: { base: '12', md: '16' },
        display: 'flex',
        flexDirection: 'column',
        gap: '6',
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
            textWrap: 'balance',
          })}
        >
          What I claim, and what I don't
        </h2>
      </FadeIn>

      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '4',
          color: 'fg.muted',
          fontSize: 'lg',
          lineHeight: 'relaxed',
        })}
      >
        <p>
          I'm a software engineer who has lived with this problem myself. I
          built Sokay as a tool for me, and I've found it genuinely helpful for
          my own awareness and goal-setting. I make no claim that it is grounded
          in behavioral or nutritional science.
        </p>
        <p>
          The one thing I will say for certain:{' '}
          <span className={css({ color: 'fg.default', fontWeight: 'medium' })}>
            it can't hurt to try.
          </span>{' '}
          If it doesn't help, fine—but at the very least it gives you one more
          piece of incentive to make a healthy choice. Put as much thought and
          energy into the process as you see fit.
        </p>
      </div>
    </section>
  )
}
