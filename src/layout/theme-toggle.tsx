import { Moon, Sun } from 'lucide-react'
import { css, cx } from 'styled-system/css'
import { Button } from 'design-system/button'
import { useTheme } from '@/layout/theme-provider'

export function ThemeToggle() {
  const { resolvedTheme, setTheme, theme } = useTheme()

  const toggle = () => {
    if (theme === 'system') {
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
    } else {
      setTheme(theme === 'dark' ? 'light' : 'dark')
    }
  }

  return (
    <Button
      variant="plain"
      size="sm"
      onClick={toggle}
      aria-label="Toggle theme"
      className={cx('group', css({ color: 'brand.solid' }))}
    >
      <span
        className={css({
          display: 'inline-flex',
          color: 'brand.solid',
          _groupHover: { color: 'brand.solidHover' },
        })}
      >
        {resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </span>
    </Button>
  )
}
