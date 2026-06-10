import type { DurationUnit } from '@/goals/types'

export const TOTAL_ITEMS_MIN = 1
export const TOTAL_ITEMS_MAX = 100

export const DURATION_MAX: Record<DurationUnit, number> = {
  week: 52,
  month: 12,
}

export function formatDuration(value: number, unit: DurationUnit) {
  if (unit === 'month' && value === 12) return '1 year'
  return `${value} ${unit}${value === 1 ? '' : 's'}`
}
