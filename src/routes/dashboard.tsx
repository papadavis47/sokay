import { createFileRoute, Outlet } from '@tanstack/react-router'
import { DashboardNav } from '@/layout/dashboard-nav'
import { requireUser } from '@/auth/auth'
import { getProfile } from '@/profile/profiles'
import { css } from 'styled-system/css'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    const user = await requireUser()
    return { user }
  },
  loader: () => getProfile(),
  component: DashboardLayout,
})

function DashboardLayout() {
  const { user } = Route.useRouteContext()
  const profile = Route.useLoaderData()

  return (
    <div className={css({ minH: 'screen', bg: 'bg.canvas' })}>
      <DashboardNav
        user={user}
        displayName={profile?.displayName ?? null}
        avatarUrl={profile?.avatarUrl ?? null}
      />
      <main className={css({ maxW: '7xl', mx: 'auto', px: '4', py: '8' })}>
        <Outlet />
      </main>
    </div>
  )
}
