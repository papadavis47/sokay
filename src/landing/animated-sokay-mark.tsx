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
 * Implemented as two independent paths animated with **pure CSS keyframes**
 * (no JS/Motion). CSS is render-blocking and present at first paint, so the
 * draw begins the instant the SVG paints — it does not wait for the JS bundle
 * to download/parse or for React to hydrate. (The earlier Motion + useEffect
 * version couldn't start until after hydration, which on a cold first load
 * showed up as a ~1s lag before the ring began drawing.)
 *
 * Each path normalizes its length via `pathLength={1}` and uses
 * strokeDasharray 1 + an animated strokeDashoffset (1 → 0) to draw in.
 * Geometry mirrors `SokayMark` (128×128, center 64,64, r=40, 7:30 gap).
 * Color is inherited via `currentColor`.
 */

// Phase 1: top → clockwise → 6:40 (the break's lower edge).
const PATH_TOP_TO_BREAK = 'M64 24 A40 40 0 1 1 48.37 100.82'
// Phase 2: 8:20 (the break's upper edge) → clockwise → top.
const PATH_BREAK_TO_TOP = 'M27.18 79.63 A40 40 0 0 1 64 24'

// Timings (kept literal in the `animation` strings below because Panda
// extracts styles statically and can't evaluate runtime expressions):
//   phase 1 draw  = 2.4s
//   pause         = 0.8s  → phase 2 starts at 2.4 + 0.8 = 3.2s
//   phase 2 draw  = 1.5s
//   cap fade-in   = 0.5s  (eases the round cap's dot in so it never flashes)
const ANIM_PHASE_ONE =
  'sokayDraw 2.4s ease-in-out both, sokayCapFade 0.5s ease-in both'
const ANIM_PHASE_TWO =
  'sokayDraw 1.5s ease-in-out 3.2s both, sokayCapFade 0.5s ease-in 3.2s both'

const STROKE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 14,
  strokeLinecap: 'round',
  pathLength: 1,
} as const

export function AnimatedSokayMark() {
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
        {/* Phase 1: 12 o'clock → clockwise → the 7:30 break. Starts drawing at
            first paint; opacity eases in (slow start) so the round cap's dot is
            invisible until the stroke has grown into a moving line. */}
        <path
          d={PATH_TOP_TO_BREAK}
          {...STROKE}
          className={css({
            strokeDasharray: '1',
            // `both` so the from-state (hidden) holds before the keyframes run.
            animation: ANIM_PHASE_ONE,
          })}
        />
        {/* Phase 2: after the pause, the far side of the break → up → 12
            o'clock. While its delay elapses it sits fully offset (dash entirely
            in the gap), so nothing — not even a cap dot — renders. */}
        <path
          d={PATH_BREAK_TO_TOP}
          {...STROKE}
          className={css({
            strokeDasharray: '1',
            animation: ANIM_PHASE_TWO,
          })}
        />
      </svg>
    </div>
  )
}
