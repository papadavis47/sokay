import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { createClient } from '@/lib/supabase/server'
import { GoalReview } from '@/components/goal-review'
import { css } from 'styled-system/css'

const getReviewData = createServerFn({ method: 'GET' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw redirect({ to: '/login' })

    const { data: goal } = await supabase
      .from('goals')
      .select('*')
      .eq('id', data.id)
      .eq('user_id', user.id)
      .single()

    if (!goal) {
      throw redirect({ to: '/dashboard' })
    }

    const { data: debits } = await supabase
      .from('debits')
      .select('*')
      .eq('goal_id', goal.id)
      .order('debited_at', { ascending: false })

    return { goal, debits: debits || [] }
  })

export const Route = createFileRoute('/goal/review/$id')({
  loader: ({ params }) => getReviewData({ data: { id: params.id } }),
  component: GoalReviewPage,
})

function GoalReviewPage() {
  const { goal, debits } = Route.useLoaderData()

  return (
    <div className={css({ maxW: '4xl', mx: 'auto', py: '8', px: '4' })}>
      <GoalReview goal={goal} debits={debits} />
    </div>
  )
}
