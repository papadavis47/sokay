// Minimal local runner for the *production* build, used to sanity-check
// prod-only behavior (e.g. CSS delivery / no dev stylesheet swap) that you
// can't observe under `vite dev`.
//
//   1. pnpm build
//   2. pnpm serve          (loads .env.local, serves dist/ on :3000)
//   3. hard-refresh http://localhost:3000  (DevTools open, "Disable cache")
//
// `vite build` emits a web-standard fetch handler (dist/server/server.js) plus
// static client assets (dist/client/**). In a real deploy the host serves the
// static dir and routes everything else to the handler — this script does the
// same thing locally with only Node built-ins.
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { join, extname, normalize } from 'node:path'
import { Readable } from 'node:stream'

const CLIENT_DIR = join(process.cwd(), 'dist/client')
const PORT = Number(process.env.PORT) || 3000

const { default: handler } = await import('./dist/server/server.js')

const MIME = {
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain',
}

async function tryStatic(pathname) {
  // Confine to dist/client (no path traversal) and require an existing file.
  const rel = normalize(pathname).replace(/^(\.\.[/\\])+/, '')
  const filePath = join(CLIENT_DIR, rel)
  if (!filePath.startsWith(CLIENT_DIR)) return null
  try {
    const s = await stat(filePath)
    if (!s.isFile()) return null
    return { body: await readFile(filePath), type: MIME[extname(filePath)] }
  } catch {
    return null
  }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`)

  // 1) Static client asset?
  const asset = await tryStatic(url.pathname)
  if (asset) {
    res.writeHead(200, {
      'content-type': asset.type ?? 'application/octet-stream',
    })
    res.end(asset.body)
    return
  }

  // 2) Otherwise hand off to the SSR fetch handler.
  const body =
    req.method === 'GET' || req.method === 'HEAD'
      ? undefined
      : Readable.toWeb(req)
  const request = new Request(url, {
    method: req.method,
    headers: req.headers,
    body,
    duplex: body ? 'half' : undefined,
  })
  const webRes = await handler.fetch(request)

  // Forward headers. `Set-Cookie` must be handled separately: a Headers object
  // combines multiple Set-Cookie values into one comma-joined string, which
  // corrupts Supabase's *chunked* auth cookies (the session is split across
  // several Set-Cookie headers). getSetCookie() returns them as a real array,
  // and Node's writeHead emits one Set-Cookie line per array entry.
  const outHeaders = {}
  for (const [k, v] of webRes.headers) {
    if (k.toLowerCase() !== 'set-cookie') outHeaders[k] = v
  }
  const setCookies = webRes.headers.getSetCookie?.() ?? []
  if (setCookies.length) outHeaders['set-cookie'] = setCookies

  res.writeHead(webRes.status, outHeaders)
  if (webRes.body) {
    Readable.fromWeb(webRes.body).pipe(res)
  } else {
    res.end()
  }
})

server.listen(PORT, () => {
  console.log(`prod build serving on http://localhost:${PORT}`)
})
