import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { goals } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { DURATION_MAX, TOTAL_ITEMS_MIN, TOTAL_ITEMS_MAX } from '@/lib/duration'
import type { DurationUnit } from '@/types/database'

interface CreateGoalInput {
  totalItems: number
  durationValue: number
  durationUnit: DurationUnit
}

// Runs inside the handler (not inputValidator) so the bounds are enforced on
// every execution path, including direct server-side calls.
function validateGoalInput(data: CreateGoalInput) {
  if (
    !Number.isInteger(data.totalItems) ||
    data.totalItems < TOTAL_ITEMS_MIN ||
    data.totalItems > TOTAL_ITEMS_MAX
  ) {
    throw new Error(
      `Items must be a whole number between ${TOTAL_ITEMS_MIN} and ${TOTAL_ITEMS_MAX}.`,
    )
  }
  if (data.durationUnit !== 'week' && data.durationUnit !== 'month') {
    throw new Error('Duration must be in weeks or months.')
  }
  const max = DURATION_MAX[data.durationUnit]
  if (
    !Number.isInteger(data.durationValue) ||
    data.durationValue < 1 ||
    data.durationValue > max
  ) {
    throw new Error(
      `Duration must be between 1 and ${max} ${data.durationUnit}s.`,
    )
  }
}

export const createGoal = createServerFn({ method: 'POST' })
  .inputValidator((data: CreateGoalInput) => data)
  .handler(async ({ data }) => {
    validateGoalInput(data)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw redirect({ to: '/login' })

    const startDate = new Date()
    const endDate = new Date()
    if (data.durationUnit === 'week') {
      endDate.setDate(endDate.getDate() + data.durationValue * 7)
    } else {
      endDate.setMonth(endDate.getMonth() + data.durationValue)
    }

    await db.insert(goals).values({
      userId: user.id,
      totalItems: data.totalItems,
      durationValue: data.durationValue,
      durationUnit: data.durationUnit,
      startDate,
      endDate,
      status: 'active',
    })

    return { success: true }
  })

export const startGoalReview = createServerFn({ method: 'POST' })
  .inputValidator((data: { goalId: string }) => data)
  .handler(async ({ data }) => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw redirect({ to: '/login' })

    await db
      .update(goals)
      .set({ status: 'reviewing' })
      .where(and(eq(goals.id, data.goalId), eq(goals.userId, user.id)))

    return { success: true }
  })

export const completeGoal = createServerFn({ method: 'POST' })
  .inputValidator((data: { goalId: string }) => data)
  .handler(async ({ data }) => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw redirect({ to: '/login' })

    await db
      .update(goals)
      .set({ status: 'completed' })
      .where(and(eq(goals.id, data.goalId), eq(goals.userId, user.id)))

    return { success: true }
  })
