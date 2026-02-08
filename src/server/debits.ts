import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { createClient } from '@/lib/supabase/server'

export const createDebit = createServerFn({ method: 'POST' })
  .inputValidator((data: { goalId: string; foodName: string }) => data)
  .handler(async ({ data }) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw redirect({ to: '/login' })

    const { error } = await supabase.from('debits').insert({
      goal_id: data.goalId,
      user_id: user.id,
      food_name: data.foodName,
    })

    if (error) throw new Error(error.message)
    return { success: true }
  })

export const updateDebit = createServerFn({ method: 'POST' })
  .inputValidator((data: { debitId: string; foodName: string }) => data)
  .handler(async ({ data }) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw redirect({ to: '/login' })

    const { error } = await supabase
      .from('debits')
      .update({ food_name: data.foodName })
      .eq('id', data.debitId)
      .eq('user_id', user.id)

    if (error) throw new Error(error.message)
    return { success: true }
  })

export const deleteDebit = createServerFn({ method: 'POST' })
  .inputValidator((data: { debitId: string }) => data)
  .handler(async ({ data }) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw redirect({ to: '/login' })

    const { error } = await supabase
      .from('debits')
      .delete()
      .eq('id', data.debitId)
      .eq('user_id', user.id)

    if (error) throw new Error(error.message)
    return { success: true }
  })
