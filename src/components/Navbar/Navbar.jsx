import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Navbar.css'
import logo   from '../../assets/logo.png'
import flagEN from '../../assets/flag-en.png'
import flagFR from '../../assets/flag-fr.svg'
import { useTranslation } from '../../i18n/useTranslation'

export default function Navbar() {
  const { t, lang, toggleLang } = useTranslation()
  const navigate  = useNavigate()
  const location  = useLocation()
  const [menuOpen, setMenuOpen]     = useState(false)
  const [scrolled, setScrolled]     = useState(false)
  const [activeLink, setActiveLink] = useState('about')

  const NAV_LINKS = [
    { key: 'about',    href: '/about',    page: '/about'    },
    { key: 'services', href: '/services', page: '/services' },
    { key: 'careers',  href: '/careers',  page: '/careers'  },
    { key: 'contact',  href: '/contact',  page: '/contact'  },
    { key: 'training', href: '#training', page: null        },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleNavClick = (link) => {
    setActiveLink(link.key)
    if (link.page) navigate(link.page)
  }

  const isActive = (link) =>
    activeLink === link.key || location.pathname === link.page

  const LangBtn = ({ className = '' }) => (
    <button
      className={`navbar__lang ${className}`}
      onClick={toggleLang}
      aria-label="Toggle language"
    >
      <img
        src={lang === 'en' ? flagFR : flagEN}
        alt={lang === 'en' ? 'Switch to French' : 'Switch to English'}
        className="navbar__flag"
      />
    </button>
  )

  return (
    <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <div className="navbar__inner">

        <a href="/" className="navbar__logo">
          <img src={logo} alt="Upscale Hub" className="navbar__logo-img" />
        </a>

        <nav className="navbar__links">
          {NAV_LINKS.map((link) => (
            <a
              key={link.key}
              href={link.page ? undefined : link.href}
              className={`navbar__link${isActive(link) ? ' navbar__link--active' : ''}`}
              onClick={() => handleNavClick(link)}
              style={{ cursor: 'pointer' }}
            >
              {t(`nav.${link.key}`)}
            </a>
          ))}
          <LangBtn />
        </nav>

        <button
          className={`navbar__hamburger${menuOpen ? ' is-open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          <span /><span /><span />
        </button>
      </div>

      <div className={`navbar__drawer${menuOpen ? ' is-open' : ''}`}>
        <nav className="drawer__links">
          {NAV_LINKS.map((link) => (
            <a
              key={link.key}
              href={link.page ? undefined : link.href}
              className={`drawer__link${isActive(link) ? ' drawer__link--active' : ''}`}
              onClick={() => { handleNavClick(link); setMenuOpen(false) }}
              style={{ cursor: 'pointer' }}
            >
              {t(`nav.${link.key}`)}
            </a>
          ))}
          <LangBtn className="drawer__lang" />
        </nav>
      </div>

      {menuOpen && (
        <div className="navbar__backdrop" onClick={() => setMenuOpen(false)} />
      )}
    </header>
  )
}