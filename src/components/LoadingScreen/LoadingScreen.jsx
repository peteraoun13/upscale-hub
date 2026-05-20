import { useEffect, useState } from 'react'
import './LoadingScreen.css'
import logo from '../../assets/logo.png'

const DOTS = Array.from({ length: 7 })
const EXIT_DURATION_MS = 220

export default function LoadingScreen({ active }) {
  const [shouldRender, setShouldRender] = useState(active)
  const visible = active || shouldRender

  useEffect(() => {
    const timer = window.setTimeout(
      () => setShouldRender(active),
      active ? 0 : EXIT_DURATION_MS
    )

    return () => window.clearTimeout(timer)
  }, [active])

  useEffect(() => {
    if (!visible) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [visible])

  if (!visible) return null

  return (
    <div
      className={`loading-screen${active ? ' is-active' : ' is-hiding'}`}
      role="status"
      aria-live="polite"
      aria-label="Loading Upscale Hub"
    >
      <div className="loading-screen__content">
        <img src={logo} alt="" className="loading-screen__logo" />
        <div className="loading-screen__dots" aria-hidden="true">
          {DOTS.map((_, index) => (
            <span key={index} className="loading-screen__dot" />
          ))}
        </div>
        <span className="loading-screen__label">Loading Upscale Hub</span>
      </div>
    </div>
  )
}
