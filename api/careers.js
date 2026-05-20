import {
  bridgeNodeRequest,
  clean,
  cleanHeader,
  escapeHtml,
  getTransporter,
  json,
  options,
} from './mail.js'

export const config = {
  api: {
    bodyParser: false,
  },
}

const TO_EMAIL = process.env.CAREERS_TO_EMAIL || process.env.CONTACT_TO_EMAIL || 'peteraoun2013@gmail.com'
const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = new Map([
  ['application/pdf', 'pdf'],
  ['application/msword', 'doc'],
  ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'docx'],
])

function validate(message, file) {
  const errors = {}

  if (clean(message).length < 10) {
    errors.message = 'Please write a short message of at least 10 characters.'
  }

  if (!file || file.size === 0) {
    errors.cv = 'Please upload your CV.'
  } else if (file.size > MAX_FILE_SIZE) {
    errors.cv = 'CV file must be 5 MB or smaller.'
  } else if (!ALLOWED_TYPES.has(file.type)) {
    errors.cv = 'CV must be a PDF, DOC, or DOCX file.'
  }

  return errors
}

function buildMessage(message, file) {
  const submittedAt = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Beirut',
  })

  return {
    subject: `New career application - ${cleanHeader(file.name)}`,
    text: [
      'New career application',
      `Message: ${message}`,
      `CV file: ${file.name}`,
      `Submitted at: ${submittedAt}`,
    ].join('\n'),
    html: `
      <h2>New career application</h2>
      <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;">
        <tr><td><strong>Message</strong></td><td>${escapeHtml(message)}</td></tr>
        <tr><td><strong>CV file</strong></td><td>${escapeHtml(file.name)}</td></tr>
        <tr><td><strong>Submitted at</strong></td><td>${submittedAt}</td></tr>
      </table>
    `,
  }
}

export async function POST(request) {
  let formData

  try {
    formData = await request.formData()
  } catch {
    return json(400, { message: 'Invalid form submission.' }, request)
  }

  const message = clean(formData.get('message'))
  const file = formData.get('cv')
  const errors = validate(message, file)

  if (Object.keys(errors).length > 0) {
    return json(400, { message: 'Validation failed.', errors }, request)
  }

  const { subject, text, html } = buildMessage(message, file)

  try {
    const transporter = await getTransporter()
    const attachmentBuffer = Buffer.from(await file.arrayBuffer())

    await transporter.sendMail({
      from: `"Upscale Hub Careers" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: TO_EMAIL,
      subject,
      text,
      html,
      attachments: [
        {
          filename: file.name,
          content: attachmentBuffer,
          contentType: file.type,
        },
      ],
    })

    return json(200, { message: 'Application sent successfully.' }, request)
  } catch (error) {
    console.error('Career application email failed:', error)
    return json(500, { message: 'Could not send application.' }, request)
  }
}

export async function OPTIONS(request) {
  return options(request)
}

export async function GET() {
  return json(405, { message: 'Method not allowed.' })
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    await bridgeNodeRequest(req, res, '/api/careers', OPTIONS)
    return
  }

  if (req.method !== 'POST') {
    res.statusCode = 405
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.end(JSON.stringify({ message: 'Method not allowed.' }))
    return
  }

  await bridgeNodeRequest(req, res, '/api/careers', POST)
}
