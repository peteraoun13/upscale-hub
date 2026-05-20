import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Hero.css'
import arrowLeftDefault  from '../../assets/arrow-left.png'
import arrowLeftHover    from '../../assets/arrow-left-blue.png'
import arrowRightDefault from '../../assets/arrow-right.png'
import arrowRightHover   from '../../assets/arrow-right-blue.png'
import hero1 from '../../assets/hero1.png'
import hero2 from '../../assets/hero2.png'
import hero3 from '../../assets/hero3.png'
import { useTranslation } from '../../i18n/useTranslation'
import { useNavigationLoading } from '../../navigation/NavigationLoadingContext'

const SLIDE_IMAGES = [hero1, hero2, hero3]

export default function Hero() {
  const { t } = useTranslation()
  const beginNavigationLoading = useNavigationLoading()
  const [current, setCurrent]       = useState(0)
  const [leftHover, setLeftHover]   = useState(false)
  const [rightHover, setRightHover] = useState(false)

  const slides = t('hero.slides')
  const cta    = t('hero.cta')

  const prev = () => setCurrent(i => (i === 0 ? slides.length - 1 : i - 1))
  const next = () => setCurrent(i => (i === slides.length - 1 ? 0 : i + 1))

  return (
    <section className="hero">

      {SLIDE_IMAGES.map((img, i) => (
        <div
          key={i}
          className={`hero__slide${i === current ? ' hero__slide--active' : ''}`}
        >
          <img src={img} alt="" className="hero__slide-img" />
        </div>
      ))}

      <div className="hero__overlay" />

      <div className="hero__container">
        <div className="hero__content">
          <h1 className="hero__heading">
            {slides[current].heading[0]}<br />
            {slides[current].heading[1]}
          </h1>
          <Link
            to="/services"
            className="hero__cta"
            onClick={() => beginNavigationLoading('/services')}
          >
            {cta}
          </Link>
        </div>
      </div>

      <div className="hero__dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hero__dot${i === current ? ' hero__dot--active' : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      <button
        className="hero__arrow hero__arrow--left"
        onClick={prev}
        aria-label="Previous"
        onMouseEnter={() => setLeftHover(true)}
        onMouseLeave={() => setLeftHover(false)}
      >
        <img
          src={leftHover ? arrowLeftHover : arrowLeftDefault}
          alt=""
          className="hero__arrow-img"
        />
      </button>

      <button
        className="hero__arrow hero__arrow--right"
        onClick={next}
        aria-label="Next"
        onMouseEnter={() => setRightHover(true)}
        onMouseLeave={() => setRightHover(false)}
      >
        <img
          src={rightHover ? arrowRightHover : arrowRightDefault}
          alt=""
          className="hero__arrow-img"
        />
      </button>

    </section>
  )
}
