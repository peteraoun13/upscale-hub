import AboutHero     from '../components/AboutHero/AboutHero'
import MissionVision from '../components/MissionVision/MissionVision'
import Values        from '../components/Values/Values'
import WhatWeDo      from '../components/WhatWeDo/WhatWeDo'
import { useTranslation } from '../i18n/useTranslation'
import aboutHeroBg from '../assets/about-hero.png'

export default function AboutPage() {
  const { t } = useTranslation()

  return (
    <>
      <AboutHero
        title={t('aboutPage.hero')}
        image={aboutHeroBg}
      >
        <p>{t('aboutPage.desc1')}</p>
        <p>{t('aboutPage.desc2')}</p>
        <p>{t('aboutPage.desc3')}</p>
      </AboutHero>
      <MissionVision />
      <WhatWeDo />
      <Values />
    </>
  )
}
