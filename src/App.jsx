import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage     from './pages/HomePage'
import ServicesPage from './pages/ServicesPage'
import ContactPage  from './pages/ContactPage'
import CareersPage  from './pages/CareersPage'
import AboutPage    from './pages/AboutPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"         element={<HomePage />}     />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/contact"  element={<ContactPage />}  />
        <Route path="/careers"  element={<CareersPage />}  />
        <Route path="/about"    element={<AboutPage />}    />
      </Routes>
    </BrowserRouter>
  )
}