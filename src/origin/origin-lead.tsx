import { css } from 'styled-system/css'

/** Lead: eyebrow, headline, and intro paragraph that open the origin story. */
export function OriginLead() {
  return (
    <section
      className={css({
        maxW: '3xl',
        mx: 'auto',
        px: '4',
        pt: { base: '12', md: '16' },
        pb: { base: '10', md: '14' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '6',
      })}
    >
      <span
        className={css({
          fontSize: 'sm',
          fontWeight: 'semibold',
          letterSpacing: 'wider',
          textTransform: 'uppercase',
          color: 'brand.solid',
        })}
      >
        The Origin Story
      </span>

      <h1
        className={css({
          fontSize: { base: '4xl', md: '6xl' },
          fontWeight: 'bold',
          letterSpacing: 'tight',
          lineHeight: 'tight',
          color: 'fg.default',
          textWrap: 'balance',
        })}
      >
        Resolutions rarely work.{' '}
        <span className={css({ color: 'brand.solid' })}>
          The next small step does.
        </span>
      </h1>

      <p
        className={css({
          fontSize: { base: 'lg', md: 'xl' },
          color: 'fg.muted',
          maxW: '2xl',
          lineHeight: 'relaxed',
        })}
      >
        What works isn't a clean streak—it's incremental progress, even with the
        inevitable stumbles along the way. Everyone has to find their own
        process. That's exactly why Sokay is built to be malleable: you set the
        terms and find what works for you.
      </p>
    </section>
  )
}
