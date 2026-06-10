import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { css } from 'styled-system/css'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  SelectRoot,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValueText,
  createListCollection,
} from '@/components/ui/select'
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { createGoal } from '@/server/goals'
import {
  DURATION_MAX,
  TOTAL_ITEMS_MIN,
  TOTAL_ITEMS_MAX,
  formatDuration,
} from '@/lib/duration'
import type { DurationUnit } from '@/types/database'

const durationCollections: Record<
  DurationUnit,
  ReturnType<typeof createListCollection<{ label: string; value: string }>>
> = {
  week: createListCollection({
    items: Array.from({ length: DURATION_MAX.week }, (_, i) => ({
      label: formatDuration(i + 1, 'week'),
      value: String(i + 1),
    })),
  }),
  month: createListCollection({
    items: Array.from({ length: DURATION_MAX.month }, (_, i) => ({
      label: formatDuration(i + 1, 'month'),
      value: String(i + 1),
    })),
  }),
}

export function GoalSetupForm() {
  const [items, setItems] = useState(10)
  const [itemsText, setItemsText] = useState('10')
  const [durationUnit, setDurationUnit] = useState<DurationUnit>('month')
  const [durationValue, setDurationValue] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const clampItems = (value: number) =>
    Math.min(TOTAL_ITEMS_MAX, Math.max(TOTAL_ITEMS_MIN, value))

  const handleSliderChange = (value: number) => {
    setItems(value)
    setItemsText(String(value))
  }

  const handleItemsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItemsText(e.target.value)
    const parsed = parseInt(e.target.value, 10)
    if (!Number.isNaN(parsed)) setItems(clampItems(parsed))
  }

  const handleItemsInputBlur = () => setItemsText(String(items))

  const handleUnitChange = (unit: DurationUnit) => {
    setDurationUnit(unit)
    // Keep the chosen value where possible; clamp to the new unit's range.
    setDurationValue((value) => Math.min(value, DURATION_MAX[unit]))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await createGoal({
        data: { totalItems: items, durationValue, durationUnit },
      })
      router.invalidate()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const collection = durationCollections[durationUnit]

  return (
    <Card className={css({ maxW: '2xl', mx: 'auto' })}>
      <CardHeader>
        <CardTitle className={css({ fontSize: '2xl!' })}>
          Set Your Sokay Goal
        </CardTitle>
        <CardDescription className={css({ lineHeight: 'relaxed' })}>
          <span className={css({ display: 'block' })}>
            Choose how many items you'll allow yourself and for how long.
          </span>
          <span className={css({ display: 'block', mt: '2' })}>
            Remember, this is about balance, not restriction.
          </span>
        </CardDescription>
      </CardHeader>
      <CardBody>
        <form
          onSubmit={handleSubmit}
          className={css({
            display: 'flex',
            flexDirection: 'column',
            gap: '8',
          })}
        >
          <div
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
              <div
                className={css({
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                })}
              >
                <Label htmlFor="totalItems">Sokay Items</Label>
                <Input
                  id="totalItems"
                  type="number"
                  inputMode="numeric"
                  min={TOTAL_ITEMS_MIN}
                  max={TOTAL_ITEMS_MAX}
                  value={itemsText}
                  onChange={handleItemsInputChange}
                  onBlur={handleItemsInputBlur}
                  className={css({
                    w: '24',
                    textAlign: 'center',
                    fontSize: 'xl',
                    fontWeight: 'bold',
                    color: 'colorPalette.default',
                  })}
                />
              </div>
              <Slider
                value={[items]}
                onValueChange={(e) => handleSliderChange(e.value[0])}
                min={TOTAL_ITEMS_MIN}
                max={TOTAL_ITEMS_MAX}
                step={1}
              />
              <p className={css({ fontSize: 'sm', color: 'fg.muted' })}>
                You can use up to {items} item
                {items !== 1 ? 's' : ''} during your goal period. Pick anywhere
                from {TOTAL_ITEMS_MIN} to {TOTAL_ITEMS_MAX}.
              </p>
            </div>

            <div
              className={css({
                display: 'flex',
                flexDirection: 'column',
                gap: '2',
              })}
            >
              <Label>Goal Duration</Label>
              <div className={css({ display: 'flex', gap: '2' })}>
                <Button
                  type="button"
                  variant={durationUnit === 'week' ? 'solid' : 'outline'}
                  className={css({ flex: '1' })}
                  onClick={() => handleUnitChange('week')}
                >
                  Weeks
                </Button>
                <Button
                  type="button"
                  variant={durationUnit === 'month' ? 'solid' : 'outline'}
                  className={css({ flex: '1' })}
                  onClick={() => handleUnitChange('month')}
                >
                  Months
                </Button>
              </div>
              <SelectRoot
                key={durationUnit}
                collection={collection}
                value={[durationValue.toString()]}
                onValueChange={(e) => setDurationValue(parseInt(e.value[0]))}
              >
                <SelectTrigger>
                  <SelectValueText placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  {collection.items.map((item) => (
                    <SelectItem key={item.value} item={item}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>
              <p className={css({ fontSize: 'sm', color: 'fg.muted' })}>
                Your goal will run for{' '}
                {formatDuration(durationValue, durationUnit)}.
              </p>
            </div>
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
              bg: 'gray.a2',
              p: '5',
              borderRadius: 'l2',
              display: 'flex',
              flexDirection: 'column',
              gap: '3',
            })}
          >
            <p className={css({ fontSize: 'sm', fontWeight: 'medium' })}>
              Your Goal Summary
            </p>
            <p
              className={css({
                fontSize: 'sm',
                color: 'fg.muted',
                lineHeight: 'relaxed',
              })}
            >
              I will track my items and limit myself to{' '}
              <strong>
                {items} sokay item{items !== 1 ? 's' : ''}
              </strong>{' '}
              over the next{' '}
              <strong>{formatDuration(durationValue, durationUnit)}</strong>.
            </p>
            <p
              className={css({
                fontSize: 'sm',
                color: 'fg.muted',
                lineHeight: 'relaxed',
              })}
            >
              I'm building a healthier relationship with food.
            </p>
            <p
              className={css({
                fontSize: 'sm',
                color: 'fg.muted',
                lineHeight: 'relaxed',
              })}
            >
              One mindful choice at a time.
            </p>
          </div>

          <Button
            type="submit"
            size="lg"
            className={css({ w: 'full' })}
            disabled={loading}
          >
            {loading ? 'Creating goal...' : 'Start My Journey'}
          </Button>
        </form>
      </CardBody>
    </Card>
  )
}
