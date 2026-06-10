import { Link, useRouter } from '@tanstack/react-router'
import { css } from 'styled-system/css'
import { Button } from 'design-system/button'
import { ThemeToggle } from '@/layout/theme-toggle'
import { BrandMark } from '@/layout/brand-mark'
import { MobileNav } from '@/layout/mobile-nav'
import { Avatar } from 'design-system/avatar'
import { logout } from '@/auth/auth'
import type { User } from '@supabase/supabase-js'

export function DashboardNav({
  user,
  displayName,
  avatarUrl,
}: {
  user: User
  displayName: string | null
  avatarUrl: string | null
}) {
  const router = useRouter()
  const shownName = displayName ?? user.email

  const handleLogout = async () => {
    await logout()
    await router.invalidate()
    await router.navigate({ to: '/' })
  }

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
        <div
          className={css({ display: 'flex', alignItems: 'center', gap: '6' })}
        >
          <BrandMark to="/dashboard" />
          {/* Desktop nav */}
          <nav
            className={css({
              display: { base: 'none', md: 'flex' },
              alignItems: 'center',
              gap: '2',
            })}
          >
            <Link to="/dashboard">
              <Button variant="plain" size="sm">
                Dashboard
              </Button>
            </Link>
            <Link to="/dashboard/history">
              <Button variant="plain" size="sm">
                History
              </Button>
            </Link>
            <Link to="/dashboard/settings">
              <Button variant="plain" size="sm">
                Settings
              </Button>
            </Link>
          </nav>
        </div>

        {/* Desktop actions */}
        <div
          className={css({
            display: { base: 'none', md: 'flex' },
            alignItems: 'center',
            gap: '3',
          })}
        >
          <Avatar src={avatarUrl} name={shownName} size="sm" />
          <span className={css({ fontSize: 'sm', color: 'fg.muted' })}>
            {shownName}
          </span>
          <ThemeToggle />
          <Button
            variant="plain"
            size="sm"
            onClick={handleLogout}
            className={css({
              color: 'brand.solid',
              _hover: { bg: 'brand.subtle' },
            })}
          >
            Log out
          </Button>
        </div>

        {/* Mobile actions */}
        <div
          className={css({
            display: { base: 'flex', md: 'none' },
            alignItems: 'center',
            gap: '2',
          })}
        >
          <ThemeToggle />
          <MobileNav label="Dashboard menu">
            {(close) => (
              <>
                <div
                  className={css({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3',
                    px: '3',
                    py: '2',
                  })}
                >
                  <Avatar src={avatarUrl} name={shownName} size="md" />
                  <span
                    className={css({
                      fontSize: 'sm',
                      color: 'fg.muted',
                      wordBreak: 'break-all',
                    })}
                  >
                    {shownName}
                  </span>
                </div>
                <Link to="/dashboard" onClick={close}>
                  <Button
                    variant="plain"
                    className={css({ w: 'full', justifyContent: 'flex-start' })}
                  >
                    Dashboard
                  </Button>
                </Link>
                <Link to="/dashboard/history" onClick={close}>
                  <Button
                    variant="plain"
                    className={css({ w: 'full', justifyContent: 'flex-start' })}
                  >
                    History
                  </Button>
                </Link>
                <Link to="/dashboard/settings" onClick={close}>
                  <Button
                    variant="plain"
                    className={css({ w: 'full', justifyContent: 'flex-start' })}
                  >
                    Settings
                  </Button>
                </Link>
                <Button
                  variant="plain"
                  onClick={() => {
                    close()
                    handleLogout()
                  }}
                  className={css({
                    mt: '2',
                    justifyContent: 'flex-start',
                    color: 'brand.solid',
                    _hover: { bg: 'brand.subtle' },
                  })}
                >
                  Log out
                </Button>
              </>
            )}
          </MobileNav>
        </div>
      </div>
    </header>
  )
}
