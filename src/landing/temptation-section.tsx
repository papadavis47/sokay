import { css } from 'styled-system/css'
import { token } from 'styled-system/tokens'
import { FadeIn } from '@/landing/fade-in'

/** Everyday temptations, surfaced one at a time as the reader scrolls. */
const TEMPTATIONS = [
  'On a roadtrip with family and everyone stops for ice cream cones.',
  'The workplace chocolate muffins or donuts a coworker brings in to the office.',
  'The food sold in every aisle of every gas station, sweetness and savory treats everywhere.',
  'The fast-food drive-through when pressed for time, running late, and not having slept enough.',
]

export function TemptationSection() {
  return (
    <section
      className={css({
        position: 'relative',
        overflow: 'hidden',
        py: { base: '16', md: '24' },
      })}
    >
      {/* Soft brand wash bleeding up from the bottom edge. */}
      <div
        aria-hidden
        className={css({
          position: 'absolute',
          inset: '0',
          pointerEvents: 'none',
          zIndex: '0',
          backgroundImage: `radial-gradient(120% 80% at 50% 100%, ${token(
            'colors.brand.subtle',
          )}, transparent 60%)`,
        })}
      />

      <div
        className={css({
          position: 'relative',
          zIndex: '1',
          maxW: '4xl',
          mx: 'auto',
          px: '4',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: { base: '10', md: '14' },
        })}
      >
        {/* Animated slogan */}
        <FadeIn>
          <h2
            className={css({
              fontSize: { base: '3xl', md: '5xl' },
              fontWeight: 'bold',
              letterSpacing: 'tight',
              lineHeight: 'tight',
              color: 'fg.default',
              maxW: '3xl',
              textWrap: 'balance',
            })}
          >
            Progress is far more attainable than perfection
            {/*<span className={css({ color: 'brand.solid' })}>
              perfection does not exist
            </span>*/}
          </h2>
        </FadeIn>

        <FadeIn delay={0.1}>
          <p
            className={css({
              fontSize: { base: 'lg', md: 'xl' },
              color: 'fg.muted',
              maxW: '2xl',
              lineHeight: 'relaxed',
            })}
          >
            There are unhealthy food temptations everywhere in our modern
            society.
          </p>
        </FadeIn>

        {/* Temptations revealed one by one */}
        <div
          className={css({
            display: 'flex',
            flexDirection: 'column',
            gap: '4',
            w: 'full',
            maxW: '2xl',
          })}
        >
          {TEMPTATIONS.map((temptation, i) => (
            <FadeIn key={temptation} delay={0.15 + i * 0.15} y={20}>
              <p
                className={css({
                  position: 'relative',
                  textAlign: 'left',
                  pl: '6',
                  py: '3',
                  fontSize: { base: 'md', md: 'lg' },
                  color: 'fg.default',
                  lineHeight: 'relaxed',
                  borderLeftWidth: '2px',
                  borderLeftStyle: 'solid',
                  borderLeftColor: 'brand.border',
                })}
              >
                {temptation}
              </p>
            </FadeIn>
          ))}
        </div>

        {/* Reframe / closing line */}
        <FadeIn delay={0.2}>
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
            You will have setbacks or you will simply want the immediate
            pleasure sometimes. That is not failure&mdash;it is being human.
            What matters is that you{' '}
            <span className={css({ color: 'brand.solid' })}>
              keep striving for your ideal
            </span>
            .
          </p>
        </FadeIn>
      </div>
    </section>
  )
}
