import './Partners.css'
import { useTranslation } from '../../i18n/useTranslation'

import logo1 from '../../assets/ua.png'
import logo2 from '../../assets/ticket-lab.png'
import logo3 from '../../assets/ATOS.png'
import logo4 from '../../assets/Campus-BioTech.png'
import logo5 from '../../assets/InterOp-VLab.png'
import logo6 from '../../assets/Mtein-Mchikha-Municipality.png'
import logo7 from '../../assets/HyTIISeine.png'
import logo8 from '../../assets/ITII-Ingenieur.png'

const PARTNERS = [
  { id: 1, name: 'Université Antonine', logo: logo1, url: 'https://www.ua.edu.lb' },
  { id: 2, name: 'Ticket Research Lab', logo: logo2, url: 'https://ticket.ua.edu.lb' },
  { id: 3, name: 'AtoS',                logo: logo3, url: 'https://www.atos.net' },
  { id: 4, name: 'Campus Biotech',      logo: logo4, url: 'https://www.campusbiotech.ch' },
  { id: 5, name: 'InterOP-VLab',        logo: logo5, url: 'https://interop-vlab.eu' },
  { id: 6, name: 'Mtein Municipality',  logo: logo6, url: null },
  { id: 7, name: 'HyTII-Seine',         logo: logo7, url: null },
  { id: 8, name: 'ITII Ingénieur',      logo: logo8, url: 'https://www.itii.fr' },
]

export default function Partners() {
  const { t } = useTranslation()

  return (
    <section className="partners" id="partners">
      <div className="partners__inner">

        <h2 className="partners__heading">{t('partners.heading')}</h2>

        <div className="partners__grid">
          {PARTNERS.map((partner) => {
            const card = (
              <div className={`partner-card${partner.url ? ' partner-card--link' : ''}`}>
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="partner-card__img"
                />
              </div>
            )

            return partner.url ? (
              <a
                key={partner.id}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="partner-card__anchor"
                aria-label={partner.name}
              >
                {card}
              </a>
            ) : (
              <div key={partner.id} className="partner-card__anchor">
                {card}
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}