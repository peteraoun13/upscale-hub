import { useState } from 'react'
import './Careers.css'
import { useTranslation } from '../../i18n/useTranslation'

export default function Careers() {
  const { t } = useTranslation()
  const [message, setMessage] = useState('')
  const [cv, setCv]           = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Careers form:', { message, cv })
  }

  return (
    <section className="careers">
      <div className="careers__wrapper">
        <div className="careers__inner">

          {/* ── Left — heading + text ── */}
          <div className="careers__content">
            <h2 className="careers__heading">{t('careers.heading')}</h2>
            <p className="careers__desc">{t('careers.desc1')}</p>
            <p className="careers__desc">{t('careers.desc2')}</p>
            <p className="careers__desc">{t('careers.desc3')}</p>
            <p className="careers__cta-text">
              <strong>{t('careers.cta')}</strong>
            </p>
          </div>

          {/* ── Right — form ── */}
          <form className="careers__form" onSubmit={handleSubmit}>
            <div className="careers__field">
              <label className="careers__label">{t('careers.msgLabel')}</label>
              <textarea
                className="careers__textarea"
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={5}
              />
            </div>
            <div className="careers__field">
              <label className="careers__label">{t('careers.cvLabel')}</label>
              <input
                className="careers__file"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={e => setCv(e.target.files[0])}
              />
            </div>
            <button type="submit" className="careers__submit">
              {t('careers.submit')}
            </button>
          </form>

        </div>
      </div>
    </section>
  )
}