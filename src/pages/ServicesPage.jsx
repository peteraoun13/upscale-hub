import PageHero from '../components/PageHero/PageHero'
import Services from '../components/Services/Services'
import { useTranslation } from '../i18n/useTranslation'
import servicesHeroBg from '../assets/services-hero.png'

export default function ServicesPage() {
  const { t } = useTranslation()

  return (
    <>
      <PageHero
        title={t('servicesPage.hero')}
        image={servicesHeroBg}
      />
      <Services />
    </>
  )
}
