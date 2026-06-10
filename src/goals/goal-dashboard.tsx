import { useState } from 'react'
import { useRouter, Link } from '@tanstack/react-router'
import { css } from 'styled-system/css'
import { Button } from 'design-system/button'
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardDescription,
} from 'design-system/card'
import { Input } from 'design-system/input'
import { Textarea } from 'design-system/textarea'
import { Label } from 'design-system/label'
import {
  DialogRoot,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from 'design-system/dialog'
import { createDebit } from '@/goals/debits'
import { startGoalReview } from '@/goals/goals'
import type { Goal, Debit } from '@/goals/types'

const NOTES_MAX_LENGTH = 250

interface GoalDashboardProps {
  goal: Goal
  debits: Debit[]
}

export function GoalDashboard({ goal, debits }: GoalDashboardProps) {
  const [foodName, setFoodName] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [endEarlyDialogOpen, setEndEarlyDialogOpen] = useState(false)
  const router = useRouter()

  const usedItems = debits.length
  const remainingItems = goal.totalItems - usedItems
  const percentageUsed = (usedItems / goal.totalItems) * 100

  const handleDebit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await createDebit({
        data: {
          goalId: goal.id,
          foodName: foodName.trim(),
          notes: notes.trim() || undefined,
        },
      })
      setFoodName('')
      setNotes('')
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
    // Never show a negative countdown — the window can't have "less than zero"
    // time left. An expired goal is moved to review on the next dashboard load.
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
  }

  const daysRemaining = getDaysRemaining()

  const handleStartOver = async () => {
    setError('')
    setLoading(true)
    try {
      await startGoalReview({ data: { goalId: goal.id } })
      router.navigate({ to: '/goal/review/$id', params: { id: goal.id } })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setLoading(false)
    }
  }

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
          <CardTitle
            className={css({
              fontSize: '2xl!',
              color: 'brand.solid',
              textTransform: 'uppercase',
            })}
          >
            sokay balance
          </CardTitle>
          <CardDescription>
            Goal period: {formatDate(goal.startDate)} -{' '}
            {formatDate(goal.endDate)} ({daysRemaining} days remaining)
          </CardDescription>
        </CardHeader>
        <CardBody
          className={css({
            display: 'flex',
            flexDirection: 'column',
            gap: '6',
          })}
        >
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
                  color: 'brand.solid',
                  mb: '2',
                })}
              >
                {remainingItems}
              </div>
              <div className={css({ fontSize: 'xl', color: 'fg.muted' })}>
                Item{remainingItems !== 1 ? 's' : ''} Remaining
              </div>
              <div
                className={css({ fontSize: 'sm', color: 'fg.muted', mt: '2' })}
              >
                {usedItems} of {goal.totalItems} used
              </div>
            </div>
          </div>

          <div
            className={css({
              display: 'flex',
              flexDirection: 'column',
              gap: '2',
            })}
          >
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
                fontSize: 'md',
                color: 'brand.solid',
              })}
            >
              <span>0</span>
              <span>{goal.totalItems}</span>
            </div>
          </div>

          {remainingItems <= 0 ? (
            <div
              className={css({
                bg: 'brand.subtle',
                borderWidth: '1px',
                borderColor: 'brand.border',
                borderRadius: 'l2',
                p: '4',
                display: 'flex',
                flexDirection: 'column',
                gap: '3',
                textAlign: 'center',
              })}
            >
              <p className={css({ fontWeight: 'semibold' })}>
                You've used all {goal.totalItems} of your sokay items
              </p>
              <p className={css({ fontSize: 'sm', color: 'fg.muted' })}>
                That's the limit working as intended—no more items can be logged
                this period. When you're ready, review how this round went and
                start a fresh goal.
              </p>
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
              <Button
                type="button"
                size="lg"
                onClick={handleStartOver}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Review & Start Over'}
              </Button>
            </div>
          ) : (
            <DialogRoot
              open={dialogOpen}
              onOpenChange={(e) => {
                setDialogOpen(e.open)
                if (!e.open) {
                  setFoodName('')
                  setNotes('')
                  setError('')
                }
              }}
            >
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className={css({
                    w: 'full',
                    color: 'brand.solid!',
                    borderWidth: '1px',
                    borderColor: 'brand.solid',
                    h: 'auto!',
                    py: '4',
                  })}
                >
                  Log an Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle className={css({ color: 'brand.solid!' })}>
                  Log an Item
                </DialogTitle>
                <DialogDescription className={css({ mb: '4', pt: '2' })}>
                  What did you eat? Be honest—this is for you, not judgment.
                </DialogDescription>
                <form
                  onSubmit={handleDebit}
                  className={css({
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4',
                  })}
                >
                  <div
                    className={css({
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2',
                    })}
                  >
                    <Label
                      htmlFor="foodName"
                      className={css({ color: 'brand.solid!' })}
                    >
                      Food or Drink
                    </Label>
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

                  <div
                    className={css({
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2',
                    })}
                  >
                    <div
                      className={css({
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      })}
                    >
                      <Label
                        htmlFor="notes"
                        className={css({ color: 'brand.solid!' })}
                      >
                        Notes (optional)
                      </Label>
                      <span
                        className={css({
                          fontSize: 'xs',
                          color:
                            notes.length > NOTES_MAX_LENGTH
                              ? 'red.11'
                              : 'fg.muted',
                        })}
                      >
                        {notes.length} / {NOTES_MAX_LENGTH}
                      </span>
                    </div>
                    <Textarea
                      id="notes"
                      placeholder="How were you feeling? What was the occasion?"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      maxLength={NOTES_MAX_LENGTH}
                      rows={3}
                      disabled={loading}
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
                    className={css({
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: '2',
                    })}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setDialogOpen(false)}
                      disabled={loading}
                      className={css({ color: 'brand.solid!' })}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className={css({ color: 'brand.solid!' })}
                    >
                      {loading ? 'Logging...' : 'Log Item'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </DialogRoot>
          )}

          {remainingItems > 0 && (
            <DialogRoot
              open={endEarlyDialogOpen}
              onOpenChange={(e) => {
                setEndEarlyDialogOpen(e.open)
                if (!e.open) setError('')
              }}
            >
              <DialogTrigger asChild>
                <button
                  type="button"
                  className={css({
                    alignSelf: 'flex-end',
                    fontSize: 'sm',
                    color: 'fg.subtle',
                    cursor: 'pointer',
                    bg: 'transparent',
                    _hover: { color: 'brand.mutedFg' },
                    _focusVisible: { color: 'brand.mutedFg' },
                  })}
                >
                  End goal early
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle className={css({ color: 'brand.solid!' })}>
                  End this goal early?
                </DialogTitle>
                <DialogDescription className={css({ mb: '4', pt: '2' })}>
                  You're in control. Ending now takes you to a review of this
                  goal, and from there you can start a fresh one with new
                  settings. Your logged items stay in your history.
                </DialogDescription>
                {error && (
                  <div
                    className={css({
                      fontSize: 'sm',
                      color: 'red.11',
                      bg: 'red.a3',
                      p: '3',
                      borderRadius: 'l2',
                      mb: '4',
                    })}
                  >
                    {error}
                  </div>
                )}
                <div
                  className={css({
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '2',
                  })}
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEndEarlyDialogOpen(false)}
                    disabled={loading}
                    className={css({ color: 'brand.solid!' })}
                  >
                    Keep going
                  </Button>
                  <Button
                    type="button"
                    onClick={handleStartOver}
                    disabled={loading}
                    className={css({ color: 'brand.solid!' })}
                  >
                    {loading ? 'Loading...' : 'End & Review'}
                  </Button>
                </div>
              </DialogContent>
            </DialogRoot>
          )}
        </CardBody>
      </Card>

      {debits.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your last few items</CardDescription>
          </CardHeader>
          <CardBody>
            <div
              className={css({
                display: 'flex',
                flexDirection: 'column',
                gap: '3',
              })}
            >
              {debits.slice(0, 5).map((debit) => (
                <div
                  key={debit.id}
                  className={css({
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '3',
                    p: '3',
                    borderRadius: 'l2',
                    bg: 'gray.a2',
                  })}
                >
                  <div
                    className={css({
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1',
                      minW: '0',
                    })}
                  >
                    <span className={css({ fontWeight: 'medium' })}>
                      {debit.foodName}
                    </span>
                    {debit.notes && (
                      <span
                        className={css({
                          fontSize: 'sm',
                          fontStyle: 'italic',
                          color: 'fg.muted',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                        })}
                      >
                        {debit.notes}
                      </span>
                    )}
                  </div>
                  <span
                    className={css({
                      fontSize: 'sm',
                      color: 'fg.muted',
                      whiteSpace: 'nowrap',
                    })}
                  >
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

      <Card
        className={css({ bg: 'brand.subtle!', borderColor: 'brand.border!' })}
      >
        <CardBody className={css({ pt: '6' })}>
          <p
            className={css({
              textAlign: 'center',
              fontSize: 'lg',
              fontStyle: 'italic',
              color: 'fg.default',
            })}
          >
            {remainingItems > goal.totalItems * 0.5
              ? "You're doing great!"
              : remainingItems > 0
                ? 'Progress, not perfection.'
                : 'Goal complete! Time to review your progress.'}
          </p>
        </CardBody>
      </Card>
    </div>
  )
}
