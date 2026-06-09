import { useRef, useState } from 'react'
import { createFileRoute, useRouter, useNavigate } from '@tanstack/react-router'
import { css } from 'styled-system/css'
import { getProfile, updateProfile, updateAvatar } from '@/server/profiles'
import { createClient } from '@/lib/supabase/client'
import { Avatar } from '@/components/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'

export const Route = createFileRoute('/dashboard/settings')({
  loader: () => getProfile(),
  component: SettingsPage,
})

function extensionFor(file: File): string {
  const fromName = file.name.split('.').pop()?.toLowerCase()
  if (fromName && /^[a-z0-9]+$/.test(fromName)) return fromName
  return file.type.split('/').pop() ?? 'png'
}

function SettingsPage() {
  const profile = Route.useLoaderData()
  const router = useRouter()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [displayName, setDisplayName] = useState(profile?.displayName ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [avatarBusy, setAvatarBusy] = useState(false)
  const [avatarError, setAvatarError] = useState('')

  const userId = profile?.id ?? null
  const shownName = profile?.displayName ?? null

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

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    // Reset the input so picking the same file again re-triggers onChange.
    e.target.value = ''
    if (!file || !userId) return

    setAvatarError('')
    setAvatarBusy(true)
    try {
      const supabase = createClient()

      // Clear any previous avatar so changing file type leaves no orphans.
      const { data: existing } = await supabase.storage
        .from('avatars')
        .list(userId)
      if (existing?.length) {
        await supabase.storage
          .from('avatars')
          .remove(existing.map((f) => `${userId}/${f.name}`))
      }

      const path = `${userId}/avatar.${extensionFor(file)}`
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true, contentType: file.type })
      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(path)
      // Cache-bust so the new image shows immediately at the same path.
      await updateAvatar({
        data: { avatarUrl: `${publicUrl}?t=${Date.now()}` },
      })
      await router.invalidate()
    } catch (err) {
      setAvatarError(
        err instanceof Error ? err.message : 'Could not upload image',
      )
    } finally {
      setAvatarBusy(false)
    }
  }

  const handleAvatarRemove = async () => {
    if (!userId) return
    setAvatarError('')
    setAvatarBusy(true)
    try {
      const supabase = createClient()
      const { data: existing } = await supabase.storage
        .from('avatars')
        .list(userId)
      if (existing?.length) {
        await supabase.storage
          .from('avatars')
          .remove(existing.map((f) => `${userId}/${f.name}`))
      }
      await updateAvatar({ data: { avatarUrl: null } })
      await router.invalidate()
    } catch (err) {
      setAvatarError(
        err instanceof Error ? err.message : 'Could not remove image',
      )
    } finally {
      setAvatarBusy(false)
    }
  }

  return (
    <Card className={css({ maxW: 'lg', mx: 'auto' })}>
      <CardHeader>
        <CardTitle className={css({ fontSize: 'xl!', fontWeight: 'bold' })}>
          Profile settings
        </CardTitle>
        <CardDescription>Choose how you appear in the app.</CardDescription>
      </CardHeader>
      <CardBody>
        <div
          className={css({
            display: 'flex',
            flexDirection: 'column',
            gap: '6',
          })}
        >
          <div
            className={css({
              display: 'flex',
              flexDirection: 'column',
              gap: '2',
            })}
          >
            <Label>Avatar</Label>
            <div
              className={css({
                display: 'flex',
                alignItems: 'center',
                gap: '4',
              })}
            >
              <Avatar
                src={profile?.avatarUrl ?? null}
                name={shownName}
                size="lg"
              />
              <div
                className={css({
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2',
                })}
              >
                <div className={css({ display: 'flex', gap: '2' })}>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={avatarBusy || !userId}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {avatarBusy
                      ? 'Working...'
                      : profile?.avatarUrl
                        ? 'Change'
                        : 'Upload'}
                  </Button>
                  {profile?.avatarUrl && (
                    <Button
                      type="button"
                      variant="plain"
                      size="sm"
                      disabled={avatarBusy}
                      onClick={handleAvatarRemove}
                      className={css({ color: 'red.11' })}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <span className={css({ fontSize: 'xs', color: 'fg.muted' })}>
                  JPG, PNG, WebP or GIF, up to 2&nbsp;MB.
                </span>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleAvatarChange}
              className={css({ display: 'none' })}
            />
            {avatarError && (
              <div
                className={css({
                  fontSize: 'sm',
                  color: 'red.11',
                  bg: 'red.a3',
                  p: '3',
                  borderRadius: 'l2',
                })}
              >
                {avatarError}
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
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
              type="submit"
              disabled={saving || displayName.trim().length === 0}
              className={css({ alignSelf: 'flex-start' })}
            >
              {saving ? 'Saving...' : 'Save changes'}
            </Button>
          </form>
        </div>
      </CardBody>
    </Card>
  )
}
