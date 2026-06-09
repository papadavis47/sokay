import { Link } from '@tanstack/react-router'
import { css } from 'styled-system/css'
import { BrandMark } from '@/components/brand-mark'

export function Footer() {
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
          <Link
            to="/"
            className={css({
              color: 'brand.solid',
              _hover: { color: 'brand.solidHover' },
              transition: 'colors',
            })}
          >
            Home
          </Link>
          <Link
            to="/login"
            className={css({
              color: 'brand.solid',
              _hover: { color: 'brand.solidHover' },
              transition: 'colors',
            })}
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className={css({
              color: 'brand.solid',
              _hover: { color: 'brand.solidHover' },
              transition: 'colors',
            })}
          >
            Sign up
          </Link>
        </nav>

        <p className={css({ fontSize: 'xs', color: 'fg.subtle' })}>
          © {year} sokay. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
