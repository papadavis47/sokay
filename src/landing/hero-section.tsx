import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { css } from 'styled-system/css'
import { Button } from 'design-system/button'
import { AnimatedSokayMark } from '@/landing/animated-sokay-mark'

export function HeroSection({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  return (
    <section
      className={css({
        position: 'relative',
        overflow: 'hidden',
        pt: { base: '12', md: '16' },
        pb: { base: '16', md: '24' },
      })}
    >
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
        {/* Animated brand ring */}
        <AnimatedSokayMark />

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
        </p>
        <p
          className={css({
            fontSize: { base: 'lg', md: 'xl' },
            color: 'fg.muted',
            maxW: '2xl',
            lineHeight: 'relaxed',
          })}
        >
          Sokay helps you stay mindful of the food you eat, track the slips
          without guilt, and get back on track—because the journey goes on.
        </p>

        {/* Calls to action */}
        {isLoggedIn ? (
          <Link
            to="/dashboard"
            className={css({ w: { base: 'full', sm: 'auto' }, mt: '2' })}
          >
            <Button
              size="lg"
              variant="cta"
              className={css({ w: { base: 'full', sm: 'auto' } })}
            >
              Go to Dashboard
              <ArrowRight className={css({ w: '5', h: '5' })} />
            </Button>
          </Link>
        ) : (
          <>
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
          </>
        )}
      </div>
    </section>
  )
}
