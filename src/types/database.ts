import type { Goal, Debit } from '@/lib/db/schema'

export type GoalStatus = 'active' | 'completed' | 'reviewing'
export type DurationMonths = 1 | 2 | 3 | 6 | 12

export type { Goal, Debit }

export interface GoalWithDebits extends Goal {
  debits: Debit[]
  remainingItems: number
  usedItems: number
}
