import { css } from 'styled-system/css'
import { token } from 'styled-system/tokens'
import { FadeIn } from '@/landing/fade-in'

/** Dictionary-style entry defining what a "sokay" is, on a soft brand wash. */
export function SokayDefinition() {
  return (
    <section
      className={css({
        position: 'relative',
        overflow: 'hidden',
        py: { base: '12', md: '16' },
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
          backgroundImage: `radial-gradient(110% 80% at 50% 100%, ${token(
            'colors.brand.subtle',
          )}, transparent 60%)`,
        })}
      />

      <div
        className={css({
          position: 'relative',
          zIndex: '1',
          maxW: '2xl',
          mx: 'auto',
          px: '4',
        })}
      >
        <FadeIn>
          <div
            className={css({
              borderWidth: '1px',
              borderColor: 'brand.border',
              borderRadius: 'xl',
              bg: 'bg.default/60',
              backdropFilter: 'blur(4px)',
              px: { base: '6', md: '10' },
              py: { base: '8', md: '10' },
              display: 'flex',
              flexDirection: 'column',
              gap: '4',
            })}
          >
            {/* Dictionary-style entry */}
            <div
              className={css({
                display: 'flex',
                alignItems: 'baseline',
                flexWrap: 'wrap',
                gap: '3',
              })}
            >
              <span
                className={css({
                  fontSize: { base: '2xl', md: '3xl' },
                  fontWeight: 'bold',
                  color: 'fg.default',
                })}
              >
                sokay
              </span>
              <span
                className={css({
                  fontSize: 'sm',
                  fontStyle: 'italic',
                  color: 'fg.subtle',
                })}
              >
                /soh-KAY/ · noun
              </span>
            </div>

            <p
              className={css({
                fontSize: { base: 'lg', md: 'xl' },
                color: 'fg.muted',
                lineHeight: 'relaxed',
              })}
            >
              the moment you stray from your ideal way of eating
            </p>

            <p
              className={css({
                fontSize: { base: '2xl', md: '3xl' },
                fontWeight: 'bold',
                letterSpacing: 'tight',
                lineHeight: 'snug',
                color: 'brand.solid',
                textWrap: 'balance',
              })}
            >
              “It'<span className={css({ color: 'fg.default' })}>s okay</span>.
              Get back on the horse.”
            </p>

            <p
              className={css({
                fontSize: 'md',
                color: 'fg.muted',
                lineHeight: 'relaxed',
              })}
            >
              Only you can decide what counts as a setback. It depends on your
              ideal and your diet—so it looks different for everyone. The
              important thing is never getting derailed: following through on
              the goal you set for yourself.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
