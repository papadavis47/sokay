import { useState } from 'react'
import { createFileRoute, useRouter, useNavigate } from '@tanstack/react-router'
import { css } from 'styled-system/css'
import { getProfile, updateProfile } from '@/server/profiles'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardBody, CardTitle, CardDescription } from '@/components/ui/card'

export const Route = createFileRoute('/dashboard/settings')({
  loader: () => getProfile(),
  component: SettingsPage,
})

function SettingsPage() {
  const profile = Route.useLoaderData()
  const router = useRouter()
  const navigate = useNavigate()
  const [displayName, setDisplayName] = useState(profile?.displayName ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await updateProfile({ data: { displayName } })
      await router.invalidate()
      await navigate({ to: '/dashboard' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setSaving(false)
    }
  }

  return (
    <Card className={css({ maxW: 'lg', mx: 'auto' })}>
      <CardHeader>
        <CardTitle className={css({ fontSize: 'xl!', fontWeight: 'bold' })}>
          Profile settings
        </CardTitle>
        <CardDescription>Choose how your name appears in the app.</CardDescription>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}>
          <div className={css({ display: 'flex', flexDirection: 'column', gap: '2' })}>
            <Label htmlFor="displayName">Display name</Label>
            <Input
              id="displayName"
              type="text"
              placeholder="How should we greet you?"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={80}
              disabled={saving}
            />
          </div>

          {error && (
            <div className={css({ fontSize: 'sm', color: 'red.11', bg: 'red.a3', p: '3', borderRadius: 'l2' })}>
              {error}
            </div>
          )}

          <Button type="submit" disabled={saving || displayName.trim().length === 0} className={css({ alignSelf: 'flex-start' })}>
            {saving ? 'Saving...' : 'Save changes'}
          </Button>
        </form>
      </CardBody>
    </Card>
  )
}
