import { Link, useNavigate, useLocation } from 'react-router-dom'

function AppSidebar({ isOpen, onClose, alwaysVisibleDesktop = false }) {
  const navigate = useNavigate()
  const location = useLocation()
  const user  = JSON.parse(localStorage.getItem('user') || 'null')
  const token = localStorage.getItem('token')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
    onClose && onClose()
  }

  const closeIfMobile = () => onClose && onClose()
  const isActive = (path) => location.pathname === path

  const mainLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ]

  const accountLinks = [
    { path: '/account', label: 'Overview' },
    { path: '/orders', label: 'My Orders' },
    { path: '/account/settings', label: 'Account Settings' },
  ]

  const linkStyle = (path) => ({
    color: isActive(path) ? '#f59e0b' : 'rgba(255,255,255,0.7)',
    background: isActive(path) ? 'rgba(245,158,11,0.1)' : 'transparent'
  })

  return (
    <>
      {isOpen && (
        <div onClick={onClose} className={`fixed inset-0 bg-black/40 z-40 ${alwaysVisibleDesktop ? 'md:hidden' : 'md:hidden'}`} />
      )}

      <aside
        className={`w-64 fixed top-0 right-0 md:right-auto md:left-0 h-full z-50 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } ${alwaysVisibleDesktop ? 'md:translate-x-0' : 'md:hidden'}`}
        style={{ background: 'var(--primary)' }}
      >
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <Link to="/" onClick={closeIfMobile} className="flex items-center gap-2">
            <span className="text-xl font-black text-white">MART</span>
            <span className="text-xs font-bold px-1.5 py-0.5 rounded text-white" style={{ background: '#f59e0b' }}>
              STORE
            </span>
          </Link>
          <button onClick={onClose} className="text-white/60 md:hidden">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User card */}
        {token && user && (
          <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
                style={{ background: '#f59e0b' }}
              >
                {user.full_name?.[0]?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">{user.full_name}</p>
                <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-6 py-5 flex flex-col min-h-0">
  <div className="overflow-y-auto flex-1 space-y-1 pr-1">
  <p className="px-3 text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
    Browse
  </p>
  {mainLinks.map(item => (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeIfMobile}
              className="block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={linkStyle(item.path)}
            >
              {item.label}
            </Link>
          ))}

          {token && (
            <>
              <p className="px-3 text-xs font-bold uppercase tracking-widest mb-2 mt-5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                My Account
              </p>
              {accountLinks.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeIfMobile}
                  className="block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
                  style={linkStyle(item.path)}
                >
                  {item.label}
                </Link>
              ))}
              {user?.is_admin && (
                <Link
                  to="/admin"
                  onClick={closeIfMobile}
                  className="block px-3 py-2.5 rounded-xl text-sm font-bold transition-colors mt-1"
                  style={{ color: '#f59e0b' }}
                >
                  Admin Panel
                </Link>
              )}
            </>
          )}
          </div>
        </nav>

        {/* Bottom actions */}
        <div className="px-6 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {token ? (
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{ color: '#f43f5e' }}
            >
              Logout
            </button>
          ) : (
            <div className="space-y-2">
              <Link
                to="/login"
                onClick={closeIfMobile}
                className="block text-center px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
                style={{ color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={closeIfMobile}
                className="block text-center px-3 py-2.5 rounded-xl text-sm font-bold text-white transition-colors"
                style={{ background: '#f59e0b' }}
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

export default AppSidebar