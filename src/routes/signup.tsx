import { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { css } from 'styled-system/css'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardBody, CardTitle, CardDescription } from '@/components/ui/card'
import { getUser } from '@/server/auth'

export const Route = createFileRoute('/signup')({
  beforeLoad: async () => {
    const user = await getUser()
    if (user) {
      throw { redirect: { to: '/dashboard' } }
    }
  },
  component: SignupPage,
})

function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      navigate({ to: '/dashboard' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={css({
      minH: 'screen',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bg: 'bg.canvas',
      p: '4',
    })}>
      <Card className={css({ w: 'full', maxW: 'md' })}>
        <CardHeader className={css({ textAlign: 'center' })}>
          <CardTitle className={css({ fontSize: '2xl!', fontWeight: 'bold' })}>
            Join sokay
          </CardTitle>
          <CardDescription>Create an account to start your mindful eating journey</CardDescription>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSignup} className={css({ display: 'flex', flexDirection: 'column', gap: '4' })}>
            <div className={css({ display: 'flex', flexDirection: 'column', gap: '2' })}>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className={css({ display: 'flex', flexDirection: 'column', gap: '2' })}>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className={css({ display: 'flex', flexDirection: 'column', gap: '2' })}>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div className={css({
                fontSize: 'sm',
                color: 'red.11',
                bg: 'red.a3',
                p: '3',
                borderRadius: 'l2',
              })}>
                {error}
              </div>
            )}

            <Button type="submit" disabled={loading} className={css({ w: 'full' })}>
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <div className={css({ mt: '6', textAlign: 'center', fontSize: 'sm' })}>
            <span className={css({ color: 'fg.muted' })}>Already have an account? </span>
            <Link to="/login" className={css({ color: 'colorPalette.default', fontWeight: 'medium', _hover: { textDecoration: 'underline' } })}>
              Sign in
            </Link>
          </div>

          <div className={css({ mt: '4', textAlign: 'center' })}>
            <Link to="/" className={css({ fontSize: 'sm', color: 'fg.muted', _hover: { textDecoration: 'underline' } })}>
              ← Back to home
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
