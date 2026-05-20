import Hero     from '../components/Hero/Hero'
import WhyUs    from '../components/WhyUs/WhyUs'
import Services from '../components/Services/Services'
import Partners from '../components/Partners/Partners'
import Contact  from '../components/Contact/Contact'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Services />
      <WhyUs />
      <Partners />
      <Contact />
    </main>
  )
}
