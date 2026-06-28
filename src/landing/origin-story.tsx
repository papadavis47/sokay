import { css } from 'styled-system/css'

export function OriginStory() {
  return (
    <section
      className={css({
        maxW: '5xl',
        mx: 'auto',
        px: '4',
        py: { base: '12', md: '20' },
        display: 'flex',
        flexDirection: 'column',
        gap: { base: '8', md: '12' },
      })}
    >
      {/* Pull-quote lead-in */}
      <blockquote
        className={css({
          textAlign: 'center',
          fontSize: { base: '2xl', md: '4xl' },
          fontWeight: 'bold',
          letterSpacing: 'tight',
          lineHeight: 'tight',
          color: 'fg.default',
          maxW: '3xl',
          mx: 'auto',
          textWrap: 'balance',
        })}
      >
        This app was born out of my own{' '}
        <span className={css({ color: 'brand.solid' })}>personal struggle</span>
        .
      </blockquote>

      {/* Single-column story: the problem & the reframe */}
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '4',
          color: 'fg.muted',
          fontSize: 'lg',
          lineHeight: 'relaxed',
          maxW: '2xl',
          mx: 'auto',
        })}
      >
        <h3
          className={css({
            fontSize: '2xl',
            fontWeight: 'semibold',
            color: 'fg.default',
          })}
        >
          The <span className={css({ color: 'somber.solid' })}>SAD</span>{' '}
          current we are swimming against
        </h3>
        <p>
          In this day and age it is so very hard to eat healthy. Most people I
          know grew up with the{' '}
          <span className={css({ color: 'somber.solid' })}>
            Standard American Diet (SAD)
          </span>
          &ndash;which, unfortunately, is being slowly adopted around the world
          in places that were free of it as recently as ten years ago. There are
          so many unhealthy options presented that it is virtually impossible to
          steer clear of them completely.
        </p>
        <p>
          Many people resolve to avoid junk food&mdash;items they{' '}
          <span className={css({ color: 'fg.default', fontWeight: 'medium' })}>
            fully know
          </span>{' '}
          are not good for their health. But short-term ease, comfort, or
          pleasure can take precedence over long-term health and happiness.
        </p>
        <p>
          It is a powerful societal current that takes conscious effort to
          avoid. These market forces promote selling selling citizens addictive
          junk food at high profit margins, enriching corporations, at the
          expense of society's health.
        </p>
        <p>
          Sokay is about being mindful of the food that we consume, and
          understanding that one or two bad choices does not need to derail a
          healthy way of eating.
        </p>
        <p>
          It is about the{' '}
          <span className={css({ color: 'fg.default', fontWeight: 'medium' })}>
            process
          </span>{' '}
          of nurturing the body every day. It is about focusing on the things
          that truly nurture us—while including self-forgiveness and simply
          getting back on track no matter the setback.
        </p>
      </div>

      {/* Closing mantra */}
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '2',
          textAlign: 'center',
          fontSize: { base: 'xl', md: '2xl' },
          fontWeight: 'medium',
          color: 'fg.default',
          maxW: '2xl',
          mx: 'auto',
          textWrap: 'balance',
        })}
      >
        <p>Everyone is going to fall prey to this from time to time.</p>
        <p className={css({ color: 'brand.solid' })}>Keep moving forward</p>
      </div>
    </section>
  )
}
