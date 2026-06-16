import { createFileRoute, getRouteApi, Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { css } from 'styled-system/css'
import { token } from 'styled-system/tokens'
import { Button } from 'design-system/button'
import { HomeNav } from '@/layout/home-nav'
import { SokayMark } from '@/layout/sokay-mark'
import { FadeIn } from '@/landing/fade-in'

const rootApi = getRouteApi('__root__')

export const Route = createFileRoute('/origin')({
  component: OriginPage,
})

/** Shifts in how we eat, surfaced one at a time as the reader scrolls. */
const SHIFTS = [
  'High-fructose corn syrup and added sugar worked into nearly everything.',
  'Burger and fried-chicken chains multiplied to a mind-boggling number.',
  'Food sold at gas stations and department stores at very high margins.',
  'Items engineered to taste good and look good—but not to keep you healthy.',
]

function OriginPage() {
  const { isLoggedIn } = rootApi.useLoaderData()

  return (
    <div className={css({ minH: 'screen', bg: 'bg.canvas' })}>
      <HomeNav isLoggedIn={isLoggedIn} />

      <main>
        {/* ── Lead ─────────────────────────────────────────────── */}
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
            What works isn't a clean streak—it's incremental progress, with
            plenty of stumbles along the way. Everyone has to find their own
            process. That's exactly why Sokay is built to be malleable: you set
            the terms.
          </p>
        </section>

        {/* ── What a "sokay" is ────────────────────────────────── */}
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
                  the moment you stray from your ideal way of eating.
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
                  “It's okay. Get back on the horse.”
                </p>

                <p
                  className={css({
                    fontSize: 'md',
                    color: 'fg.muted',
                    lineHeight: 'relaxed',
                  })}
                >
                  Only you can decide what counts as a setback. It depends on
                  your ideal and your diet—so it looks different for everyone.
                  The important thing is never getting derailed: following
                  through on the goal you set for yourself.
                </p>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ── The personal turning point ───────────────────────── */}
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
              “I just failed. I might as well forget it for the rest of the
              week.”
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
              I was tired of feeling defeated—tired of believing I could solve
              this with discipline and tenacity alone. It is a strange moment in
              human history when a bowl of vanilla bean ice cream with chocolate
              syrup can make a person feel like a failure, quickly followed by
              the urge to give up entirely.
            </p>
            <p>
              Sokay was born out of that exact feeling. The realization that a
              less-than-ideal slip{' '}
              <span
                className={css({ color: 'fg.default', fontWeight: 'medium' })}
              >
                does not have to derail
              </span>{' '}
              the way you want to eat. One stumble is just one stumble—not a
              verdict on the whole week.
            </p>
          </div>
        </section>

        {/* ── The bigger current ───────────────────────────────── */}
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
            change in how Americans eat, and now, sadly, how more and more of
            the world eats too. Supermarkets transformed. Food crept onto the
            shelves of gas stations and department stores. And through it all,
            citizens kept getting sicker.
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
              backlash is coming for the food that makes us sicker as time goes
              on—a backlash against corporate greed.
            </p>
          </FadeIn>
        </section>

        {/* ── Honest claims ────────────────────────────────────── */}
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
              What I claim—and what I don't.
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
              built Sokay as a tool for me, and I've found it genuinely helpful
              for my own awareness and goal-setting. I make no claim that it is
              grounded in behavioral or nutritional science.
            </p>
            <p>
              The one thing I will say for certain:{' '}
              <span
                className={css({ color: 'fg.default', fontWeight: 'medium' })}
              >
                it can't hurt to try.
              </span>{' '}
              If it doesn't help, fine—but at the very least it gives you one
              more piece of incentive to make a healthy choice. Put as much
              thought and energy into the process as you see fit. However much
              it helps—great.
            </p>
          </div>
        </section>

        {/* ── Closing CTA ──────────────────────────────────────── */}
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
              If any of this resonates, give Sokay a try. The journey goes
              on—and so do you.
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
      </main>
    </div>
  )
}
