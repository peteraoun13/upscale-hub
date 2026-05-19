import { useState } from 'react'
import './Contact.css'
import { useTranslation } from '../../i18n/useTranslation'

import mapImg    from '../../assets/contact-map.png'
import phoneIcon from '../../assets/contact-phone.png'
import emailIcon from '../../assets/contact-email.png'

const PHONES = [
  { country: 'France',  number: '+33 6 46708896' },
  { country: 'Lebanon', number: '+961 5 927000'  },
  { country: 'UAE',     number: '+33 7 48647014' },
]

const INITIAL = {
  fullName: '', institution: '', phone: '',
  industry: '', email: '',      description: '',
}

const VALIDATORS = {
  fullName:    (v) => v.trim().length < 2      ? 'Full name is required.'          : '',
  institution: (v) => v.trim().length < 2      ? 'Institution name is required.'   : '',
  phone:       (v) => !/^\+?[\d\s\-()]{6,}$/.test(v.trim()) ? 'Enter a valid phone number.' : '',
  industry:    ()  => '',
  email:       (v) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Enter a valid email address.' : '',
  description: ()  => '',
}

export default function Contact() {
  const { t } = useTranslation()

  const [form,    setForm]    = useState(INITIAL)
  const [errors,  setErrors]  = useState({})
  const [status,  setStatus]  = useState('idle')
  const [checked, setChecked] = useState(false)

  const validate = (data) => {
    const e = {}
    Object.keys(VALIDATORS).forEach((k) => {
      const msg = VALIDATORS[k](data[k])
      if (msg) e[k] = msg
    })
    return e
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

    if (!checked) {
      setErrors(err => ({ ...err, captcha: 'Please confirm you are not a robot.' }))
      return
    }

    setStatus('sending')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        throw new Error('Contact request failed.')
      }

      setStatus('success')
      setForm(INITIAL)
      setChecked(false)
      setErrors({})
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  return (
    <section className="contact" id="contact">
      <div className="contact__inner">

        {/* ── Left ── */}
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

        {/* ── Right — form ── */}
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
              {errors.fullName && <span className="contact__error">{errors.fullName}</span>}
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
              {errors.institution && <span className="contact__error">{errors.institution}</span>}
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
              {errors.phone && <span className="contact__error">{errors.phone}</span>}
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
            {errors.email && <span className="contact__error">{errors.email}</span>}
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
            <input
              type="checkbox"
              id="robot"
              checked={checked}
              onChange={e => {
                setChecked(e.target.checked)
                if (errors.captcha) setErrors(err => ({ ...err, captcha: '' }))
              }}
            />
            <label htmlFor="robot">{t('contact.notRobot')}</label>
            <div className="contact__captcha-logo">
              <span>reCAPTCHA</span>
              <span>Privacy · Terms</span>
            </div>
          </div>
          {errors.captcha && <span className="contact__error">{errors.captcha}</span>}

          {status === 'success' && (
            <p className="contact__feedback contact__feedback--success">
              ✅ Message sent successfully!
            </p>
          )}
          {status === 'error' && (
            <p className="contact__feedback contact__feedback--error">
              ❌ Something went wrong. Please try again.
            </p>
          )}

          <button
            type="submit"
            className="contact__submit"
            disabled={status === 'sending'}
          >
            {status === 'sending' ? 'Sending…' : t('contact.submit')}
          </button>

        </form>
      </div>
    </section>
  )
}
