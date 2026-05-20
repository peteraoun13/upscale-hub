import { useEffect, useRef, useState } from 'react'
import './Contact.css'
import { useTranslation } from '../../i18n/useTranslation'

import mapImg from '../../assets/contact-map.png'
import phoneIcon from '../../assets/contact-phone.png'
import emailIcon from '../../assets/contact-email.png'

const PHONES = [
  { country: 'France', number: '+33 6 46708896' },
  { country: 'Lebanon', number: '+961 5 927000' },
  { country: 'UAE', number: '+33 7 48647014' },
]

const INITIAL = {
  fullName: '',
  institution: '',
  phone: '',
  industry: '',
  email: '',
  description: '',
}

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY

const VALIDATORS = {
  fullName: (v) => v.trim().length < 2 ? 'validation.fullNameRequired' : '',
  institution: (v) => v.trim().length < 2 ? 'validation.institutionRequired' : '',
  phone: (v) => !/^\+?[\d\s\-()]{6,}$/.test(v.trim()) ? 'validation.phoneInvalid' : '',
  industry: () => '',
  email: (v) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'validation.emailInvalid' : '',
  description: () => '',
}

export default function Contact() {
  const { t } = useTranslation()

  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [captchaToken, setCaptchaToken] = useState('')
  const captchaRef = useRef(null)
  const captchaWidgetRef = useRef(null)
  const successCloseRef = useRef(null)

  useEffect(() => {
    if (!RECAPTCHA_SITE_KEY) return undefined

    let cancelled = false

    const renderCaptcha = () => {
      if (cancelled || !captchaRef.current || !window.grecaptcha || captchaWidgetRef.current !== null) return

      captchaWidgetRef.current = window.grecaptcha.render(captchaRef.current, {
        sitekey: RECAPTCHA_SITE_KEY,
        callback: (token) => {
          setCaptchaToken(token)
          setErrors(err => ({ ...err, captcha: '' }))
        },
        'expired-callback': () => setCaptchaToken(''),
        'error-callback': () => setCaptchaToken(''),
      })
    }

    if (window.grecaptcha) {
      window.grecaptcha.ready(renderCaptcha)
    } else {
      const existingScript = document.querySelector('script[src^="https://www.google.com/recaptcha/api.js"]')
      const script = existingScript || document.createElement('script')

      script.src = 'https://www.google.com/recaptcha/api.js?render=explicit'
      script.async = true
      script.defer = true
      script.onload = () => window.grecaptcha?.ready(renderCaptcha)

      if (!existingScript) document.head.appendChild(script)
    }

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (status !== 'success') return undefined

    successCloseRef.current?.focus()
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

  const validate = (data) => {
    const e = {}
    Object.keys(VALIDATORS).forEach((k) => {
      const msg = VALIDATORS[k](data[k])
      if (msg) e[k] = msg
    })
    return e
  }

  const resetCaptcha = () => {
    setCaptchaToken('')
    if (window.grecaptcha && captchaWidgetRef.current !== null) {
      window.grecaptcha.reset(captchaWidgetRef.current)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(err => ({ ...err, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const errs = validate(form)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    if (!RECAPTCHA_SITE_KEY || !captchaToken) {
      setErrors(err => ({ ...err, captcha: 'validation.captchaRequired' }))
      return
    }

    setStatus('sending')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...form, captchaToken }),
      })

      if (!response.ok) {
        throw new Error('Contact request failed.')
      }

      setStatus('success')
      setForm(INITIAL)
      setErrors({})
      resetCaptcha()
    } catch (err) {
      console.error(err)
      setStatus('error')
      resetCaptcha()
    }
  }

  return (
    <section className="contact" id="contact">
      <div className="contact__inner">
        <div className="contact__left">
          <h2 className="contact__heading">{t('contact.heading')}</h2>

          <div className="contact__map">
            <img src={mapImg} alt="World map" className="contact__map-img" />
          </div>

          <div className="contact__phones">
            {PHONES.map((p) => (
              <div key={p.country} className="contact__phone-item">
                <img src={phoneIcon} alt="Phone" className="contact__icon-img" />
                <div>
                  <p className="contact__phone-country">{p.country}</p>
                  <p className="contact__phone-number">{p.number}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="contact__email-item">
            <img src={emailIcon} alt="Email" className="contact__icon-img" />
            <div>
              <p className="contact__phone-country">{t('contact.emailLabel')}</p>
              <a href="mailto:info@upscale-hub.com" className="contact__email-link">
                info@upscale-hub.com
              </a>
            </div>
          </div>
        </div>

        <form className="contact__form" onSubmit={handleSubmit} noValidate>
          <div className="contact__form-row">
            <div className="contact__field">
              <input
                className={`contact__input${errors.fullName ? ' contact__input--error' : ''}`}
                type="text"
                name="fullName"
                placeholder={t('contact.fullName')}
                value={form.fullName}
                onChange={handleChange}
              />
              {errors.fullName && <span className="contact__error">{t(errors.fullName)}</span>}
            </div>
            <div className="contact__field">
              <input
                className={`contact__input${errors.institution ? ' contact__input--error' : ''}`}
                type="text"
                name="institution"
                placeholder={t('contact.institution')}
                value={form.institution}
                onChange={handleChange}
              />
              {errors.institution && <span className="contact__error">{t(errors.institution)}</span>}
            </div>
          </div>

          <div className="contact__form-row">
            <div className="contact__field">
              <input
                className={`contact__input${errors.phone ? ' contact__input--error' : ''}`}
                type="tel"
                name="phone"
                placeholder={t('contact.phone')}
                value={form.phone}
                onChange={handleChange}
              />
              {errors.phone && <span className="contact__error">{t(errors.phone)}</span>}
            </div>
            <div className="contact__field">
              <input
                className="contact__input"
                type="text"
                name="industry"
                placeholder={t('contact.industry')}
                value={form.industry}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="contact__field">
            <input
              className={`contact__input contact__input--full${errors.email ? ' contact__input--error' : ''}`}
              type="email"
              name="email"
              placeholder={t('contact.email')}
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <span className="contact__error">{t(errors.email)}</span>}
          </div>

          <textarea
            className="contact__textarea"
            name="description"
            placeholder={t('contact.description')}
            value={form.description}
            onChange={handleChange}
            rows={5}
          />

          <div className="contact__captcha">
            {RECAPTCHA_SITE_KEY ? (
              <div ref={captchaRef} />
            ) : (
              <p className="contact__captcha-missing">{t('contact.captchaMissing')}</p>
            )}
          </div>
          {errors.captcha && <span className="contact__error">{t(errors.captcha)}</span>}

          {status === 'error' && (
            <p className="contact__feedback contact__feedback--error">
              {t('contact.error')}
            </p>
          )}

          <button
            type="submit"
            className="contact__submit"
            disabled={status === 'sending'}
          >
            {status === 'sending' ? t('contact.sending') : t('contact.submit')}
          </button>
        </form>
      </div>

      {status === 'success' && (
        <div className="contact-modal" role="presentation">
          <button
            className="contact-modal__backdrop"
            type="button"
            aria-label={t('contact.successCloseLabel')}
            onClick={() => setStatus('idle')}
          />
          <div
            className="contact-modal__dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-success-title"
            aria-describedby="contact-success-desc"
          >
            <div className="contact-modal__icon" aria-hidden="true">
              <span />
            </div>
            <div className="contact-modal__copy">
              <h3 id="contact-success-title">{t('contact.successTitle')}</h3>
              <p id="contact-success-desc">
                {t('contact.successDesc')}
              </p>
            </div>
            <button
              ref={successCloseRef}
              className="contact-modal__close"
              type="button"
              onClick={() => setStatus('idle')}
            >
              {t('contact.close')}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
