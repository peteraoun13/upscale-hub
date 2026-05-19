import Navbar   from '../components/Navbar/Navbar'
import Hero     from '../components/Hero/Hero'
import WhyUs    from '../components/WhyUs/WhyUs'
import Services from '../components/Services/Services'
import Partners from '../components/Partners/Partners'
import Contact  from '../components/Contact/Contact'
import Footer   from '../components/Footer/Footer'
import ScrollToTop from '../components/ScrollToTop/ScrollToTop'

export default function HomePage() {
    return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <WhyUs />
        <Partners />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}