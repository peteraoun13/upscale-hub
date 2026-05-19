import Navbar  from '../components/Navbar/Navbar'
import Careers from '../components/Careers/Careers'
import Footer  from '../components/Footer/Footer'

export default function CareersPage() {
  return (
    <>
      <Navbar />
      <div style={{ marginTop: 'var(--nav-height)' }}>
        <Careers />
      </div>
      <Footer />
    </>
  )
}