import { createFileRoute, Link } from '@tanstack/react-router'
import { css } from 'styled-system/css'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardBody, CardTitle, CardDescription } from '@/components/ui/card'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className={css({ minH: 'screen', bg: 'bg.canvas' })}>
      <header className={css({
        borderBottomWidth: '1px',
        borderColor: 'border.default',
        bg: 'bg.default/95',
        backdropFilter: 'blur(8px)',
      })}>
        <div className={css({
          maxW: '7xl',
          mx: 'auto',
          px: '4',
          display: 'flex',
          h: '16',
          alignItems: 'center',
          justifyContent: 'space-between',
        })}>
          <h1 className={css({ fontSize: '2xl', fontWeight: 'bold', color: 'fg.default' })}>sokay</h1>
          <nav className={css({ display: 'flex', alignItems: 'center', gap: '3' })}>
            <Link to="/login">
              <Button variant="plain">Log in</Button>
            </Link>
            <Link to="/signup">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className={css({ maxW: '7xl', mx: 'auto', px: '4', py: '20' })}>
        <div className={css({ maxW: '4xl', mx: 'auto', textAlign: 'center' })}>
          <div className={css({ display: 'flex', flexDirection: 'column', gap: '4', mb: '8' })}>
            <h2 className={css({
              fontSize: { base: '4xl', md: '5xl' },
              fontWeight: 'bold',
              letterSpacing: 'tight',
              color: 'fg.default',
              lineHeight: 'tight',
            })}>
              It's okay to enjoy life
            </h2>
            <p className={css({
              fontSize: 'xl',
              color: 'fg.muted',
              maxW: '2xl',
              mx: 'auto',
            })}>
              Build a healthier relationship with food by tracking your treats mindfully.
              Set your own budget, stay accountable, and remember—perfection isn't the goal.
            </p>
          </div>

          <div className={css({ display: 'flex', justifyContent: 'center', gap: '4', mb: '16' })}>
            <Link to="/signup">
              <Button size="lg">Start Your Journey</Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">Log In</Button>
            </Link>
          </div>

          <div className={css({
            display: 'grid',
            gridTemplateColumns: { base: '1fr', md: 'repeat(3, 1fr)' },
            gap: '6',
            mb: '16',
          })}>
            <Card>
              <CardHeader>
                <CardTitle>Set Your Budget</CardTitle>
                <CardDescription>
                  Choose 5-20 "sokay" credits and a timeframe (1 month to 1 year)
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Track Mindfully</CardTitle>
                <CardDescription>
                  Log your treats when you indulge. Stay aware without judgment.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Build In Forgiveness</CardTitle>
                <CardDescription>
                  Life isn't about perfection. It's about balance and being kind to yourself.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className={css({ fontSize: '2xl!' })}>The Sokay Philosophy</CardTitle>
            </CardHeader>
            <CardBody className={css({ display: 'flex', flexDirection: 'column', gap: '4', color: 'fg.muted', textAlign: 'left' })}>
              <p>
                Your body thrives when you eat well 90% of the time. The other 10%?
                That's life—celebrations, cravings, moments of joy with ice cream or cake.
              </p>
              <p>
                Sokay helps you stay mindful of these moments without guilt. Set a realistic
                budget for your treats, track them honestly, and watch as you naturally build
                healthier habits while still enjoying the foods you love.
              </p>
              <p className={css({ fontWeight: 'medium', color: 'fg.default' })}>
                Remember: It's okay. You've got this.
              </p>
            </CardBody>
          </Card>
        </div>
      </main>
    </div>
  )
}
