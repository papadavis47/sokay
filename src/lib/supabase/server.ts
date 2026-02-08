import { createServerClient } from '@supabase/ssr'
import {
  getRequest,
  setResponseHeader,
} from '@tanstack/react-start/server'

export function createClient() {
  const request = getRequest()

  const supabase = createServerClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const cookieHeader = request.headers.get('cookie') ?? ''
          return cookieHeader.split(';').filter(Boolean).map((cookie) => {
            const [name, ...rest] = cookie.trim().split('=')
            return { name, value: rest.join('=') }
          })
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            const parts = [`${name}=${value}`]
            if (options?.path) parts.push(`Path=${options.path}`)
            if (options?.maxAge) parts.push(`Max-Age=${options.maxAge}`)
            if (options?.domain) parts.push(`Domain=${options.domain}`)
            if (options?.sameSite) parts.push(`SameSite=${options.sameSite}`)
            if (options?.httpOnly) parts.push('HttpOnly')
            if (options?.secure) parts.push('Secure')
            setResponseHeader('Set-Cookie', parts.join('; '))
          })
        },
      },
    },
  )

  return supabase
}
