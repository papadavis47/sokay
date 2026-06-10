import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { css } from 'styled-system/css'
import { token } from 'styled-system/tokens'
import { Button } from 'design-system/button'

export function HeroSection() {
  return (
    <section
      className={css({
        position: 'relative',
        overflow: 'hidden',
        pt: { base: '12', md: '16' },
        pb: { base: '16', md: '24' },
      })}
    >
      {/* Faint, far-reaching warm wash — a wide low-opacity radial gradient
          that melts into the canvas rather than a defined blob. */}
      <div
        aria-hidden
        className={css({
          position: 'absolute',
          inset: '0',
          pointerEvents: 'none',
          zIndex: '0',
          backgroundImage: `radial-gradient(120% 80% at 50% 0%, ${token(
            'colors.brand.subtle',
          )}, transparent 60%)`,
        })}
      />

      <div
        className={css({
          position: 'relative',
          zIndex: '1',
          maxW: '3xl',
          mx: 'auto',
          px: '4',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '6',
        })}
      >
        {/* Headline */}
        <h1
          className={css({
            fontSize: { base: '4xl', md: '6xl', lg: '7xl' },
            fontWeight: 'bold',
            letterSpacing: 'tight',
            lineHeight: 'tight',
            color: 'fg.default',
          })}
        >
          It'<span className={css({ color: 'brand.solid' })}>s okay</span> to
          not eat perfectly all the time
        </h1>

        {/* Emotional hook from the founder's notes */}
        <p
          className={css({
            fontSize: { base: 'lg', md: 'xl' },
            color: 'fg.muted',
            maxW: '2xl',
            lineHeight: 'relaxed',
          })}
        >
          We are swimming against the current of the Standard American Diet.
          Sokay helps you stay mindful of the food you eat, track the slips
          without guilt, and get back on track—because the journey goes on.
        </p>

        {/* Calls to action */}
        <div
          className={css({
            display: 'flex',
            flexDirection: { base: 'column', sm: 'row' },
            justifyContent: 'center',
            alignItems: 'center',
            gap: '3',
            w: { base: 'full', sm: 'auto' },
            mt: '2',
          })}
        >
          <Link
            to="/signup"
            className={css({ w: { base: 'full', sm: 'auto' } })}
          >
            <Button
              size="lg"
              variant="cta"
              className={css({ w: { base: 'full', sm: 'auto' } })}
            >
              Sign Up — it's free
              <ArrowRight className={css({ w: '5', h: '5' })} />
            </Button>
          </Link>
          <Link
            to="/login"
            className={css({ w: { base: 'full', sm: 'auto' } })}
          >
            <Button
              size="lg"
              variant="outline"
              className={css({ w: { base: 'full', sm: 'auto' } })}
            >
              Log in
            </Button>
          </Link>
        </div>

        <p className={css({ fontSize: 'sm', color: 'fg.muted' })}>
          No credit card. Just you and the process.
        </p>
      </div>
    </section>
  )
}
