import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import { NavigationLoadingContext } from './navigation/NavigationLoadingContext'
import Navbar       from './components/Navbar/Navbar'
import Footer       from './components/Footer/Footer'
import ScrollToTop  from './components/ScrollToTop/ScrollToTop'
import HomePage     from './pages/HomePage'
import ServicesPage from './pages/ServicesPage'
import ContactPage  from './pages/ContactPage'
import CareersPage  from './pages/CareersPage'
import AboutPage    from './pages/AboutPage'
import LoadingScreen from './components/LoadingScreen/LoadingScreen'

const MIN_LOADING_TIME = 900
const ROUTE_MIN_VISIBLE_TIME = 700
const ROUTE_LOADING_TIMEOUT = 8000

function useInitialLoading() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    let pageReady = document.readyState === 'complete'
    let minimumTimePassed = false

    const finishLoading = () => {
      if (isMounted && pageReady && minimumTimePassed) {
        setIsLoading(false)
      }
    }

    const handleLoad = () => {
      pageReady = true
      finishLoading()
    }

    const timer = window.setTimeout(() => {
      minimumTimePassed = true
      finishLoading()
    }, MIN_LOADING_TIME)

    if (pageReady) {
      finishLoading()
    } else {
      window.addEventListener('load', handleLoad, { once: true })
    }

    return () => {
      isMounted = false
      window.clearTimeout(timer)
      window.removeEventListener('load', handleLoad)
    }
  }, [])

  return isLoading
}

function ScrollToRouteTop() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function useRouteLoading(routeRef) {
  const { pathname } = useLocation()
  const [isRouteLoading, setIsRouteLoading] = useState(false)
  const hasMountedRef = useRef(false)
  const isRouteLoadingRef = useRef(false)
  const loaderShownAtRef = useRef(0)

  const startRouteLoading = useCallback(() => {
    loaderShownAtRef.current = performance.now()
    isRouteLoadingRef.current = true
    setIsRouteLoading(true)
  }, [])

  const stopRouteLoading = useCallback(() => {
    loaderShownAtRef.current = 0
    isRouteLoadingRef.current = false
    setIsRouteLoading(false)
  }, [])

  useLayoutEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      return undefined
    }

    let cancelled = false
    let finished = false
    let stopWaitingForImages = () => {}

    const ensureLoaderStarted = () => {
      if (!isRouteLoadingRef.current) startRouteLoading()
    }

    const finish = () => {
      if (finished) return
      finished = true

      stopWaitingForImages()

      const hideLoader = () => {
        if (!cancelled) stopRouteLoading()
      }

      if (!loaderShownAtRef.current) {
        hideLoader()
        return
      }

      const elapsed = performance.now() - loaderShownAtRef.current
      window.setTimeout(hideLoader, Math.max(0, ROUTE_MIN_VISIBLE_TIME - elapsed))
    }

    const startChecking = () => {
      if (cancelled) return
      ensureLoaderStarted()

      const container = routeRef.current
      const images = Array.from(container?.querySelectorAll('img') || [])
      const pendingImages = images.filter((img) => !img.complete || img.naturalWidth === 0)

      if (pendingImages.length === 0) {
        finish()
        return
      }

      let remaining = pendingImages.length

      const markComplete = () => {
        remaining -= 1
        if (remaining <= 0) finish()
      }

      pendingImages.forEach((img) => {
        img.addEventListener('load', markComplete, { once: true })
        img.addEventListener('error', markComplete, { once: true })
      })

      const fallbackTimer = window.setTimeout(finish, ROUTE_LOADING_TIMEOUT)

      stopWaitingForImages = () => {
        window.clearTimeout(fallbackTimer)
        pendingImages.forEach((img) => {
          img.removeEventListener('load', markComplete)
          img.removeEventListener('error', markComplete)
        })
      }
    }

    const checkTimer = window.setTimeout(startChecking, 0)

    return () => {
      cancelled = true
      window.clearTimeout(checkTimer)
      stopWaitingForImages()
    }
  }, [pathname, routeRef, startRouteLoading, stopRouteLoading])

  return { isRouteLoading, startRouteLoading }
}

function AppRoutes({ routeRef }) {
  const location = useLocation()

  return (
    <div className="route-content" ref={routeRef} key={location.pathname}>
      <Routes location={location}>
        <Route path="/"         element={<HomePage />}     />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/contact"  element={<ContactPage />}  />
        <Route path="/careers"  element={<CareersPage />}  />
        <Route path="/about"    element={<AboutPage />}    />
      </Routes>
    </div>
  )
}

function AppShell({ isInitialLoading }) {
  const location = useLocation()
  const routeRef = useRef(null)
  const { isRouteLoading, startRouteLoading } = useRouteLoading(routeRef)

  const beginNavigationLoading = useCallback((to) => {
    const targetPath = typeof to === 'string' ? to.split('#')[0] : ''
    if (!targetPath || targetPath === location.pathname) return
    startRouteLoading()
  }, [location.pathname, startRouteLoading])

  return (
    <NavigationLoadingContext.Provider value={beginNavigationLoading}>
      <div className="app-shell">
        <Navbar />
        <ScrollToRouteTop />
        <AppRoutes routeRef={routeRef} />
        <Footer />
        <ScrollToTop />
      </div>
      <LoadingScreen active={isInitialLoading || isRouteLoading} />
    </NavigationLoadingContext.Provider>
  )
}

export default function App() {
  const isInitialLoading = useInitialLoading()

  return (
    <BrowserRouter>
      <AppShell isInitialLoading={isInitialLoading} />
    </BrowserRouter>
  )
}
