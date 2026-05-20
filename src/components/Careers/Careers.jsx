import { useEffect, useRef, useState } from 'react'
import './Careers.css'
import { useTranslation } from '../../i18n/useTranslation'
import { apiUrl } from '../../api/client'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

function validate(message, cv) {
  const errors = {}

  if (message.trim().length < 10) {
    errors.message = 'validation.messageShort'
  }

  if (!cv) {
    errors.cv = 'validation.cvRequired'
  } else if (cv.size > MAX_FILE_SIZE) {
    errors.cv = 'validation.cvTooLarge'
  } else if (!ALLOWED_TYPES.includes(cv.type)) {
    errors.cv = 'validation.cvInvalidType'
  }

  return errors
}

export default function Careers() {
  const { t } = useTranslation()
  const [message, setMessage] = useState('')
  const [cv, setCv] = useState(null)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const fileRef = useRef(null)
  const closeRef = useRef(null)

  useEffect(() => {
    if (status !== 'success') return undefined

    closeRef.current?.focus()
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setStatus('idle')
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [status])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const nextErrors = validate(message, cv)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setStatus('sending')
    setErrors({})

    const body = new FormData()
    body.append('message', message.trim())
    body.append('cv', cv)

    try {
      const response = await fetch(apiUrl('/api/careers'), {
        method: 'POST',
        body,
      })

      if (!response.ok) {
        throw new Error('Career submission failed.')
      }

      setStatus('success')
      setMessage('')
      setCv(null)
      if (fileRef.current) fileRef.current.value = ''
    } catch (error) {
      console.error(error)
      setStatus('error')
    }
  }

  return (
    <section className="careers">
      <div className="careers__wrapper">
        <div className="careers__inner">
          <div className="careers__content">
            <h2 className="careers__heading">{t('careers.heading')}</h2>
            <p className="careers__desc">{t('careers.desc1')}</p>
            <p className="careers__desc">{t('careers.desc2')}</p>
            <p className="careers__desc">{t('careers.desc3')}</p>
            <p className="careers__cta-text">
              <strong>{t('careers.cta')}</strong>
            </p>
          </div>

          <form className="careers__form" onSubmit={handleSubmit} noValidate>
            <div className="careers__field">
              <label className="careers__label" htmlFor="career-message">
                {t('careers.msgLabel')}
              </label>
              <textarea
                id="career-message"
                className={`careers__textarea${errors.message ? ' careers__textarea--error' : ''}`}
                value={message}
                onChange={e => {
                  setMessage(e.target.value)
                  if (errors.message) setErrors(current => ({ ...current, message: '' }))
                }}
                rows={5}
              />
              <span className={`careers__error${errors.message ? '' : ' careers__error--empty'}`}>
                {errors.message ? t(errors.message) : 'Message validation placeholder'}
              </span>
            </div>

            <div className="careers__field">
              <label className="careers__label" htmlFor="career-cv">
                {t('careers.cvLabel')}
              </label>
              <input
                ref={fileRef}
                id="career-cv"
                className={`careers__file${errors.cv ? ' careers__file--error' : ''}`}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={e => {
                  setCv(e.target.files?.[0] || null)
                  if (errors.cv) setErrors(current => ({ ...current, cv: '' }))
                }}
              />
              <p className="careers__hint">{t('careers.fileHint')}</p>
              <span className={`careers__error${errors.cv ? '' : ' careers__error--empty'}`}>
                {errors.cv ? t(errors.cv) : 'CV validation placeholder'}
              </span>
            </div>

            {status === 'error' && (
              <p className="careers__feedback careers__feedback--error">
                {t('careers.error')}
              </p>
            )}

            <button type="submit" className="careers__submit" disabled={status === 'sending'}>
              {status === 'sending' ? t('careers.sending') : t('careers.submit')}
            </button>
          </form>
        </div>
      </div>

      {status === 'success' && (
        <div className="careers-modal" role="presentation">
          <button
            className="careers-modal__backdrop"
            type="button"
            aria-label={t('careers.successCloseLabel')}
            onClick={() => setStatus('idle')}
          />
          <div
            className="careers-modal__dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="careers-success-title"
            aria-describedby="careers-success-desc"
          >
            <div className="careers-modal__icon" aria-hidden="true">
              <span />
            </div>
            <h3 id="careers-success-title">{t('careers.successTitle')}</h3>
            <p id="careers-success-desc">
              {t('careers.successDesc')}
            </p>
            <button
              ref={closeRef}
              className="careers-modal__close"
              type="button"
              onClick={() => setStatus('idle')}
            >
              {t('careers.close')}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
