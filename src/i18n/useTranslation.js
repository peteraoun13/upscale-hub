import { useState, useEffect, useCallback } from 'react'
import translations from './translations'

let currentLang = localStorage.getItem('lang') || 'en'
const listeners = new Set()

function setGlobalLang(lang) {
  currentLang = lang
  localStorage.setItem('lang', lang)
  listeners.forEach(fn => fn(lang))
}

export function useTranslation() {
  const [lang, setLang] = useState(currentLang)

  // ✅ useEffect instead of useState for subscriptions
  useEffect(() => {
    listeners.add(setLang)
    return () => listeners.delete(setLang)
  }, [])

  const t = useCallback(
    (key) => {
      const keys = key.split('.')
      let val = translations[lang]
      for (const k of keys) val = val?.[k]
      return val ?? key
    },
    [lang]
  )

  const toggleLang = useCallback(() => {
    setGlobalLang(lang === 'en' ? 'fr' : 'en')
  }, [lang])

  return { t, lang, toggleLang }
}