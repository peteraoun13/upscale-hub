import Navbar        from '../components/Navbar/Navbar'
import AboutHero     from '../components/AboutHero/AboutHero'
import MissionVision from '../components/MissionVision/MissionVision'
import Values        from '../components/Values/Values'
import WhatWeDo      from '../components/WhatWeDo/WhatWeDo'
import Footer        from '../components/Footer/Footer'
import { useTranslation } from '../i18n/useTranslation'
import aboutHeroBg from '../assets/about-hero.png'
import ScrollToTop from '../components/ScrollToTop/ScrollToTop'
export default function AboutPage() {
  const { t } = useTranslation()

  return (
    <>
      <Navbar />
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
      <Footer />
      <ScrollToTop />
    </>
  )
}