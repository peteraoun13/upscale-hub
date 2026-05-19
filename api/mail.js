import nodemailer from 'nodemailer'
import { resolve4 } from 'node:dns/promises'

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

export function json(status, data) {
  return Response.json(data, { status })
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
  res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json; charset=utf-8')
  res.end(await response.text())
}
