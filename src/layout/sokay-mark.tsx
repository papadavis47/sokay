interface SokayMarkProps {
  size?: number
  title?: string
}

/**
 * Sokay ring mark — open at 7:30 (progress, not perfection: the break sits
 * where a stumble lands, and the loop carries on past it).
 *
 * Color is inherited via `currentColor`, so set the color on the element (or a
 * wrapper) using the brand token and it adapts to light/dark automatically:
 *
 *   import { css } from 'styled-system/css'
 *   <span className={css({ color: 'brand.solid', display: 'inline-flex' })}>
 *     <SokayMark size={28} />
 *   </span>
 */
export function SokayMark({ size = 28, title = 'Sokay' }: SokayMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      fill="none"
      role="img"
      aria-label={title}
    >
      <path
        d="M27.18 79.63 A40 40 0 1 1 48.37 100.82"
        fill="none"
        stroke="currentColor"
        strokeWidth={14}
        strokeLinecap="round"
      />
    </svg>
  )
}
