import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import AppSidebar from './AppSidebar'

function Navbar() {
  const { cartCount } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled]     = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const user  = JSON.parse(localStorage.getItem('user') || 'null')
  const token = localStorage.getItem('token')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setSidebarOpen(false)
  }, [location])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery.trim()}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const isActive = (path) => location.pathname === path

  const handleCartClick = () => {
    if (location.pathname === '/cart') navigate(-1)
    else navigate('/cart')
  }

  return (
    <>
      <nav
        style={{
          background: scrolled ? '#fff' : '#0f172a',
          borderBottom: scrolled ? '1px solid var(--border)' : 'none',
          transition: 'all 0.3s ease'
        }}
        className="fixed top-0 left-0 right-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight" style={{ color: scrolled ? '#0f172a' : '#fff' }}>
                MART
              </span>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded" style={{ background: '#f59e0b', color: '#fff' }}>
                STORE
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {[
                { path: '/', label: 'Home' },
                { path: '/products', label: 'Products' },
                { path: '/about', label: 'About' },
                { path: '/contact', label: 'Contact' },
              ].map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  style={{
                    color: isActive(path) ? '#f59e0b' : scrolled ? '#0f172a' : 'rgba(255,255,255,0.8)',
                    background: isActive(path)
                      ? scrolled ? 'rgba(245,158,11,0.08)' : 'rgba(255,255,255,0.08)'
                      : 'transparent'
                  }}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">

              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-lg transition-colors"
                style={{ color: scrolled ? '#71717a' : 'rgba(255,255,255,0.7)' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              <button onClick={handleCartClick} className="relative p-2 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: scrolled ? '#71717a' : 'rgba(255,255,255,0.7)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center"
                    style={{ background: '#f59e0b', fontSize: '10px' }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Desktop Auth — profile icon or sign in */}
              {token ? (
                <Link
                  to="/account"
                  className="hidden md:flex w-9 h-9 rounded-full items-center justify-center font-bold text-xs text-white flex-shrink-0"
                  style={{ background: '#f59e0b' }}
                >
                  {user?.full_name?.[0]?.toUpperCase()}
                </Link>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
                    style={{ color: scrolled ? '#0f172a' : 'rgba(255,255,255,0.8)' }}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-1.5 rounded-lg text-sm font-semibold transition-all"
                    style={{ background: '#f59e0b', color: '#fff' }}
                  >
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile hamburger — opens AppSidebar */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 rounded-lg"
                style={{ color: scrolled ? '#0f172a' : '#fff' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div style={{ background: '#fff', borderTop: '1px solid var(--border)' }} className="py-3">
            <form onSubmit={handleSearch} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  autoFocus
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm border focus:outline-none"
                  style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                />
                <button type="submit" className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: '#f59e0b' }}>
                  Search
                </button>
                <button type="button" onClick={() => setSearchOpen(false)} className="px-3 py-2.5 rounded-xl text-sm" style={{ color: 'var(--muted)' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </nav>

      {/* Mobile sidebar — overlay only, hidden on desktop */}
      <AppSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} alwaysVisibleDesktop={false} />

      {location.pathname !== '/' && <div className="h-16" />}
    </>
  )
}

export default Navbar