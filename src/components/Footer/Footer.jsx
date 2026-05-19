import './Footer.css'
import { useTranslation } from '../../i18n/useTranslation'

import logoImg     from '../../assets/logo.png'
import linkedinImg from '../../assets/social-linkedin.png'
import instaImg    from '../../assets/social-instagram.png'
import xImg        from '../../assets/social-x.png'
import facebookImg from '../../assets/social-facebook.png'

const SOCIAL = [
  { label: 'LinkedIn',  href: '#', icon: linkedinImg },
  { label: 'Instagram', href: '#', icon: instaImg    },
  { label: 'X',         href: '#', icon: xImg        },
  { label: 'Facebook',  href: '#', icon: facebookImg },
]

export default function Footer() {
  const { t } = useTranslation()

  const FOOTER_LINKS = [
    { key: 'about',    href: '#about'    },
    { key: 'services', href: '#services' },
    { key: 'careers',  href: '#careers'  },
    { key: 'contact',  href: '#contact'  },
  ]

  return (
    <footer className="footer">

      {/* ── Top row ── */}
      <div className="footer__top">

        {/* Logo */}
        <a href="/" className="footer__logo">
          <img src={logoImg} alt="Upscale Hub" className="footer__logo-img" />
        </a>

        {/* Nav links — translated */}
        <nav className="footer__links">
          {FOOTER_LINKS.map((link) => (
            <a key={link.key} href={link.href} className="footer__link">
              {t(`nav.${link.key}`)}
            </a>
          ))}
        </nav>

        {/* Social icons */}
        <div className="footer__social">
          {SOCIAL.map((s) => (
            <a
              key={s.label}
              href={s.href}
              className="footer__social-btn"
              aria-label={s.label}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={s.icon} alt={s.label} className="footer__social-icon" />
            </a>
          ))}
        </div>

      </div>

      {/* ── Bottom — copyright ── */}
      <div className="footer__bottom">
        <p className="footer__copy">{t('footer.copy')}</p>
      </div>

    </footer>
  )
}