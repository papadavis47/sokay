import type { Goal, Debit } from '@/lib/db/schema'

export type GoalStatus = 'active' | 'completed' | 'reviewing'
export type DurationUnit = 'week' | 'month'

export type { Goal, Debit }

export interface GoalWithDebits extends Goal {
  debits: Debit[]
  remainingItems: number
  usedItems: number
}
