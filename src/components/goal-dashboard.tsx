import { useState } from 'react'
import { useRouter, Link } from '@tanstack/react-router'
import { css } from 'styled-system/css'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  DialogRoot,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { createDebit } from '@/server/debits'
import type { Goal, Debit } from '@/types/database'

interface GoalDashboardProps {
  goal: Goal
  debits: Debit[]
}

export function GoalDashboard({ goal, debits }: GoalDashboardProps) {
  const [foodName, setFoodName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const router = useRouter()

  const usedCredits = debits.length
  const remainingCredits = goal.totalCredits - usedCredits
  const percentageUsed = (usedCredits / goal.totalCredits) * 100

  const handleDebit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await createDebit({ data: { goalId: goal.id, foodName: foodName.trim() } })
      setFoodName('')
      setDialogOpen(false)
      router.invalidate()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: Date | null) => {
    if (!date) return ''
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getDaysRemaining = () => {
    const now = new Date()
    const end = goal.endDate
    const diffTime = end.getTime() - now.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const daysRemaining = getDaysRemaining()

  return (
    <div
      className={css({
        maxW: '4xl',
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '6',
      })}
    >
      <Card>
        <CardHeader>
          <CardTitle className={css({ fontSize: '3xl!' })}>Your Sokay Balance</CardTitle>
          <CardDescription>
            Goal period: {formatDate(goal.startDate)} - {formatDate(goal.endDate)} (
            {daysRemaining} days remaining)
          </CardDescription>
        </CardHeader>
        <CardBody className={css({ display: 'flex', flexDirection: 'column', gap: '6' })}>
          <div
            className={css({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            })}
          >
            <div className={css({ textAlign: 'center' })}>
              <div
                className={css({
                  fontSize: '6xl',
                  fontWeight: 'bold',
                  color: 'colorPalette.default',
                  mb: '2',
                })}
              >
                {remainingCredits}
              </div>
              <div className={css({ fontSize: 'xl', color: 'fg.muted' })}>
                credit{remainingCredits !== 1 ? 's' : ''} remaining
              </div>
              <div className={css({ fontSize: 'sm', color: 'fg.muted', mt: '2' })}>
                {usedCredits} of {goal.totalCredits} used
              </div>
            </div>
          </div>

          <div className={css({ display: 'flex', flexDirection: 'column', gap: '2' })}>
            <div
              className={css({
                w: 'full',
                bg: 'gray.a3',
                borderRadius: 'full',
                h: '4',
                overflow: 'hidden',
              })}
            >
              <div
                className={css({
                  h: 'full',
                  bg: 'colorPalette.solid.bg',
                  transition: 'all 0.3s',
                })}
                style={{ width: `${percentageUsed}%` }}
              />
            </div>
            <div
              className={css({
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 'xs',
                color: 'fg.muted',
              })}
            >
              <span>0</span>
              <span>{goal.totalCredits}</span>
            </div>
          </div>

          <DialogRoot open={dialogOpen} onOpenChange={(e) => setDialogOpen(e.open)}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className={css({ w: 'full' })}
                disabled={remainingCredits <= 0}
              >
                {remainingCredits > 0 ? 'Log an Item' : 'No Credits Remaining'}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Log an Item</DialogTitle>
              <DialogDescription className={css({ mb: '4' })}>
                What did you enjoy? Be honest—this is for you, not judgment.
              </DialogDescription>
              <form
                onSubmit={handleDebit}
                className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}
              >
                <div className={css({ display: 'flex', flexDirection: 'column', gap: '2' })}>
                  <Label htmlFor="foodName">Food or Drink</Label>
                  <Input
                    id="foodName"
                    placeholder="e.g., Ice cream, Soda, Cake..."
                    value={foodName}
                    onChange={(e) => setFoodName(e.target.value)}
                    required
                    disabled={loading}
                    autoFocus
                  />
                </div>

                {error && (
                  <div
                    className={css({
                      fontSize: 'sm',
                      color: 'red.11',
                      bg: 'red.a3',
                      p: '3',
                      borderRadius: 'l2',
                    })}
                  >
                    {error}
                  </div>
                )}

                <div
                  className={css({ display: 'flex', justifyContent: 'flex-end', gap: '2' })}
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Logging...' : 'Log Item'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </DialogRoot>
        </CardBody>
      </Card>

      {debits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your last few items</CardDescription>
          </CardHeader>
          <CardBody>
            <div className={css({ display: 'flex', flexDirection: 'column', gap: '3' })}>
              {debits.slice(0, 5).map((debit) => (
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
                  <span className={css({ fontWeight: 'medium' })}>{debit.foodName}</span>
                  <span className={css({ fontSize: 'sm', color: 'fg.muted' })}>
                    {formatDate(debit.debitedAt)}
                  </span>
                </div>
              ))}
            </div>
            {debits.length > 5 && (
              <Link
                to="/dashboard/history"
                className={css({
                  display: 'block',
                  textAlign: 'center',
                  mt: '4',
                  fontSize: 'sm',
                  color: 'colorPalette.default',
                  _hover: { textDecoration: 'underline' },
                })}
              >
                View all activity →
              </Link>
            )}
          </CardBody>
        </Card>
      )}

      <Card className={css({ bg: 'teal.a2!', borderColor: 'teal.a5!' })}>
        <CardBody className={css({ pt: '6' })}>
          <p
            className={css({
              textAlign: 'center',
              fontSize: 'lg',
              fontStyle: 'italic',
              color: 'fg.default',
            })}
          >
            {remainingCredits > goal.totalCredits * 0.5
              ? "You're doing great! Keep being mindful."
              : remainingCredits > 0
                ? "You've got this. Make each credit count."
                : 'Goal complete! Time to review your progress.'}
          </p>
        </CardBody>
      </Card>
    </div>
  )
}
