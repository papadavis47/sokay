import { css } from 'styled-system/css'

interface AvatarProps {
  src: string | null
  name: string | null | undefined
  size?: number
}

function initials(name: string | null | undefined): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function Avatar({ src, name, size = 32 }: AvatarProps) {
  const dimensions = { w: `${size}px`, h: `${size}px` }

  if (src) {
    return (
      <img
        src={src}
        alt={name ?? 'Avatar'}
        className={css({
          ...dimensions,
          borderRadius: 'full',
          objectFit: 'cover',
          borderWidth: '1px',
          borderColor: 'border.default',
          flexShrink: 0,
        })}
      />
    )
  }

  return (
    <span
      aria-hidden="true"
      className={css({
        ...dimensions,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 'full',
        bg: 'brand.subtle',
        color: 'brand.solid',
        fontWeight: 'semibold',
        fontSize: `${Math.round(size * 0.4)}px`,
        flexShrink: 0,
        userSelect: 'none',
      })}
    >
      {initials(name)}
    </span>
  )
}
