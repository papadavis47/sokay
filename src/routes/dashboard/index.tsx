import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { createClient } from '@/lib/supabase/server'
import { GoalSetupForm } from '@/components/goal-setup-form'
import { GoalDashboard } from '@/components/goal-dashboard'
import { css } from 'styled-system/css'

const getDashboardData = createServerFn({ method: 'GET' }).handler(async () => {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw redirect({ to: '/login' })

  const { data: reviewGoal } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'reviewing')
    .single()

  if (reviewGoal) {
    throw redirect({ to: '/goal/review/$id', params: { id: reviewGoal.id } })
  }

  const { data: activeGoal } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  if (!activeGoal) {
    return { activeGoal: null, debits: [] }
  }

  const { data: debits } = await supabase
    .from('debits')
    .select('*')
    .eq('goal_id', activeGoal.id)
    .order('debited_at', { ascending: false })

  return { activeGoal, debits: debits || [] }
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
