import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { css } from 'styled-system/css'
import { token } from 'styled-system/tokens'
import { Button } from 'design-system/button'
import { SokayMark } from '@/layout/sokay-mark'

interface OriginCtaProps {
  isLoggedIn: boolean
}

/** Closing call-to-action: brand mark, headline, and sign-up / dashboard links. */
export function OriginCta({ isLoggedIn }: OriginCtaProps) {
  return (
    <section
      className={css({
        position: 'relative',
        overflow: 'hidden',
        py: { base: '16', md: '24' },
      })}
    >
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
          maxW: '2xl',
          mx: 'auto',
          px: '4',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '6',
        })}
      >
        <div className={css({ color: 'brand.solid' })}>
          <SokayMark size={96} />
        </div>

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
          Free, private, and{' '}
          <span className={css({ color: 'brand.solid' })}>helpful</span>.
        </h2>

        <p
          className={css({
            fontSize: { base: 'lg', md: 'xl' },
            color: 'fg.muted',
            maxW: 'xl',
            lineHeight: 'relaxed',
          })}
        >
          If any of this resonates, give Sokay a try.
        </p>

        {isLoggedIn ? (
          <Link to="/dashboard" className={css({ mt: '2' })}>
            <Button size="lg" variant="cta">
              Go to Dashboard
              <ArrowRight className={css({ w: '5', h: '5' })} />
            </Button>
          </Link>
        ) : (
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
        )}
      </div>
    </section>
  )
}
