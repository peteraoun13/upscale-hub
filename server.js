import { createReadStream, existsSync, readFileSync } from 'node:fs'
import { stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, join, normalize, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { OPTIONS as careersOptions, POST as careersPost } from './api/careers.js'
import { OPTIONS as contactOptions, POST as contactPost } from './api/contact.js'
import { bridgeNodeRequest } from './api/mail.js'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const DIST_DIR = resolve(__dirname, 'dist')

const API_ROUTES = {
  '/api/contact': {
    OPTIONS: contactOptions,
    POST: contactPost,
  },
  '/api/careers': {
    OPTIONS: careersOptions,
    POST: careersPost,
  },
}

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ttc': 'font/collection',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
}

function loadEnvFile(fileName) {
  const filePath = join(__dirname, fileName)
  if (!existsSync(filePath)) return

  const lines = readFileSync(filePath, 'utf8').split(/\r?\n/)
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue

    const separatorIndex = trimmed.indexOf('=')
    const key = trimmed.slice(0, separatorIndex).trim()
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '')

    if (key && process.env[key] === undefined) {
      process.env[key] = value
    }
  }
}

function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(data))
}

async function handleApi(req, res, pathname) {
  const route = API_ROUTES[pathname]
  const handler = route?.[req.method]

  if (!route) {
    sendJson(res, 404, { message: 'API route not found.' })
    return
  }

  if (!handler) {
    sendJson(res, 405, { message: 'Method not allowed.' })
    return
  }

  await bridgeNodeRequest(req, res, pathname, handler)
}

function safeStaticPath(pathname) {
  const requestedPath = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '')
  const filePath = resolve(join(DIST_DIR, requestedPath))

  if (!filePath.startsWith(DIST_DIR)) return null
  return filePath
}

async function serveStatic(req, res, pathname) {
  if (!existsSync(DIST_DIR)) {
    sendJson(res, 500, { message: 'Missing dist folder. Run npm run build first.' })
    return
  }

  const requestedFile = pathname === '/' ? join(DIST_DIR, 'index.html') : safeStaticPath(pathname)
  const fallbackFile = join(DIST_DIR, 'index.html')
  let filePath = requestedFile

  try {
    const fileStat = await stat(filePath)
    if (fileStat.isDirectory()) filePath = join(filePath, 'index.html')
  } catch {
    filePath = fallbackFile
  }

  const contentType = MIME_TYPES[extname(filePath)] || 'application/octet-stream'
  res.writeHead(200, { 'Content-Type': contentType })
  createReadStream(filePath).pipe(res)
}

loadEnvFile('.env')
loadEnvFile('.env.local')

const PORT = Number(process.env.PORT || 3001)

const server = createServer(async (req, res) => {
  try {
    const { pathname } = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`)

    if (pathname.startsWith('/api/')) {
      await handleApi(req, res, pathname)
      return
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      sendJson(res, 405, { message: 'Method not allowed.' })
      return
    }

    await serveStatic(req, res, pathname)
  } catch (error) {
    console.error('Server error:', error)
    sendJson(res, 500, { message: 'Internal server error.' })
  }
})

server.listen(PORT, () => {
  console.log(`Upscale Hub server running on http://localhost:${PORT}`)
})
