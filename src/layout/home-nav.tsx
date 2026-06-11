import { Link, useRouterState } from '@tanstack/react-router'
import { css } from 'styled-system/css'
import { Button } from 'design-system/button'
import { ThemeToggle } from '@/layout/theme-toggle'
import { BrandMark } from '@/layout/brand-mark'
import { MobileNav } from '@/layout/mobile-nav'

const brandLinkStyles = css({
  color: 'brand.solid',
  _hover: { bg: 'brand.subtle' },
})

const mobileLinkStyles = css({
  w: 'full',
  justifyContent: 'flex-start',
  color: 'brand.solid',
  _hover: { bg: 'brand.subtle' },
})

export function HomeNav({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const showOrigin = pathname !== '/origin'

  return (
    <header
      className={css({
        borderBottomWidth: '1px',
        borderColor: 'border.default',
        bg: 'bg.default/95',
        backdropFilter: 'blur(8px)',
      })}
    >
      <div
        className={css({
          maxW: '7xl',
          mx: 'auto',
          px: '4',
          display: 'flex',
          h: '16',
          alignItems: 'center',
          justifyContent: 'space-between',
        })}
      >
        <BrandMark to="/" />

        <div
          className={css({ display: 'flex', alignItems: 'center', gap: '3' })}
        >
          <ThemeToggle />

          {/* Desktop nav */}
          <nav
            className={css({
              display: { base: 'none', md: 'flex' },
              alignItems: 'center',
              gap: '3',
            })}
          >
            {isLoggedIn ? (
              <>
                {showOrigin && (
                  <Link to="/origin">
                    <Button variant="plain" className={brandLinkStyles}>
                      Origin
                    </Button>
                  </Link>
                )}
                <Link to="/dashboard">
                  <Button variant="plain" className={brandLinkStyles}>
                    Dashboard
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="plain" className={brandLinkStyles}>
                    Log in
                  </Button>
                </Link>
                {showOrigin && (
                  <Link to="/origin">
                    <Button variant="plain" className={brandLinkStyles}>
                      Origin
                    </Button>
                  </Link>
                )}
                <Link to="/signup">
                  <Button variant="plain" className={brandLinkStyles}>
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile nav */}
          <div className={css({ display: { base: 'block', md: 'none' } })}>
            <MobileNav label="Menu">
              {(close) =>
                isLoggedIn ? (
                  <>
                    {showOrigin && (
                      <Link to="/origin" onClick={close}>
                        <Button variant="plain" className={mobileLinkStyles}>
                          Origin
                        </Button>
                      </Link>
                    )}
                    <Link to="/dashboard" onClick={close}>
                      <Button variant="plain" className={mobileLinkStyles}>
                        Dashboard
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={close}>
                      <Button variant="plain" className={mobileLinkStyles}>
                        Log in
                      </Button>
                    </Link>
                    {showOrigin && (
                      <Link to="/origin" onClick={close}>
                        <Button variant="plain" className={mobileLinkStyles}>
                          Origin
                        </Button>
                      </Link>
                    )}
                    <Link to="/signup" onClick={close}>
                      <Button variant="plain" className={mobileLinkStyles}>
                        Get Started
                      </Button>
                    </Link>
                  </>
                )
              }
            </MobileNav>
          </div>
        </div>
      </div>
    </header>
  )
}
