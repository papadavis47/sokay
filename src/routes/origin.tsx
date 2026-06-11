import { createFileRoute, getRouteApi } from '@tanstack/react-router'
import { css } from 'styled-system/css'
import { HomeNav } from '@/layout/home-nav'

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
        {/* Content coming soon: the fuller origin story lives here. */}
        <section
          className={css({
            maxW: '3xl',
            mx: 'auto',
            px: '4',
            py: { base: '12', md: '20' },
          })}
        >
          <h1
            className={css({
              fontSize: { base: '3xl', md: '4xl' },
              fontWeight: 'bold',
              letterSpacing: 'tight',
              color: 'fg.default',
            })}
          >
            The Origin Story
          </h1>
        </section>
      </main>
    </div>
  )
}
