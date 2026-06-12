import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { css } from 'styled-system/css'

/**
 * Large, animated Sokay ring for the top of the hero.
 *
 * It draws in two clockwise phases, both starting/ending at the top (12
 * o'clock), with a deliberate pause at the 7:30 break — the metaphor being
 * that a stumble (the break) doesn't stop you; the loop picks back up and
 * carries on:
 *
 *   1. 12 o'clock → clockwise down the right → the break's lower edge (6:40)
 *   2. pause
 *   3. the break's upper edge (8:20) → clockwise up the left → back to 12
 *
 * Implemented as two independent paths with a delay on the second, so the
 * sequencing (and the pause) is explicit rather than relying on a shared dash
 * offset. Geometry mirrors `SokayMark` (128×128, center 64,64, r=40, 7:30 gap).
 * Color is inherited via `currentColor`. The draw is gated on a client-side
 * `mounted` flag so it reliably replays on every full page load.
 */

// Phase 1: top → clockwise → 6:40 (the break's lower edge).
const PATH_TOP_TO_BREAK = 'M64 24 A40 40 0 1 1 48.37 100.82'
// Phase 2: 8:20 (the break's upper edge) → clockwise → top.
const PATH_BREAK_TO_TOP = 'M27.18 79.63 A40 40 0 0 1 64 24'

const PHASE_ONE = 2.4
const PAUSE = 0.8
const PHASE_TWO = 1.5

const STROKE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 14,
  strokeLinecap: 'round',
} as const

export function AnimatedSokayMark() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div
      aria-hidden
      className={css({
        color: 'brand.solid',
        w: { base: '108px', sm: '144px', md: '192px', lg: '260px' },
        h: { base: '108px', sm: '144px', md: '192px', lg: '260px' },
      })}
    >
      <svg
        viewBox="0 0 128 128"
        fill="none"
        className={css({ w: 'full', h: 'full' })}
      >
        {/* Phase 1: 12 o'clock → clockwise → the 7:30 break */}
        <motion.path
          d={PATH_TOP_TO_BREAK}
          {...STROKE}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: mounted ? 1 : 0 }}
          transition={{ duration: PHASE_ONE, ease: 'easeInOut' }}
        />
        {/* Phase 2: after a pause, the far side of the break → up → 12 o'clock.
            Kept invisible until its turn so the round line-cap doesn't show a
            stray dot at 8:20 during phase 1. */}
        <motion.path
          d={PATH_BREAK_TO_TOP}
          {...STROKE}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: mounted ? 1 : 0, opacity: mounted ? 1 : 0 }}
          transition={{
            pathLength: {
              duration: PHASE_TWO,
              ease: 'easeInOut',
              delay: PHASE_ONE + PAUSE,
            },
            opacity: { duration: 0.001, delay: PHASE_ONE + PAUSE },
          }}
        />
      </svg>
    </div>
  )
}
