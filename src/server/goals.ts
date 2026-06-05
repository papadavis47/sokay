import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { goals } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export const createGoal = createServerFn({ method: 'POST' })
  .inputValidator((data: { totalCredits: number; durationMonths: number }) => data)
  .handler(async ({ data }) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw redirect({ to: '/login' })

    const startDate = new Date()
    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + data.durationMonths)

    await db.insert(goals).values({
      userId: user.id,
      totalCredits: data.totalCredits,
      durationMonths: data.durationMonths,
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
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw redirect({ to: '/login' })

    await db.update(goals)
      .set({ status: 'reviewing' })
      .where(and(eq(goals.id, data.goalId), eq(goals.userId, user.id)))

    return { success: true }
  })

export const completeGoal = createServerFn({ method: 'POST' })
  .inputValidator((data: { goalId: string }) => data)
  .handler(async ({ data }) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw redirect({ to: '/login' })

    await db.update(goals)
      .set({ status: 'completed' })
      .where(and(eq(goals.id, data.goalId), eq(goals.userId, user.id)))

    return { success: true }
  })
