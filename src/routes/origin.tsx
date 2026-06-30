import { createFileRoute, getRouteApi } from '@tanstack/react-router'
import { css } from 'styled-system/css'
import { HomeNav } from '@/layout/home-nav'
import { OriginLead } from '@/origin/origin-lead'
import { SokayDefinition } from '@/origin/sokay-definition'
import { TurningPoint } from '@/origin/turning-point'
import { BiggerCurrent } from '@/origin/bigger-current'
import { HonestClaims } from '@/origin/honest-claims'
import { OriginCta } from '@/origin/origin-cta'

const rootApi = getRouteApi('__root__')

export const Route = createFileRoute('/origin')({
  component: OriginPage,
})

function OriginPage() {
  const { isLoggedIn } = rootApi.useLoaderData()

  return (
    <div className={css({ minH: 'screen', bg: 'bg.canvas' })}>
      <HomeNav isLoggedIn={isLoggedIn} />

      <main>
        <OriginLead />
        <SokayDefinition />
        <TurningPoint />
        <BiggerCurrent />
        <HonestClaims />
        <OriginCta isLoggedIn={isLoggedIn} />
      </main>
    </div>
  )
}
