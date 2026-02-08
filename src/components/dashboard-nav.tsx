import { Link } from '@tanstack/react-router'
import { css } from 'styled-system/css'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { logout } from '@/server/auth'
import type { User } from '@supabase/supabase-js'

export function DashboardNav({ user }: { user: User }) {
  const handleLogout = async () => {
    await logout()
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
        <div className={css({ display: 'flex', alignItems: 'center', gap: '6' })}>
          <Link to="/dashboard">
            <h1 className={css({ fontSize: '2xl', fontWeight: 'bold', color: 'fg.default' })}>
              sokay
            </h1>
          </Link>
          <nav className={css({ display: 'flex', alignItems: 'center', gap: '2' })}>
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
          </nav>
        </div>
        <div className={css({ display: 'flex', alignItems: 'center', gap: '3' })}>
          <span
            className={css({
              fontSize: 'sm',
              color: 'fg.muted',
              display: { base: 'none', md: 'inline' },
            })}
          >
            {user.email}
          </span>
          <ThemeToggle />
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Log out
          </Button>
        </div>
      </div>
    </header>
  )
}
