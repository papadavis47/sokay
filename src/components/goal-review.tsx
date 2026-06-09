import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { css } from 'styled-system/css'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { completeGoal } from '@/server/goals'
import type { Goal, Debit } from '@/types/database'

interface GoalReviewProps {
  goal: Goal
  debits: Debit[]
}

export function GoalReview({ goal, debits }: GoalReviewProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const usedItems = debits.length
  const remainingItems = goal.totalItems - usedItems
  const successRate = ((goal.totalItems - usedItems) / goal.totalItems) * 100

  const handleComplete = async () => {
    setLoading(true)
    try {
      await completeGoal({ data: { goalId: goal.id } })
      router.navigate({ to: '/dashboard' })
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: Date | null) => {
    if (!date) return ''
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getDurationLabel = (months: number) => {
    if (months === 1) return '1 month'
    if (months === 12) return '1 year'
    return `${months} months`
  }

  const getMessage = () => {
    if (successRate >= 80)
      return {
        title: 'Outstanding!',
        message:
          'You showed incredible discipline and mindfulness. You should be very proud of yourself!',
      }
    if (successRate >= 50)
      return {
        title: 'Great Job!',
        message:
          'You maintained good balance and stayed mindful of your choices. Keep it up!',
      }
    if (successRate >= 20)
      return {
        title: 'Good Effort!',
        message:
          "You completed the journey and learned about your habits. That's progress!",
      }
    return {
      title: 'You Finished!',
      message:
        'Completing a goal is an achievement in itself. Now you know what to work on next time.',
    }
  }

  const { title, message } = getMessage()

  return (
    <div
      className={css({ display: 'flex', flexDirection: 'column', gap: '6' })}
    >
      <div className={css({ textAlign: 'center' })}>
        <h1
          className={css({
            fontSize: '4xl',
            fontWeight: 'bold',
            mb: '2',
            color: 'fg.default',
          })}
        >
          Goal Complete!
        </h1>
        <p className={css({ fontSize: 'xl', color: 'fg.muted' })}>
          Review your progress
        </p>
      </div>

      <Card
        className={css({ bg: 'brand.subtle!', borderColor: 'brand.border!' })}
      >
        <CardHeader className={css({ textAlign: 'center' })}>
          <CardTitle className={css({ fontSize: '3xl!' })}>{title}</CardTitle>
          <CardDescription className={css({ fontSize: 'base!' })}>
            {message}
          </CardDescription>
        </CardHeader>
        <CardBody
          className={css({
            display: 'flex',
            flexDirection: 'column',
            gap: '6',
          })}
        >
          <div className={css({ textAlign: 'center' })}>
            <div
              className={css({
                fontSize: '6xl',
                fontWeight: 'bold',
                color: 'brand.solid',
                mb: '2',
              })}
            >
              {remainingItems}
            </div>
            <div className={css({ fontSize: 'xl', color: 'fg.muted' })}>
              items remaining out of {goal.totalItems}
            </div>
            <div
              className={css({ fontSize: 'sm', color: 'fg.muted', mt: '2' })}
            >
              {usedItems} items logged
            </div>
          </div>

          <div
            className={css({
              display: 'grid',
              gridTemplateColumns: { base: '1fr', md: 'repeat(3, 1fr)' },
              gap: '4',
            })}
          >
            <div
              className={css({
                bg: 'gray.a2',
                p: '4',
                borderRadius: 'l2',
                textAlign: 'center',
              })}
            >
              <div className={css({ fontSize: '2xl', fontWeight: 'bold' })}>
                {successRate.toFixed(0)}%
              </div>
              <div className={css({ fontSize: 'sm', color: 'fg.muted' })}>
                Items Saved
              </div>
            </div>
            <div
              className={css({
                bg: 'gray.a2',
                p: '4',
                borderRadius: 'l2',
                textAlign: 'center',
              })}
            >
              <div className={css({ fontSize: '2xl', fontWeight: 'bold' })}>
                {getDurationLabel(goal.durationMonths)}
              </div>
              <div className={css({ fontSize: 'sm', color: 'fg.muted' })}>
                Goal Duration
              </div>
            </div>
            <div
              className={css({
                bg: 'gray.a2',
                p: '4',
                borderRadius: 'l2',
                textAlign: 'center',
              })}
            >
              <div className={css({ fontSize: '2xl', fontWeight: 'bold' })}>
                {usedItems}
              </div>
              <div className={css({ fontSize: 'sm', color: 'fg.muted' })}>
                Items Logged
              </div>
            </div>
          </div>

          <div
            className={css({
              bg: 'gray.a2',
              p: '4',
              borderRadius: 'l2',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 'sm',
            })}
          >
            <div>
              <p className={css({ color: 'fg.muted' })}>Started</p>
              <p className={css({ fontWeight: 'medium' })}>
                {formatDate(goal.startDate)}
              </p>
            </div>
            <div className={css({ textAlign: 'right' })}>
              <p className={css({ color: 'fg.muted' })}>Ended</p>
              <p className={css({ fontWeight: 'medium' })}>
                {formatDate(goal.endDate)}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {debits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Items</CardTitle>
            <CardDescription>Your sokay items during this goal</CardDescription>
          </CardHeader>
          <CardBody>
            <div
              className={css({
                display: 'flex',
                flexDirection: 'column',
                gap: '2',
              })}
            >
              {debits.slice(0, 10).map((debit) => (
                <div
                  key={debit.id}
                  className={css({
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: '3',
                    borderRadius: 'l2',
                    bg: 'gray.a2',
                  })}
                >
                  <span className={css({ fontWeight: 'medium' })}>
                    {debit.foodName}
                  </span>
                  <span className={css({ fontSize: 'sm', color: 'fg.muted' })}>
                    {formatDate(debit.debitedAt)}
                  </span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardBody
          className={css({
            pt: '6',
            display: 'flex',
            flexDirection: 'column',
            gap: '4',
          })}
        >
          <p className={css({ textAlign: 'center', color: 'fg.muted' })}>
            Ready to start a new goal and continue your journey?
          </p>
          <Button
            onClick={handleComplete}
            size="lg"
            className={css({ w: 'full' })}
            disabled={loading}
          >
            {loading ? 'Completing...' : 'Complete Goal & Start Fresh'}
          </Button>
        </CardBody>
      </Card>
    </div>
  )
}
