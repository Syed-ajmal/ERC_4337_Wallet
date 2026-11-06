import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import HomePage from './pages/Home_page.jsx'
import CreateWalletPage from './pages/Create_wallet.jsx'
import AboutPage from './pages/About_page.jsx'
import HowToUsePage from './pages/How_to_use.jsx'

function ScrollToHash() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) return
    const targetId = hash.slice(1)
    requestAnimationFrame(() => document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' }))
  }, [pathname, hash])

  return null
}

function AppRoutes() {
  return (
    <>
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-wallet" element={<CreateWalletPage />} />
        <Route path="/how-to-use" element={<HowToUsePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </>
  )
}

export default AppRoutes
