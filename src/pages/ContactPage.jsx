import Navbar  from '../components/Navbar/Navbar'
import Contact from '../components/Contact/Contact'
import Footer  from '../components/Footer/Footer'

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <div style={{ marginTop: 'var(--nav-height)' }}>
        <Contact />
      </div>
      <Footer />
    </>
  )
}