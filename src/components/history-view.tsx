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
import { Label } from '@/components/ui/label'
import {
  DialogRoot,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { updateDebit, deleteDebit } from '@/server/debits'
import type { Goal, Debit } from '@/types/database'

interface HistoryViewProps {
  goal: Goal
  debits: Debit[]
}

export function HistoryView({ goal, debits }: HistoryViewProps) {
  const [editingDebit, setEditingDebit] = useState<Debit | null>(null)
  const [foodName, setFoodName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleEdit = (debit: Debit) => {
    setEditingDebit(debit)
    setFoodName(debit.foodName)
    setError('')
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingDebit) return
    setError('')
    setLoading(true)

    try {
      await updateDebit({
        data: { debitId: editingDebit.id, foodName: foodName.trim() },
      })
      setEditingDebit(null)
      setFoodName('')
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

  const formatDate = (date: Date | null) => {
    if (!date) return ''
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const usedCredits = debits.length
  const remainingCredits = goal.totalCredits - usedCredits

  return (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: '6' })}>
      <div>
        <h1
          className={css({
            fontSize: '4xl',
            fontWeight: 'bold',
            mb: '2',
            color: 'fg.default',
          })}
        >
          History
        </h1>
        <p className={css({ fontSize: 'xl', color: 'fg.muted' })}>
          All your tracked items for the current goal
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
          <CardDescription>
            {usedCredits} of {goal.totalCredits} credits used · {remainingCredits}{' '}
            remaining
          </CardDescription>
        </CardHeader>
      </Card>

      {debits.length === 0 ? (
        <Card>
          <CardBody
            className={css({ pt: '6', textAlign: 'center', color: 'fg.muted' })}
          >
            <p>No items logged yet. You're doing great!</p>
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Entries</CardTitle>
            <CardDescription>{debits.length} total entries</CardDescription>
          </CardHeader>
          <CardBody>
            <div className={css({ display: 'flex', flexDirection: 'column', gap: '2' })}>
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
                  <div>
                    <p className={css({ fontWeight: 'medium' })}>{debit.foodName}</p>
                    <p className={css({ fontSize: 'sm', color: 'fg.muted' })}>
                      {formatDate(debit.debitedAt)}
                    </p>
                  </div>
                  <div className={css({ display: 'flex', gap: '2' })}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(debit)}
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(debit.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      <DialogRoot
        open={!!editingDebit}
        onOpenChange={(e) => !e.open && setEditingDebit(null)}
      >
        <DialogContent>
          <DialogTitle>Edit Entry</DialogTitle>
          <DialogDescription className={css({ mb: '4' })}>
            Update what you had for this item
          </DialogDescription>
          <form
            onSubmit={handleSaveEdit}
            className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}
          >
            <div className={css({ display: 'flex', flexDirection: 'column', gap: '2' })}>
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
                onClick={() => setEditingDebit(null)}
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
