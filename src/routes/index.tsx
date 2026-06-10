import { createFileRoute } from '@tanstack/react-router'
import { css } from 'styled-system/css'
import { HomeNav } from '@/layout/home-nav'
import { HeroSection } from '@/landing/hero-section'
import { HowItWorks } from '@/landing/how-it-works'
import { OriginStory } from '@/landing/origin-story'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className={css({ minH: 'screen', bg: 'bg.canvas' })}>
      <HomeNav />

      <main>
        <HeroSection />

        <HowItWorks />

        <OriginStory />
      </main>
    </div>
  )
}
