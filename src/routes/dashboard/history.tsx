import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { goals, debits } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { HistoryView } from '@/components/history-view'
import { css } from 'styled-system/css'

const getHistoryData = createServerFn({ method: 'GET' }).handler(async () => {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw redirect({ to: '/login' })

  const [activeGoal] = await db.select()
    .from(goals)
    .where(and(eq(goals.userId, user.id), eq(goals.status, 'active')))
    .limit(1)

  if (!activeGoal) {
    throw redirect({ to: '/dashboard' })
  }

  const goalDebits = await db.select()
    .from(debits)
    .where(eq(debits.goalId, activeGoal.id))
    .orderBy(desc(debits.debitedAt))

  return { goal: activeGoal, debits: goalDebits }
})

export const Route = createFileRoute('/dashboard/history')({
  loader: () => getHistoryData(),
  component: HistoryPage,
})

function HistoryPage() {
  const { goal, debits } = Route.useLoaderData()

  return (
    <div className={css({ maxW: '4xl', mx: 'auto' })}>
      <HistoryView goal={goal} debits={debits} />
    </div>
  )
}
