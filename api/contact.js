import {
  bridgeNodeRequest,
  clean,
  cleanHeader,
  escapeHtml,
  getTransporter,
  json,
} from './mail.js'

const TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'peteraoun2013@gmail.com'
const REQUIRED_FIELDS = ['fullName', 'institution', 'phone', 'email']

function validate(payload) {
  const errors = {}

  for (const field of REQUIRED_FIELDS) {
    if (!clean(payload[field])) {
      errors[field] = 'This field is required.'
    }
  }

  if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean(payload.email))) {
    errors.email = 'Enter a valid email address.'
  }

  if (payload.phone && !/^\+?[\d\s\-()]{6,}$/.test(clean(payload.phone))) {
    errors.phone = 'Enter a valid phone number.'
  }

  return errors
}

async function verifyRecaptcha(token) {
  const secret = process.env.RECAPTCHA_SECRET_KEY

  if (!secret) {
    throw new Error('Missing RECAPTCHA_SECRET_KEY environment variable.')
  }

  if (!clean(token)) return false

  const body = new URLSearchParams({
    secret,
    response: token,
  })

  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  })
  const result = await response.json()

  return Boolean(result.success)
}

function buildMessage(data) {
  const submittedAt = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Beirut',
  })

  return {
    subject: `New contact request from ${cleanHeader(data.fullName)}`,
    text: [
      `Full name: ${data.fullName}`,
      `Institution: ${data.institution}`,
      `Phone: ${data.phone}`,
      `Industry: ${data.industry || 'Not provided'}`,
      `Email: ${data.email}`,
      `Description: ${data.description || 'Not provided'}`,
      `Submitted at: ${submittedAt}`,
    ].join('\n'),
    html: `
      <h2>New contact request</h2>
      <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;">
        <tr><td><strong>Full name</strong></td><td>${escapeHtml(data.fullName)}</td></tr>
        <tr><td><strong>Institution</strong></td><td>${escapeHtml(data.institution)}</td></tr>
        <tr><td><strong>Phone</strong></td><td>${escapeHtml(data.phone)}</td></tr>
        <tr><td><strong>Industry</strong></td><td>${escapeHtml(data.industry || 'Not provided')}</td></tr>
        <tr><td><strong>Email</strong></td><td>${escapeHtml(data.email)}</td></tr>
        <tr><td><strong>Description</strong></td><td>${escapeHtml(data.description || 'Not provided')}</td></tr>
        <tr><td><strong>Submitted at</strong></td><td>${submittedAt}</td></tr>
      </table>
    `,
  }
}

export async function POST(request) {
  let payload

  try {
    payload = await request.json()
  } catch {
    return json(400, { message: 'Invalid JSON body.' })
  }

  const errors = validate(payload)
  if (Object.keys(errors).length > 0) {
    return json(400, { message: 'Validation failed.', errors })
  }

  try {
    const captchaPassed = await verifyRecaptcha(payload.captchaToken)
    if (!captchaPassed) {
      return json(400, { message: 'reCAPTCHA verification failed.' })
    }
  } catch (error) {
    console.error('reCAPTCHA verification failed:', error)
    return json(500, { message: 'Could not verify reCAPTCHA.' })
  }

  const data = {
    fullName: clean(payload.fullName),
    institution: clean(payload.institution),
    phone: clean(payload.phone),
    industry: clean(payload.industry),
    email: clean(payload.email),
    description: clean(payload.description),
  }

  const { subject, text, html } = buildMessage(data)

  try {
    const transporter = await getTransporter()

    await transporter.sendMail({
      from: `"Upscale Hub Website" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: TO_EMAIL,
      replyTo: data.email,
      subject,
      text,
      html,
    })

    return json(200, { message: 'Message sent successfully.' })
  } catch (error) {
    console.error('Contact email failed:', error)
    return json(500, { message: 'Could not send message.' })
  }
}

export async function GET() {
  return json(405, { message: 'Method not allowed.' })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.statusCode = 405
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.end(JSON.stringify({ message: 'Method not allowed.' }))
    return
  }

  await bridgeNodeRequest(req, res, '/api/contact', POST)
}
