import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { goals, debits } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'
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

    const [goal] = await db.select()
      .from(goals)
      .where(and(eq(goals.id, data.id), eq(goals.userId, user.id)))
      .limit(1)

    if (!goal) {
      throw redirect({ to: '/dashboard' })
    }

    const goalDebits = await db.select()
      .from(debits)
      .where(eq(debits.goalId, goal.id))
      .orderBy(desc(debits.debitedAt))

    return { goal, debits: goalDebits }
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
