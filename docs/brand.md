# Sokay brand assets

The canonical mark is an open ring with the gap at **7:30** — the break sits where a
stumble lands, and the loop continues past it ("progress, not perfection").

Brand orange sampled from the app: **`#FDBA74`** (dark-mode value of `brand.solid`).
The in-app glyph uses `currentColor`, so it tracks your `brand.solid` token across
light/dark. The favicon / launcher icons are baked onto a soft dark tile
(`#17130D`) because a hairline ring disappears on a home screen or a white tab.

## Files

### `src/` — in-app, theme-aware (color via `currentColor`)

| File             | Use                                                                 |
| ---------------- | ------------------------------------------------------------------- |
| `sokay-mark.tsx` | React component for the header lockup + hero. Inherits brand color. |
| `sokay-ring.svg` | Same glyph as a standalone SVG (transparent, `currentColor`).       |

### `public/` — static icons (served from site root)

| File                                                 | Use                                            |
| ---------------------------------------------------- | ---------------------------------------------- |
| `favicon.svg`                                        | Primary favicon (scalable dark tile).          |
| `favicon.ico`                                        | Legacy fallback (16/32/48).                    |
| `favicon-16x16.png` / `-32x32` / `-48x48` / `-96x96` | PNG favicons.                                  |
| `apple-touch-icon.png` (180)                         | iOS home screen.                               |
| `icon-192.png` / `icon-512.png`                      | PWA, `purpose: any`.                           |
| `icon-512-maskable.png`                              | PWA, `purpose: maskable` (safe-zone padded).   |
| `site.webmanifest`                                   | Web app manifest (references the icons above). |

## Wiring it up (TanStack Start)

1. Copy `public/*` into the project's `public/` directory.
2. Copy `src/sokay-mark.tsx` to `src/components/sokay-mark.tsx`.

### Head tags — add to `head()` in `src/routes/__root.tsx`

TanStack Start declares `<head>` via the route's `head()` (returning `links` / `meta`):

```ts
export const Route = createRootRoute({
  head: () => ({
    links: [
      { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      { rel: 'manifest', href: '/site.webmanifest' },
    ],
    meta: [
      // Scheme-aware so the mobile address bar tracks the page background.
      // (theme-color follows the OS scheme, not the in-app theme toggle.)
      {
        name: 'theme-color',
        media: '(prefers-color-scheme: light)',
        content: '#ffffff',
      },
      {
        name: 'theme-color',
        media: '(prefers-color-scheme: dark)',
        content: '#111111',
      },
    ],
  }),
  // ...existing component/loader
})
```

(If you already return `links`/`meta` from `head()`, merge these into the arrays.
This repo's `__root.tsx` is already wired this way.)

> **Note** — `theme-color` (`#111111`) matches the app's dark _page_ background
> (Park UI neutral canvas), which is intentionally distinct from the favicon
> _tile_ color (`#17130D`). They answer different questions: chrome vs. icon backdrop.

### Use the mark in the header lockup (`brand-mark.tsx`)

Place the ring to the left of the existing `sokay` / "Progress, not perfection" text,
colored with the brand token so it adapts to light/dark:

```tsx
import { css } from 'styled-system/css'
import { SokayMark } from '@/components/sokay-mark'

// inside the lockup, as the first child of a flex row (gap ~10px):
;<span className={css({ color: 'brand.solid', display: 'inline-flex' })}>
  <SokayMark size={28} />
</span>
```

For the hero, render `<SokayMark size={72} />` above the heading inside the same
`brand.solid`-colored wrapper.

## Tweaking later

- **Color**: change nothing in the glyph — it follows `brand.solid`. To retint the
  tiles, re-render from the source paths (orange `#FDBA74`, tile `#17130D`).
- **Stroke weight / gap position**: the path is `M27.18 79.63 A40 40 0 1 1 48.37 100.82`
  in a `0 0 128 128` viewBox, `stroke-width="14"`. Same path drives every asset.
