import { css, cx } from 'styled-system/css'

type AvatarSize = 'sm' | 'md' | 'lg'

interface AvatarProps {
  src: string | null
  name: string | null | undefined
  size?: AvatarSize
}

// Panda extracts styles statically at build time, so dimensions must be literal
// values (it can't read a runtime `${size}px`). Enumerate the sizes we use.
const boxBySize: Record<AvatarSize, string> = {
  sm: css({ w: '32px', h: '32px', fontSize: '13px' }),
  md: css({ w: '40px', h: '40px', fontSize: '16px' }),
  lg: css({ w: '56px', h: '56px', fontSize: '22px' }),
}

function initials(name: string | null | undefined): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function Avatar({ src, name, size = 'sm' }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name ?? 'Avatar'}
        className={cx(
          boxBySize[size],
          css({
            borderRadius: 'full',
            objectFit: 'cover',
            borderWidth: '1px',
            borderColor: 'border.default',
            flexShrink: 0,
          }),
        )}
      />
    )
  }

  return (
    <span
      aria-hidden="true"
      className={cx(
        boxBySize[size],
        css({
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 'full',
          bg: 'brand.subtle',
          color: 'brand.solid',
          fontWeight: 'semibold',
          flexShrink: 0,
          userSelect: 'none',
        }),
      )}
    >
      {initials(name)}
    </span>
  )
}
