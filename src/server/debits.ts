import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { debits } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export const createDebit = createServerFn({ method: 'POST' })
  .inputValidator((data: { goalId: string; foodName: string }) => data)
  .handler(async ({ data }) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw redirect({ to: '/login' })

    await db.insert(debits).values({
      goalId: data.goalId,
      userId: user.id,
      foodName: data.foodName,
    })

    return { success: true }
  })

export const updateDebit = createServerFn({ method: 'POST' })
  .inputValidator((data: { debitId: string; foodName: string }) => data)
  .handler(async ({ data }) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw redirect({ to: '/login' })

    await db.update(debits)
      .set({ foodName: data.foodName })
      .where(and(eq(debits.id, data.debitId), eq(debits.userId, user.id)))

    return { success: true }
  })

export const deleteDebit = createServerFn({ method: 'POST' })
  .inputValidator((data: { debitId: string }) => data)
  .handler(async ({ data }) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw redirect({ to: '/login' })

    await db.delete(debits)
      .where(and(eq(debits.id, data.debitId), eq(debits.userId, user.id)))

    return { success: true }
  })
