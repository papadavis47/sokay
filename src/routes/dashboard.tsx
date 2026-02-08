import { createFileRoute, Outlet } from '@tanstack/react-router'
import { DashboardNav } from '@/components/dashboard-nav'
import { requireUser } from '@/server/auth'
import { css } from 'styled-system/css'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    const user = await requireUser()
    return { user }
  },
  component: DashboardLayout,
})

function DashboardLayout() {
  const { user } = Route.useRouteContext()

  return (
    <div className={css({ minH: 'screen', bg: 'bg.canvas' })}>
      <DashboardNav user={user} />
      <main className={css({ maxW: '7xl', mx: 'auto', px: '4', py: '8' })}>
        <Outlet />
      </main>
    </div>
  )
}
