import { useState } from 'react'
import './WhatWeDo.css'
import { useTranslation } from '../../i18n/useTranslation'
import iconDown from '../../assets/chevron-down.png'
import iconUp   from '../../assets/chevron-up.png'
import decoImg  from '../../assets/whatwedo-deco.png'

export default function WhatWeDo() {
  const { t } = useTranslation()
  const items = t('aboutPage.whatWeDo')
  const [open, setOpen] = useState(null)

  const toggle = (i) => setOpen(open === i ? null : i)

  return (
    <section className="wwd">
      <img src={decoImg} alt="" className="wwd__deco" aria-hidden="true" />
      <div className="wwd__inner">
        <h2 className="wwd__heading">{t('aboutPage.whatWeDoTitle')}</h2>
        <div className="wwd__list">
          {items.map((item, i) => (
            <div key={i} className={`wwd__item${open === i ? ' wwd__item--open' : ''}`}>
              <button
                className="wwd__trigger"
                onClick={() => toggle(i)}
                aria-expanded={open === i}
              >
                <span className="wwd__trigger-title">{item.title}</span>
                <img
                  src={open === i ? iconUp : iconDown}
                  alt=""
                  className="wwd__chevron"
                />
              </button>
              {open === i && (
                <div className="wwd__body">
                  <p className="wwd__subtitle">{item.subtitle}</p>
                  <p className="wwd__desc">{item.desc}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}