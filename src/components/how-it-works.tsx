import { css } from 'styled-system/css'
import { SokayMark } from '@/components/sokay-mark'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'

export function HowItWorks() {
  return (
    <div
      className={css({
        maxW: '7xl',
        mx: 'auto',
        px: '4',
        pb: { base: '6', md: '8' },
      })}
    >
      {/* Brand ring, centered above the quote */}
      <div
        className={css({
          display: 'flex',
          justifyContent: 'center',
          color: 'brand.solid',
          mb: { base: '6', md: '8' },
        })}
      >
        <SokayMark size={144} />
      </div>

      <blockquote
        className={css({
          textAlign: 'center',
          color: 'fg.default',
          fontSize: { base: '3xl', md: '5xl' },
          fontWeight: 'bold',
          letterSpacing: 'tight',
          lineHeight: 'tight',
          maxW: '3xl',
          mx: 'auto',
          textWrap: 'balance',
          mb: { base: '12', md: '16' },
        })}
      >
        Don't let perfection be the enemy of good
      </blockquote>

      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', md: 'repeat(3, 1fr)' },
          gap: '6',
        })}
      >
        <Card size="lg">
          <CardHeader>
            <CardTitle>Set Your Limit</CardTitle>
            <CardDescription>
              Choose 5-20 "sokay" items and choose your timeframe ( 1 month to 1
              year ). Most of what we sold in the Standard American Diet is not
              the ideal. Build awareness and keep trying.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card size="lg">
          <CardHeader>
            <CardTitle>Track Imperfections</CardTitle>
            <CardDescription>
              Log food items when you feel you have strayed from your ideal way
              of eating. Stay aware without judgment. Remember where you want to
              go - and stay realistic about the environment you live in.{' '}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card size="lg">
          <CardHeader>
            <CardTitle>Build In Forgiveness</CardTitle>
            <CardDescription>
              The process is about{' '}
              <span
                className={css({ color: 'fg.default', fontWeight: 'medium' })}
              >
                not
              </span>{' '}
              beating yourself up. The important thing is staying on the path.
              There will be ups and downs. Plan for them and anticipate falls.
              Simply pick yourself up and keep moving forward.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
