import { useState } from 'react'
import { useRouter } from '@tanstack/react-router'
import { css } from 'styled-system/css'
import { Button } from '@/components/ui/button'
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
import type { DurationMonths } from '@/types/database'

const durationCollection = createListCollection({
  items: [
    { label: '1 month', value: '1' },
    { label: '2 months', value: '2' },
    { label: '3 months', value: '3' },
    { label: '6 months', value: '6' },
    { label: '1 year', value: '12' },
  ],
})

export function GoalSetupForm() {
  const [credits, setCredits] = useState([10])
  const [duration, setDuration] = useState<DurationMonths>(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await createGoal({ data: { totalCredits: credits[0], durationMonths: duration } })
      router.invalidate()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getDurationLabel = (months: number) => {
    if (months === 1) return '1 month'
    if (months === 12) return '1 year'
    return `${months} months`
  }

  return (
    <Card className={css({ maxW: '2xl', mx: 'auto' })}>
      <CardHeader>
        <CardTitle className={css({ fontSize: '2xl!' })}>Set Your Sokay Goal</CardTitle>
        <CardDescription>
          Choose how many treats you'll allow yourself and for how long. Remember, this is
          about balance, not restriction.
        </CardDescription>
      </CardHeader>
      <CardBody>
        <form
          onSubmit={handleSubmit}
          className={css({ display: 'flex', flexDirection: 'column', gap: '8' })}
        >
          <div className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}>
            <div className={css({ display: 'flex', flexDirection: 'column', gap: '2' })}>
              <div
                className={css({
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                })}
              >
                <Label>Sokay Credits</Label>
                <span
                  className={css({
                    fontSize: '2xl',
                    fontWeight: 'bold',
                    color: 'colorPalette.default',
                  })}
                >
                  {credits[0]}
                </span>
              </div>
              <Slider
                value={credits}
                onValueChange={(e) => setCredits(e.value)}
                min={5}
                max={20}
                step={1}
              />
              <p className={css({ fontSize: 'sm', color: 'fg.muted' })}>
                You can enjoy up to {credits[0]} treat{credits[0] !== 1 ? 's' : ''} during
                your goal period.
              </p>
            </div>

            <div className={css({ display: 'flex', flexDirection: 'column', gap: '2' })}>
              <Label>Goal Duration</Label>
              <SelectRoot
                collection={durationCollection}
                value={[duration.toString()]}
                onValueChange={(e) =>
                  setDuration(parseInt(e.value[0]) as DurationMonths)
                }
              >
                <SelectTrigger>
                  <SelectValueText placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  {durationCollection.items.map((item) => (
                    <SelectItem key={item.value} item={item}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>
              <p className={css({ fontSize: 'sm', color: 'fg.muted' })}>
                Your goal will run for {getDurationLabel(duration)}.
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
              p: '4',
              borderRadius: 'l2',
              display: 'flex',
              flexDirection: 'column',
              gap: '2',
            })}
          >
            <p className={css({ fontSize: 'sm', fontWeight: 'medium' })}>Your Goal Summary</p>
            <p className={css({ fontSize: 'sm', color: 'fg.muted' })}>
              I will track my treats and limit myself to{' '}
              <strong>{credits[0]} sokay credits</strong> over the next{' '}
              <strong>{getDurationLabel(duration)}</strong>. I'm building a healthier
              relationship with food, one mindful choice at a time.
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
