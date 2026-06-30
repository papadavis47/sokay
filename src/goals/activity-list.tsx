import { css } from 'styled-system/css'
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardDescription,
} from 'design-system/card'
import type { Debit } from '@/goals/types'

interface ActivityListProps {
  debits: Debit[]
}

const formatDate = (date: Date | null) => {
  if (!date) return ''
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Full, scrollable log of every item recorded during the current goal. The
 * list can hold up to the goal's whole allowance (100 at the extreme), so the
 * body scrolls internally rather than stretching the page. Each row carries a
 * brand accent so the section reads as part of the app's identity, not a plain
 * table.
 */
export function ActivityList({ debits }: ActivityListProps) {
  if (debits.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle css={{ color: 'brand.solid' }}>
          Activity During This Goal
        </CardTitle>
        <CardDescription>
          {debits.length} item{debits.length !== 1 ? 's' : ''} logged so far
        </CardDescription>
      </CardHeader>
      <CardBody>
        <div
          className={css({
            display: 'flex',
            flexDirection: 'column',
            gap: '3',
            // Cap the height so a long list (up to the goal's whole allowance)
            // scrolls inside the card instead of stretching the page.
            maxH: '480px',
            overflowY: 'auto',
            // Breathing room so rows don't sit under the scrollbar.
            pr: { base: '1', md: '2' },
          })}
        >
          {debits.map((debit) => (
            <div
              key={debit.id}
              className={css({
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '3',
                p: '3',
                pl: '4',
                borderRadius: 'l2',
                borderLeftWidth: '3px',
                borderLeftColor: 'brand.border',
                bg: 'gray.a2',
                transition: 'background 0.2s, border-color 0.2s',
                _hover: {
                  bg: 'brand.subtle',
                  borderLeftColor: 'brand.solid',
                },
              })}
            >
              <div
                className={css({
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '3',
                  minW: '0',
                })}
              >
                <span
                  aria-hidden
                  className={css({
                    flexShrink: '0',
                    w: '2',
                    h: '2',
                    mt: '2',
                    borderRadius: 'full',
                    bg: 'brand.solid',
                  })}
                />
                <div
                  className={css({
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1',
                    minW: '0',
                  })}
                >
                  <span className={css({ fontWeight: 'medium' })}>
                    {debit.foodName}
                  </span>
                  {debit.notes && (
                    <span
                      className={css({
                        fontSize: 'sm',
                        fontStyle: 'italic',
                        color: 'fg.muted',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      })}
                    >
                      {debit.notes}
                    </span>
                  )}
                </div>
              </div>
              <span
                className={css({
                  fontSize: 'sm',
                  color: 'fg.muted',
                  whiteSpace: 'nowrap',
                })}
              >
                {formatDate(debit.debitedAt)}
              </span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}
