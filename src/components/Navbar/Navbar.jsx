import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Navbar.css'
import logo   from '../../assets/logo.png'
import flagEN from '../../assets/flag-en.png'
import flagFR from '../../assets/flag-fr.svg'
import { useTranslation } from '../../i18n/useTranslation'

function LanguageButton({ className = '', tabIndex, lang, toggleLang }) {
  return (
    <button
      className={`navbar__lang ${className}`}
      onClick={toggleLang}
      aria-label="Toggle language"
      tabIndex={tabIndex}
      type="button"
    >
      <img
        src={lang === 'en' ? flagFR : flagEN}
        alt={lang === 'en' ? 'Switch to French' : 'Switch to English'}
        className="navbar__flag"
      />
    </button>
  )
}

export default function Navbar() {
  const { t, lang, toggleLang } = useTranslation()
  const navigate  = useNavigate()
  const location  = useLocation()
  const [menuOpen, setMenuOpen]     = useState(false)
  const [scrolled, setScrolled]     = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [activeLink, setActiveLink] = useState('about')
  const hamburgerRef = useRef(null)
  const drawerRef = useRef(null)
  const resizeTimerRef = useRef(null)

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
    const onResize = () => {
      setIsResizing(true)
      window.clearTimeout(resizeTimerRef.current)
      resizeTimerRef.current = window.setTimeout(() => {
        setIsResizing(false)
      }, 180)
    }

    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      window.clearTimeout(resizeTimerRef.current)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return undefined

    const drawer = drawerRef.current
    const focusable = [
      ...(drawer ? drawer.querySelectorAll('a[href], button:not([disabled])') : []),
      hamburgerRef.current,
    ].filter(Boolean)

    focusable[0]?.focus()

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        hamburgerRef.current?.focus()
        return
      }

      if (event.key !== 'Tab' || focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  const closeMenu = () => {
    setMenuOpen(false)
    hamburgerRef.current?.focus()
  }

  const handleNavClick = (link, event) => {
    if (link.page) event?.preventDefault()
    setActiveLink(link.key)
    if (link.page) navigate(link.page)
  }

  const isActive = (link) =>
    activeLink === link.key || location.pathname === link.page

  const mobileLabel = (key) => {
    if (lang !== 'fr') return t(`nav.${key}`)

    const labels = {
      about: 'À Propos De Nous',
      contact: 'Contactez-Nous',
      training: 'Training Center',
    }

    return labels[key] || t(`nav.${key}`)
  }

  return (
    <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}${menuOpen ? ' navbar--menu-open' : ''}${isResizing ? ' navbar--resizing' : ''}`}>
      <div className="navbar__inner">

        <a href="/" className="navbar__logo">
          <img src={logo} alt="Upscale Hub" className="navbar__logo-img" />
        </a>

        <nav className="navbar__links">
          {NAV_LINKS.map((link) => (
            <a
              key={link.key}
              href={link.href}
              className={`navbar__link${isActive(link) ? ' navbar__link--active' : ''}`}
              onClick={(event) => handleNavClick(link, event)}
              style={{ cursor: 'pointer' }}
            >
              {t(`nav.${link.key}`)}
            </a>
          ))}
          <LanguageButton lang={lang} toggleLang={toggleLang} />
        </nav>

        <button
          ref={hamburgerRef}
          className={`navbar__hamburger${menuOpen ? ' is-open' : ''}`}
          onClick={() => setMenuOpen(o => !o)}
          type="button"
          aria-controls="mobile-navigation"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          <span /><span /><span />
        </button>
      </div>

      <div
        ref={drawerRef}
        id="mobile-navigation"
        className={`navbar__drawer${menuOpen ? ' is-open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <nav className="drawer__links" aria-label="Mobile navigation">
          {NAV_LINKS.map((link) => (
            <a
              key={link.key}
              href={link.href}
              className={`drawer__link${isActive(link) ? ' drawer__link--active' : ''}`}
              onClick={(event) => { handleNavClick(link, event); setMenuOpen(false) }}
              tabIndex={menuOpen ? 0 : -1}
              style={{ cursor: 'pointer' }}
            >
              {mobileLabel(link.key)}
            </a>
          ))}
          <LanguageButton
            className="drawer__lang"
            lang={lang}
            tabIndex={menuOpen ? 0 : -1}
            toggleLang={toggleLang}
          />
        </nav>
      </div>

      {menuOpen && (
        <button
          className="navbar__backdrop"
          type="button"
          aria-label="Close menu"
          onClick={closeMenu}
        />
      )}
    </header>
  )
}
