import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { css } from 'styled-system/css'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  DialogRoot,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { updateDebit, deleteDebit } from '@/server/debits'
import type { Goal, Debit } from '@/types/database'

const NOTES_MAX_LENGTH = 250

interface GoalWithDebits {
  goal: Goal
  debits: Debit[]
}

interface HistoryViewProps {
  goalsWithDebits: GoalWithDebits[]
}

const STATUS_LABELS: Record<Goal['status'], string> = {
  active: 'Active',
  reviewing: 'In review',
  completed: 'Completed',
}

export function HistoryView({ goalsWithDebits }: HistoryViewProps) {
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(
    goalsWithDebits[0]?.goal.id ?? null,
  )
  const [editingDebit, setEditingDebit] = useState<Debit | null>(null)
  const [foodName, setFoodName] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const selected =
    goalsWithDebits.find((g) => g.goal.id === selectedGoalId) ??
    goalsWithDebits[0] ??
    null

  const handleEdit = (debit: Debit) => {
    setEditingDebit(debit)
    setFoodName(debit.foodName)
    setNotes(debit.notes ?? '')
    setError('')
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingDebit) return
    setError('')
    setLoading(true)

    try {
      await updateDebit({
        data: {
          debitId: editingDebit.id,
          foodName: foodName.trim(),
          notes: notes.trim() || undefined,
        },
      })
      setEditingDebit(null)
      setFoodName('')
      setNotes('')
      router.invalidate()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (debitId: string) => {
    if (!confirm('Are you sure you want to remove this entry?')) return

    try {
      await deleteDebit({ data: { debitId } })
      router.invalidate()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const formatDateTime = (date: Date | null) => {
    if (!date) return ''
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const formatDate = (date: Date | null) => {
    if (!date) return ''
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (goalsWithDebits.length === 0) {
    return (
      <div
        className={css({ display: 'flex', flexDirection: 'column', gap: '6' })}
      >
        <div>
          <h1
            className={css({
              fontSize: '4xl',
              fontWeight: 'bold',
              mb: '2',
              color: 'brand.solid',
            })}
          >
            History
          </h1>
          <p className={css({ fontSize: 'xl', color: 'fg.muted' })}>
            Your past and present goals
          </p>
        </div>
        <Card>
          <CardBody
            className={css({ pt: '6', textAlign: 'center', color: 'fg.muted' })}
          >
            <p>You haven't set up any goals yet.</p>
          </CardBody>
        </Card>
      </div>
    )
  }

  return (
    <div
      className={css({ display: 'flex', flexDirection: 'column', gap: '6' })}
    >
      <div>
        <h1
          className={css({
            fontSize: '4xl',
            fontWeight: 'bold',
            mb: '2',
            color: 'brand.solid',
          })}
        >
          History
        </h1>
        <p className={css({ fontSize: 'xl', color: 'fg.muted' })}>
          Browse every goal you've tracked—past and present
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Goals</CardTitle>
          <CardDescription>
            {goalsWithDebits.length} goal
            {goalsWithDebits.length !== 1 ? 's' : ''} total
          </CardDescription>
        </CardHeader>
        <CardBody>
          <div
            className={css({
              display: 'flex',
              flexDirection: 'column',
              gap: '2',
            })}
          >
            {goalsWithDebits.map(({ goal, debits }) => {
              const used = debits.length
              const isSelected = selected?.goal.id === goal.id
              return (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() => setSelectedGoalId(goal.id)}
                  className={css({
                    textAlign: 'left',
                    p: '4',
                    borderRadius: 'l2',
                    borderWidth: '1px',
                    borderColor: isSelected ? 'brand.border' : 'border.default',
                    bg: isSelected ? 'brand.subtle' : 'gray.a2',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    _hover: { bg: isSelected ? 'brand.subtle' : 'gray.a3' },
                  })}
                >
                  <div
                    className={css({
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '3',
                    })}
                  >
                    <div
                      className={css({
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1',
                      })}
                    >
                      <span className={css({ fontWeight: 'medium' })}>
                        {formatDate(goal.startDate)} –{' '}
                        {formatDate(goal.endDate)}
                      </span>
                      <span
                        className={css({ fontSize: 'sm', color: 'fg.muted' })}
                      >
                        {used} of {goal.totalItems} items used
                      </span>
                    </div>
                    <span
                      className={css({
                        fontSize: 'xs',
                        fontWeight: 'medium',
                        px: '2',
                        py: '1',
                        borderRadius: 'full',
                        bg:
                          goal.status === 'active' ? 'brand.subtle' : 'gray.a3',
                        color:
                          goal.status === 'active' ? 'brand.solid' : 'fg.muted',
                        whiteSpace: 'nowrap',
                      })}
                    >
                      {STATUS_LABELS[goal.status]}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </CardBody>
      </Card>

      {selected && (
        <GoalEntries
          goal={selected.goal}
          debits={selected.debits}
          editable={selected.goal.status === 'active'}
          formatDateTime={formatDateTime}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <DialogRoot
        open={!!editingDebit}
        onOpenChange={(e) => {
          if (!e.open) {
            setEditingDebit(null)
            setFoodName('')
            setNotes('')
            setError('')
          }
        }}
      >
        <DialogContent>
          <DialogTitle>Edit Entry</DialogTitle>
          <DialogDescription className={css({ mb: '4' })}>
            Update what you had for this item
          </DialogDescription>
          <form
            onSubmit={handleSaveEdit}
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
              <Label htmlFor="editFoodName">Food or Drink</Label>
              <Input
                id="editFoodName"
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
                <Label htmlFor="editNotes">Notes (optional)</Label>
                <span
                  className={css({
                    fontSize: 'xs',
                    color:
                      notes.length > NOTES_MAX_LENGTH ? 'red.11' : 'fg.muted',
                  })}
                >
                  {notes.length} / {NOTES_MAX_LENGTH}
                </span>
              </div>
              <Textarea
                id="editNotes"
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
                onClick={() => {
                  setEditingDebit(null)
                  setFoodName('')
                  setNotes('')
                  setError('')
                }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </DialogRoot>
    </div>
  )
}

interface GoalEntriesProps {
  goal: Goal
  debits: Debit[]
  editable: boolean
  formatDateTime: (date: Date | null) => string
  onEdit: (debit: Debit) => void
  onDelete: (debitId: string) => void
}

function GoalEntries({
  goal,
  debits,
  editable,
  formatDateTime,
  onEdit,
  onDelete,
}: GoalEntriesProps) {
  const usedItems = debits.length
  const remainingItems = goal.totalItems - usedItems

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
          <CardDescription>
            {usedItems} of {goal.totalItems} items used · {remainingItems}{' '}
            remaining
          </CardDescription>
        </CardHeader>
      </Card>

      {debits.length === 0 ? (
        <Card>
          <CardBody
            className={css({ pt: '6', textAlign: 'center', color: 'fg.muted' })}
          >
            <p>No items are logged for this goal.</p>
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Entries</CardTitle>
            <CardDescription>{debits.length} total entries</CardDescription>
          </CardHeader>
          <CardBody>
            <div
              className={css({
                display: 'flex',
                flexDirection: 'column',
                gap: '2',
              })}
            >
              {debits.map((debit) => (
                <div
                  key={debit.id}
                  className={css({
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: '4',
                    borderRadius: 'l2',
                    bg: 'gray.a2',
                    _hover: { bg: 'gray.a3' },
                    transition: 'background-color 0.15s',
                  })}
                >
                  <div
                    className={css({
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1',
                      minW: '0',
                      flex: '1',
                    })}
                  >
                    <p className={css({ fontWeight: 'medium' })}>
                      {debit.foodName}
                    </p>
                    {debit.notes && (
                      <p
                        className={css({
                          fontSize: 'sm',
                          fontStyle: 'italic',
                          color: 'fg.default',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                        })}
                      >
                        {debit.notes}
                      </p>
                    )}
                    <p className={css({ fontSize: 'sm', color: 'fg.muted' })}>
                      {formatDateTime(debit.debitedAt)}
                    </p>
                  </div>
                  {editable && (
                    <div className={css({ display: 'flex', gap: '2' })}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(debit)}
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(debit.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </>
  )
}
