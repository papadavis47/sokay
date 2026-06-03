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
import '@fontsource-variable/inter/index.css'
import '@/index.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'sokay' },
      { name: 'description', content: 'an application to improve eating habits' },
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
