import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { goals, debits } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { GoalSetupForm } from '@/components/goal-setup-form'
import { GoalDashboard } from '@/components/goal-dashboard'
import { css } from 'styled-system/css'

const getDashboardData = createServerFn({ method: 'GET' }).handler(async () => {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw redirect({ to: '/login' })

  const [reviewGoal] = await db.select()
    .from(goals)
    .where(and(eq(goals.userId, user.id), eq(goals.status, 'reviewing')))
    .limit(1)

  if (reviewGoal) {
    throw redirect({ to: '/goal/review/$id', params: { id: reviewGoal.id } })
  }

  const [activeGoal] = await db.select()
    .from(goals)
    .where(and(eq(goals.userId, user.id), eq(goals.status, 'active')))
    .limit(1)

  if (!activeGoal) {
    return { activeGoal: null, debits: [] }
  }

  // Time's up: the goal's window has closed. Move it into review so the
  // countdown stops and the user is prompted to wrap up and start fresh.
  if (activeGoal.endDate.getTime() <= Date.now()) {
    await db.update(goals)
      .set({ status: 'reviewing' })
      .where(and(eq(goals.id, activeGoal.id), eq(goals.userId, user.id)))
    throw redirect({ to: '/goal/review/$id', params: { id: activeGoal.id } })
  }

  const goalDebits = await db.select()
    .from(debits)
    .where(eq(debits.goalId, activeGoal.id))
    .orderBy(desc(debits.debitedAt))

  return { activeGoal, debits: goalDebits }
})

export const Route = createFileRoute('/dashboard/')({
  loader: () => getDashboardData(),
  component: DashboardPage,
})

function DashboardPage() {
  const { activeGoal, debits } = Route.useLoaderData()

  if (!activeGoal) {
    return (
      <div className={css({ maxW: '4xl', mx: 'auto' })}>
        <div className={css({ textAlign: 'center', mb: '8' })}>
          <h1 className={css({ fontSize: '4xl', fontWeight: 'bold', mb: '2', color: 'fg.default' })}>
            Welcome to Sokay!
          </h1>
          <p className={css({ fontSize: 'xl', color: 'fg.muted' })}>
            Let's set up your first goal
          </p>
        </div>
        <GoalSetupForm />
      </div>
    )
  }

  return <GoalDashboard goal={activeGoal} debits={debits} />
}
