import './Values.css'
import { useTranslation } from '../../i18n/useTranslation'

import icon1 from '../../assets/value-innovation.png'
import icon2 from '../../assets/value-growth.png'
import icon3 from '../../assets/value-creativity.png'
import icon4 from '../../assets/value-trust.png'
import icon5 from '../../assets/value-transparency.png'
import icon6 from '../../assets/value-efficiency.png'

const ICONS = [icon1, icon2, icon3, icon4, icon5, icon6]

export default function Values() {
  const { t } = useTranslation()
  const values = t('aboutPage.values')

  return (
    <section className="values">
      <div className="values__inner">
        <h2 className="values__heading">{t('aboutPage.valuesTitle')}</h2>
        <div className="values__grid">
          {values.map((item, i) => (
            <div key={i} className="values__item">
              <img
                src={ICONS[i]}
                alt={item.label}
                className="values__icon"
              />
              <p className="values__label">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}