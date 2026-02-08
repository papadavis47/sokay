import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { createClient } from '@/lib/supabase/server'
import { HistoryView } from '@/components/history-view'
import { css } from 'styled-system/css'

const getHistoryData = createServerFn({ method: 'GET' }).handler(async () => {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw redirect({ to: '/login' })

  const { data: activeGoal } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  if (!activeGoal) {
    throw redirect({ to: '/dashboard' })
  }

  const { data: debits } = await supabase
    .from('debits')
    .select('*')
    .eq('goal_id', activeGoal.id)
    .order('debited_at', { ascending: false })

  return { goal: activeGoal, debits: debits || [] }
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
