import { useState, useEffect } from 'react'
import './ScrollToTop.css'
import chevronUp from '../../assets/chevron-up.png'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollUp = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      className={`scroll-top${visible ? ' scroll-top--visible' : ''}`}
      onClick={scrollUp}
      aria-label="Scroll to top"
    >
      <img src={chevronUp} alt="" className="scroll-top__icon" />
    </button>
  )
}