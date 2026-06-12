import { type ReactNode } from 'react'
import { motion } from 'motion/react'

interface FadeInProps {
  children: ReactNode
  /** Delay (seconds) before the fade begins — use for staggering siblings. */
  delay?: number
  /** Travel distance (px) the element rises as it fades in. */
  y?: number
  className?: string
}

/**
 * Scroll-reveal wrapper: fades + lifts its children into view the first time
 * they enter the viewport. Subtle by design (short distance, gentle easing) so
 * it reads as elegant polish rather than a flashy entrance.
 */
export function FadeIn({
  children,
  delay = 0,
  y = 16,
  className,
}: FadeInProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
