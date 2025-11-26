export type GoalStatus = 'active' | 'completed' | 'reviewing'
export type DurationMonths = 1 | 2 | 3 | 6 | 12

export interface Goal {
  id: string
  user_id: string
  total_credits: number
  duration_months: DurationMonths
  start_date: string
  end_date: string
  status: GoalStatus
  created_at: string
  updated_at: string
}

export interface Debit {
  id: string
  goal_id: string
  user_id: string
  food_name: string
  debited_at: string
  created_at: string
  updated_at: string
}

export interface GoalWithDebits extends Goal {
  debits: Debit[]
  remaining_credits: number
  used_credits: number
}
