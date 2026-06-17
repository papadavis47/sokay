import { avatar } from 'styled-system/recipes'

type AvatarSize = 'sm' | 'md' | 'lg'

interface AvatarProps {
  src: string | null
  name: string | null | undefined
  size?: AvatarSize
}

function initials(name: string | null | undefined): string {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function Avatar({ src, name, size = 'sm' }: AvatarProps) {
  const styles = avatar({ size })

  if (src) {
    return <img src={src} alt={name ?? 'Avatar'} className={styles.image} />
  }

  return (
    <span aria-hidden="true" className={styles.fallback}>
      {initials(name)}
    </span>
  )
}
