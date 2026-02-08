import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { createClient } from '@/lib/supabase/server'

export const createGoal = createServerFn({ method: 'POST' })
  .inputValidator((data: { totalCredits: number; durationMonths: number }) => data)
  .handler(async ({ data }) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw redirect({ to: '/login' })

    const startDate = new Date()
    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + data.durationMonths)

    const { error } = await supabase.from('goals').insert({
      user_id: user.id,
      total_credits: data.totalCredits,
      duration_months: data.durationMonths,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      status: 'active',
    })

    if (error) throw new Error(error.message)
    return { success: true }
  })

export const completeGoal = createServerFn({ method: 'POST' })
  .inputValidator((data: { goalId: string }) => data)
  .handler(async ({ data }) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw redirect({ to: '/login' })

    const { error } = await supabase
      .from('goals')
      .update({ status: 'completed' })
      .eq('id', data.goalId)
      .eq('user_id', user.id)

    if (error) throw new Error(error.message)
    return { success: true }
  })
