import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { createClient } from '@/lib/supabase/server'

export const getUser = createServerFn({ method: 'GET' }).handler(async () => {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
})

export const requireUser = createServerFn({ method: 'GET' }).handler(async () => {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw redirect({ to: '/login' })
  }
  return user
})

export const logout = createServerFn({ method: 'POST' }).handler(async () => {
  const supabase = createClient()
  await supabase.auth.signOut()
  throw redirect({ to: '/' })
})
