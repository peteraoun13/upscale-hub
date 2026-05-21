import nodemailer from 'nodemailer'
import { resolve4 } from 'node:dns/promises'

const DEFAULT_ALLOWED_ORIGINS = [
  'https://upscale-hub.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173',
]
const LOCAL_DEV_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/

export function clean(value) {
  return String(value || '').trim()
}

export function cleanHeader(value) {
  return clean(value).replace(/[\r\n]+/g, ' ')
}

export function escapeHtml(value) {
  return clean(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\n/g, '<br>')
}

function allowedOrigins() {
  return (process.env.CORS_ALLOWED_ORIGINS || DEFAULT_ALLOWED_ORIGINS.join(','))
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean)
}

export function corsHeadersFromOrigin(origin) {
  const headers = new Headers({
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  })

  if (origin && (allowedOrigins().includes(origin) || LOCAL_DEV_ORIGIN.test(origin))) {
    headers.set('Access-Control-Allow-Origin', origin)
  }

  return headers
}

export function corsHeaders(request) {
  return corsHeadersFromOrigin(request?.headers?.get('origin'))
}

export function options(request) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(request),
  })
}

export function json(status, data, request) {
  return Response.json(data, {
    status,
    headers: corsHeaders(request),
  })
}

export async function getTransporter() {
  const configuredHost = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || 587)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS?.replace(/\s/g, '')

  if (!configuredHost || !user || !pass) {
    throw new Error('Missing SMTP_HOST, SMTP_USER, or SMTP_PASS environment variables.')
  }

  let host = configuredHost
  const tls = {}

  if (process.env.SMTP_FAMILY !== '6' && !/^\d+\.\d+\.\d+\.\d+$/.test(configuredHost)) {
    const [ipv4Host] = await resolve4(configuredHost)
    host = ipv4Host
    tls.servername = configuredHost
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    tls,
    auth: { user, pass },
  })
}

export async function sendMail(message) {
  if (process.env.EMAIL_DRY_RUN === 'true') {
    console.info('EMAIL_DRY_RUN=true, email was not sent:', {
      to: message.to,
      subject: message.subject,
    })
    return { accepted: [message.to], dryRun: true }
  }

  const transporter = await getTransporter()
  return transporter.sendMail(message)
}

export async function readNodeBody(req) {
  if (req.body) {
    if (Buffer.isBuffer(req.body)) return req.body
    return Buffer.from(typeof req.body === 'string' ? req.body : JSON.stringify(req.body))
  }

  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  return Buffer.concat(chunks)
}

export async function bridgeNodeRequest(req, res, route, handler) {
  const headers = new Headers()
  for (const [key, value] of Object.entries(req.headers || {})) {
    if (Array.isArray(value)) headers.set(key, value.join(', '))
    else if (value) headers.set(key, value)
  }

  const request = new Request(`http://localhost${route}`, {
    method: req.method,
    headers,
    body: await readNodeBody(req),
  })
  const response = await handler(request)

  res.statusCode = response.status
  response.headers.forEach((value, key) => {
    res.setHeader(key, value)
  })
  if (!response.headers.has('content-type')) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
  }
  res.end(await response.text())
}
