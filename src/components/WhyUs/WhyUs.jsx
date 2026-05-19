import './WhyUs.css'
import whyImage     from '../../assets/why-image.png'
import whyWatermark from '../../assets/why-watermark.png'
import { useTranslation } from '../../i18n/useTranslation'

export default function WhyUs() {
  const { t } = useTranslation()

  return (
    <section className="whyus" id="about">

      <img
        src={whyWatermark}
        alt=""
        className="whyus__watermark"
        aria-hidden="true"
      />

      <div className="whyus__inner">

        {/* Left — image */}
        <div className="whyus__image-wrap">
          <img
            src={whyImage}
            alt="Creative lightbulb idea"
            className="whyus__image"
          />
        </div>

        {/* Right — text */}
        <div className="whyus__content">
          <h2
            className="whyus__heading"
            dangerouslySetInnerHTML={{ __html: t('whyus.heading') }}
          />
          <p className="whyus__desc">{t('whyus.desc')}</p>
          <a href="#services" className="whyus__cta">{t('whyus.cta')}</a>
        </div>

      </div>
    </section>
  )
}