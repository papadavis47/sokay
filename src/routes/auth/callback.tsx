import { createFileRoute, redirect } from '@tanstack/react-router'
import { exchangeCode } from '@/auth/auth'

export const Route = createFileRoute('/auth/callback')({
  validateSearch: (search: Record<string, unknown>): { code?: string } => ({
    code: typeof search.code === 'string' ? search.code : undefined,
  }),
  beforeLoad: async ({ search }) => {
    if (!search.code) {
      throw redirect({ to: '/login' })
    }
    await exchangeCode({ data: search.code })
  },
  component: () => null,
})
