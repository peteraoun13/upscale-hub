import { useState, useEffect, useRef, useMemo } from 'react'
import './Services.css'
import { useTranslation } from '../../i18n/useTranslation'

import decoPng from '../../assets/services-deco.png'
import icon1   from '../../assets/service-icon-1.png'
import icon2   from '../../assets/service-icon-2.png'
import icon3   from '../../assets/service-icon-3.png'
import icon4   from '../../assets/service-icon-4.png'
import icon5   from '../../assets/service-icon-5.png'

const ICONS = [icon1, icon2, icon3, icon4, icon5]

function getItemsPerPage(width) {
  if (width <= 480)  return 1
  if (width <= 768)  return 2
  if (width <= 1024) return 3
  return 4
}

function buildPages(items, perPage) {
  const pages = []
  for (let i = 0; i < items.length; i += perPage) {
    const group = items.slice(i, i + perPage)
    while (group.length < perPage) {
      group.push(items[group.length % items.length])
    }
    pages.push(group)
  }
  return pages
}

export default function Services() {
  const { t }                         = useTranslation()
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [index, setIndex]             = useState(1)
  const [animate, setAnimate]         = useState(true)
  const trackRef                      = useRef(null)
  const dragStart                     = useRef(null)
  const dragCurrent                   = useRef(null)
  const [dragOffset, setDragOffset]   = useState(0)

  const itemsPerPage = getItemsPerPage(windowWidth)

  // Merge translated text with icons
  const BASE = useMemo(() =>
    t('services.items').map((item, i) => ({
      ...item,
      id:   i + 1,
      icon: ICONS[i],
    })),
    [t]
  )

  const pages = useMemo(
    () => buildPages(BASE, itemsPerPage),
    [BASE, itemsPerPage]
  )
  const totalPages = pages.length

  const extended = useMemo(
    () => [...pages.slice(-1), ...pages, ...pages.slice(0, 1)],
    [pages]
  )

  useEffect(() => {
    setAnimate(false)
    setIndex(1)
  }, [itemsPerPage])

  useEffect(() => {
    if (!animate) {
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setAnimate(true))
      )
    }
  }, [animate])

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const onTransitionEnd = () => {
    if (index === 0) {
      setAnimate(false)
      setIndex(totalPages)
    } else if (index === extended.length - 1) {
      setAnimate(false)
      setIndex(1)
    }
  }

  const goTo = (i) => { setAnimate(true); setIndex(i) }
  const prev = () => { setAnimate(true); setIndex(i => i - 1) }
  const next = () => { setAnimate(true); setIndex(i => i + 1) }

  const activeDot = ((index - 1) % totalPages + totalPages) % totalPages

  const onDragStart = (clientX) => {
    dragStart.current   = clientX
    dragCurrent.current = clientX
  }
  const onDragMove = (clientX) => {
    if (dragStart.current === null) return
    dragCurrent.current = clientX
    setDragOffset(clientX - dragStart.current)
  }
  const onDragEnd = () => {
    if (dragStart.current === null) return
    const diff = dragCurrent.current - dragStart.current
    if (diff < -50)     next()
    else if (diff > 50) prev()
    dragStart.current = null
    setDragOffset(0)
  }

  const translateX = `calc(${-index * 100}% + ${dragOffset}px)`

  return (
    <section className="services" id="services">
      <img src={decoPng} alt="" className="services__deco" aria-hidden="true" />

      <div className="services__inner">
        <h2 className="services__heading">{t('services.heading')}</h2>

        <div
          className="services__viewport"
          onMouseDown={e  => onDragStart(e.clientX)}
          onMouseMove={e  => onDragMove(e.clientX)}
          onMouseUp={onDragEnd}
          onMouseLeave={onDragEnd}
          onTouchStart={e => onDragStart(e.touches[0].clientX)}
          onTouchMove={e  => onDragMove(e.touches[0].clientX)}
          onTouchEnd={onDragEnd}
        >
          <div
            className="services__track"
            ref={trackRef}
            style={{
              transform:  `translateX(${translateX})`,
              transition: animate
                ? 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                : 'none',
            }}
            onTransitionEnd={onTransitionEnd}
          >
            {extended.map((group, pageIdx) => (
              <div key={pageIdx} className="services__page">
                {group.map((service, si) => (
                  <div key={si} className="service-card">
                    <div className="service-card__icon-wrap">
                      <img
                        src={service.icon}
                        alt={service.title}
                        className="service-card__icon-img"
                        draggable="false"
                      />
                    </div>
                    <h3 className="service-card__title">{service.title}</h3>
                    <p className="service-card__desc">{service.description}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="services__dots">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={`services__dot${i === activeDot ? ' services__dot--active' : ''}`}
              onClick={() => goTo(i + 1)}
              aria-label={`Page ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}