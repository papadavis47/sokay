import { createFileRoute, getRouteApi } from '@tanstack/react-router'
import { css } from 'styled-system/css'
import { HomeNav } from '@/layout/home-nav'
import { HeroSection } from '@/landing/hero-section'
import { HowItWorks } from '@/landing/how-it-works'
import { OriginStory } from '@/landing/origin-story'

const rootApi = getRouteApi('__root__')

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const { isLoggedIn } = rootApi.useLoaderData()

  return (
    <div className={css({ minH: 'screen', bg: 'bg.canvas' })}>
      <HomeNav isLoggedIn={isLoggedIn} />

      <main>
        <HeroSection isLoggedIn={isLoggedIn} />

        <HowItWorks />

        <OriginStory />
      </main>
    </div>
  )
}
