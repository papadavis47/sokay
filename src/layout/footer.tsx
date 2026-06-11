import { Link, useRouterState } from '@tanstack/react-router'
import { css } from 'styled-system/css'
import { BrandMark } from '@/layout/brand-mark'

const linkStyles = css({
  color: 'brand.solid',
  _hover: { color: 'brand.solidHover' },
  transition: 'colors',
})

export function Footer({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const year = new Date().getFullYear()

  return (
    <footer
      className={css({
        borderTopWidth: '1px',
        borderColor: 'border.default',
        bg: 'bg.default/95',
        backdropFilter: 'blur(8px)',
        mt: 'auto',
      })}
    >
      <div
        className={css({
          maxW: '7xl',
          mx: 'auto',
          px: '4',
          py: '8',
          display: 'flex',
          flexDirection: { base: 'column', md: 'row' },
          alignItems: { base: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          gap: '6',
        })}
      >
        <BrandMark to="/" size="sm" />

        <nav
          className={css({
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: { base: '4', md: '6' },
            fontSize: 'sm',
          })}
        >
          {pathname !== '/' && (
            <Link to="/" className={linkStyles}>
              Home
            </Link>
          )}
          {pathname !== '/origin' && (
            <Link to="/origin" className={linkStyles}>
              Origin
            </Link>
          )}
          {isLoggedIn ? (
            <>
              {pathname !== '/dashboard' && (
                <Link to="/dashboard" className={linkStyles}>
                  Dashboard
                </Link>
              )}
              {pathname !== '/dashboard/history' && (
                <Link to="/dashboard/history" className={linkStyles}>
                  History
                </Link>
              )}
              {pathname !== '/dashboard/settings' && (
                <Link to="/dashboard/settings" className={linkStyles}>
                  Settings
                </Link>
              )}
            </>
          ) : (
            <>
              <Link to="/login" className={linkStyles}>
                Log in
              </Link>
              <Link to="/signup" className={linkStyles}>
                Sign up
              </Link>
            </>
          )}
        </nav>

        <p className={css({ fontSize: 'xs', color: 'fg.subtle' })}>
          © {year} sokay. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
