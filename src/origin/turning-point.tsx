import { css } from 'styled-system/css'
import { FadeIn } from '@/landing/fade-in'

/** The personal turning point: the pull-quote and the story behind Sokay. */
export function TurningPoint() {
  return (
    <section
      className={css({
        maxW: '3xl',
        mx: 'auto',
        px: '4',
        py: { base: '12', md: '16' },
        display: 'flex',
        flexDirection: 'column',
        gap: { base: '8', md: '10' },
      })}
    >
      <FadeIn>
        <blockquote
          className={css({
            pl: '6',
            borderLeftWidth: '3px',
            borderLeftStyle: 'solid',
            borderLeftColor: 'brand.border',
            fontSize: { base: '2xl', md: '3xl' },
            fontWeight: 'bold',
            letterSpacing: 'tight',
            lineHeight: 'tight',
            color: 'fg.default',
            textWrap: 'balance',
          })}
        >
          “I just failed. I might as well forget it for the rest of the week.”
        </blockquote>
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
          I was tired of feeling defeated—tired of believing I could solve this
          with discipline and tenacity alone. It is a strange moment in human
          history when a bowl of vanilla bean ice cream with chocolate syrup can
          make a person feel like a failure, quickly followed by the urge to
          give up entirely.
        </p>
        <p>
          Sokay was born out of that exact feeling. The realization that a
          less-than-ideal slip{' '}
          <span className={css({ color: 'fg.default', fontWeight: 'medium' })}>
            does not have to derail
          </span>{' '}
          the way you want to eat. One stumble is just one stumble—not a verdict
          on the whole week.
        </p>
      </div>
    </section>
  )
}
