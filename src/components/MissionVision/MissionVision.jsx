import './MissionVision.css'
import { useTranslation } from '../../i18n/useTranslation'
import circleImg from '../../assets/mission-circle.png'

export default function MissionVision() {
  const { t } = useTranslation()

  return (
    <section className="mv">
      <div className="mv__inner">

        {/* Mission */}
        <div className="mv__block">
          <h3 className="mv__title">{t('aboutPage.missionTitle')}</h3>
          <p className="mv__desc">{t('aboutPage.missionDesc')}</p>
        </div>

        {/* Center image */}
        <div className="mv__image-wrap">
          <img src={circleImg} alt="" className="mv__image" />
        </div>

        {/* Vision */}
        <div className="mv__block">
          <h3 className="mv__title">{t('aboutPage.visionTitle')}</h3>
          <p className="mv__desc">{t('aboutPage.visionDesc')}</p>
        </div>

      </div>
    </section>
  )
}