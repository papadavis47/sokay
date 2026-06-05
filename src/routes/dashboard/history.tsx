import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { goals, debits } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { HistoryView } from '@/components/history-view'
import { css } from 'styled-system/css'

const getHistoryData = createServerFn({ method: 'GET' }).handler(async () => {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw redirect({ to: '/login' })

  // Every goal the user has ever set — past and present. Data is never purged,
  // so completed goals remain browsable after the user moves on.
  const userGoals = await db.select()
    .from(goals)
    .where(eq(goals.userId, user.id))
    .orderBy(desc(goals.createdAt))

  const goalsWithDebits = await Promise.all(
    userGoals.map(async (goal) => {
      const goalDebits = await db.select()
        .from(debits)
        .where(eq(debits.goalId, goal.id))
        .orderBy(desc(debits.debitedAt))
      return { goal, debits: goalDebits }
    }),
  )

  return { goalsWithDebits }
})

export const Route = createFileRoute('/dashboard/history')({
  loader: () => getHistoryData(),
  component: HistoryPage,
})

function HistoryPage() {
  const { goalsWithDebits } = Route.useLoaderData()

  return (
    <div className={css({ maxW: '4xl', mx: 'auto' })}>
      <HistoryView goalsWithDebits={goalsWithDebits} />
    </div>
  )
}
