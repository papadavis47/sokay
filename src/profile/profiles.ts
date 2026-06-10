import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { profiles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export const getProfile = createServerFn({ method: 'GET' }).handler(
  async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw redirect({ to: '/login' })

    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, user.id))
      .limit(1)

    return profile ?? null
  },
)

export const updateProfile = createServerFn({ method: 'POST' })
  .inputValidator((data: { displayName: string }) => data)
  .handler(async ({ data }) => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw redirect({ to: '/login' })

    const displayName = data.displayName.trim()
    if (displayName.length === 0 || displayName.length > 80) {
      throw new Error('Display name must be between 1 and 80 characters.')
    }

    await db
      .update(profiles)
      .set({ displayName })
      .where(eq(profiles.id, user.id))

    return { success: true }
  })

export const updateAvatar = createServerFn({ method: 'POST' })
  .inputValidator((data: { avatarUrl: string | null }) => data)
  .handler(async ({ data }) => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw redirect({ to: '/login' })

    await db
      .update(profiles)
      .set({ avatarUrl: data.avatarUrl })
      .where(eq(profiles.id, user.id))

    return { success: true }
  })
