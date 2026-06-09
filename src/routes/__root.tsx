/// <reference types="vite/client" />
import type { ReactNode } from 'react'
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'
import { css } from 'styled-system/css'
import { ThemeProvider } from '@/components/theme-provider'
import { Footer } from '@/components/footer'
import '@/index.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'sokay' },
      { name: 'description', content: 'an application to improve eating habits' },
      // Browser chrome color: track the app's page background per scheme.
      { name: 'theme-color', media: '(prefers-color-scheme: light)', content: '#ffffff' },
      { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#111111' },
    ],
    links: [
      { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      { rel: 'manifest', href: '/site.webmanifest' },
    ],
    scripts: [
      {
        children: `(function(){try{var t=localStorage.getItem('sokay-theme');if(t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
      },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          minH: '100dvh',
        })}
      >
        <div className={css({ flex: '1' })}>
          <Outlet />
        </div>
        <Footer />
      </div>
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
