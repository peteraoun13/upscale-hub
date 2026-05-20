import { Link } from 'react-router-dom'
import './Footer.css'
import { useTranslation } from '../../i18n/useTranslation'

import logoImg     from '../../assets/logo.png'
import linkedinImg from '../../assets/social-linkedin.png'
import instaImg    from '../../assets/social-instagram.png'
import xImg        from '../../assets/social-x.png'
import facebookImg from '../../assets/social-facebook.png'
import { useNavigationLoading } from '../../navigation/NavigationLoadingContext'

const SOCIAL = [
  { label: 'LinkedIn',  href: '#', icon: linkedinImg },
  { label: 'Instagram', href: '#', icon: instaImg    },
  { label: 'X',         href: '#', icon: xImg        },
  { label: 'Facebook',  href: '#', icon: facebookImg },
]

export default function Footer() {
  const { t } = useTranslation()
  const beginNavigationLoading = useNavigationLoading()

  const FOOTER_LINKS = [
    { key: 'about',    to: '/about'    },
    { key: 'services', to: '/services' },
    { key: 'careers',  to: '/careers'  },
    { key: 'contact',  to: '/contact'  },
  ]

  return (
    <footer className="footer">

      {/* ── Top row ── */}
      <div className="footer__top">

        {/* Logo */}
        <Link
          to="/"
          className="footer__logo"
          onClick={() => beginNavigationLoading('/')}
        >
          <img src={logoImg} alt="Upscale Hub" className="footer__logo-img" />
        </Link>

        {/* Nav links — translated */}
        <nav className="footer__links">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.key}
              to={link.to}
              className="footer__link"
              onClick={() => beginNavigationLoading(link.to)}
            >
              {t(`nav.${link.key}`)}
            </Link>
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
