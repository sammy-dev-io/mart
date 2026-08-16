import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../../api/axios'

const STAT_CARDS = [
  { key: 'inStock',       label: 'In Stock' },
  { key: 'lowStock',      label: 'Low Stock' },
  { key: 'outOfStock',    label: 'Out of Stock' },
]

function AdminLayout({ children }) {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const navLinks = [
    { path: '/admin', label: 'Dashboard' },
    { path: '/admin/products', label: 'Products' },
    { path: '/admin/products/new', label: 'Add Product' },
    { path: '/admin/orders', label: 'Orders' },
    { path: '/admin/customers', label: 'Customers' },
]

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>

      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/40 z-30 md:hidden" />
      )}

      {/* Sidebar */}
      <aside
  className={`w-64 fixed top-0 right-0 md:right-auto md:left-0 h-full z-40 flex flex-col transition-transform duration-300 ${
    sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
  }`}
  style={{ background: 'var(--primary)' }}
>
        <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div>
            <Link to="/" className="text-xl font-black text-white">MART</Link>
            <p className="text-xs mt-0.5" style={{ color: '#f59e0b' }}>Admin Panel</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-white/60">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 px-6 py-5 flex flex-col min-h-0">
  <div className="overflow-y-auto flex-1 space-y-1 pr-1">
  {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setSidebarOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{ color: 'rgba(255,255,255,0.7)' }}
              onMouseEnter={(e) => { e.target.style.background = 'rgba(245,158,11,0.12)'; e.target.style.color = '#f59e0b' }}
              onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = 'rgba(255,255,255,0.7)' }}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 mt-4 space-y-1" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <Link
              to="/"
              className="block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              View Store
            </Link>
            <Link
              to="/account"
              className="block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors mt-1"
              style={{ color: '#f59e0b' }}
            >
              My Account
            </Link>
          </div>
          </div>
        </nav>

        <div className="px-6 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 text-white"
              style={{ background: '#f59e0b' }}
            >
              {user?.full_name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.full_name}</p>
              <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
            style={{ color: '#f43f5e' }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div
  className="md:hidden fixed top-0 left-0 right-0 h-14 z-20 flex items-center justify-between px-4"
  style={{ background: 'var(--primary)' }}
>
  <span className="font-black text-white">MART Admin</span>
  <button onClick={() => setSidebarOpen(true)} className="text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <main className="flex-1 md:ml-64 min-h-screen pt-14 md:pt-0 overflow-x-hidden">
        {children}
      </main>
    </div>
  )
}

function Dashboard() {
  const [stats, setStats] = useState({ totalProducts: 0, inStock: 0, lowStock: 0, outOfStock: 0, totalOrders: 0, revenue: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        API.get('/products/admin/all'),
        API.get('/orders/')
      ])
      const products = productsRes.data
      const orders   = ordersRes.data
      const revenue  = orders
        .filter(o => o.status !== 'cancelled' && o.status !== 'pending')
        .reduce((sum, o) => sum + o.total, 0)

      setStats({
        totalProducts: products.length,
        inStock:       products.filter(p => p.stock === 'in').length,
        lowStock:      products.filter(p => p.stock === 'low').length,
        outOfStock:    products.filter(p => p.stock === 'out').length,
        totalOrders:   orders.length,
        revenue:       revenue
      })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
}

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8">

        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-black" style={{ color: 'var(--primary)' }}>Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Here is what is happening in your store today</p>
        </div>

          {loading ? (
          <div className="space-y-3 sm:space-y-4 mb-8">
            <div className="bg-white rounded-2xl p-5 sm:p-6 animate-pulse" style={{ border: '1px solid var(--border)' }}>
              <div className="h-8 w-32 rounded mb-2" style={{ background: 'var(--bg)' }}></div>
              <div className="h-4 w-24 rounded" style={{ background: 'var(--bg)' }}></div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 sm:p-6 animate-pulse" style={{ border: '1px solid var(--border)' }}>
                  <div className="h-6 w-16 rounded mb-2" style={{ background: 'var(--bg)' }}></div>
                  <div className="h-4 w-24 rounded" style={{ background: 'var(--bg)' }}></div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 sm:p-6 animate-pulse" style={{ border: '1px solid var(--border)' }}>
                  <div className="h-6 w-16 rounded mb-2" style={{ background: 'var(--bg)' }}></div>
                  <div className="h-4 w-24 rounded" style={{ background: 'var(--bg)' }}></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4 mb-8">

            {/* Revenue — hero row, full width */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-black mb-1 truncate" style={{ color: '#f59e0b' }}>
                ₦{stats.revenue.toLocaleString()}
              </p>
              <p className="text-xs sm:text-sm" style={{ color: 'var(--muted)' }}>Total Revenue</p>
            </div>

            {/* Orders + Products — side by side */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-white rounded-2xl p-5 sm:p-6 overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <p className="text-xl sm:text-2xl font-black mb-1 truncate" style={{ color: 'var(--primary)' }}>{stats.totalOrders}</p>
                <p className="text-xs sm:text-sm" style={{ color: 'var(--muted)' }}>Total Orders</p>
              </div>
              <div className="bg-white rounded-2xl p-5 sm:p-6 overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                <p className="text-xl sm:text-2xl font-black mb-1 truncate" style={{ color: 'var(--primary)' }}>{stats.totalProducts}</p>
                <p className="text-xs sm:text-sm" style={{ color: 'var(--muted)' }}>Total Products</p>
              </div>
            </div>

            {/* Stock breakdown — three across */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {STAT_CARDS.map(card => (
                <div key={card.key} className="bg-white rounded-2xl p-3 sm:p-6 overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                  <p className="text-lg sm:text-2xl font-black mb-1 truncate" style={{ color: 'var(--primary)' }}>{stats[card.key]}</p>
                  <p className="text-[10px] sm:text-sm truncate" style={{ color: 'var(--muted)' }}>{card.label}</p>
                </div>
              ))}
            </div>

          </div>
        )}
    

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-6 transition-shadow hover:shadow-md" style={{ border: '1px solid var(--border)' }}>
            <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--primary)' }}>All Products</h3>
            <p className="text-xs mb-4" style={{ color: 'var(--muted)' }}>View and manage your entire catalogue</p>
            <Link to="/admin/products" className="text-sm font-semibold" style={{ color: '#f59e0b' }}>Manage →</Link>
          </div>
          <div className="bg-white rounded-2xl p-6 transition-shadow hover:shadow-md" style={{ border: '1px solid var(--border)' }}>
            <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--primary)' }}>Add Product</h3>
            <p className="text-xs mb-4" style={{ color: 'var(--muted)' }}>List a new product in your store</p>
            <Link to="/admin/products/new" className="text-sm font-semibold" style={{ color: '#f59e0b' }}>Add New →</Link>
          </div>
          <div className="bg-white rounded-2xl p-6 transition-shadow hover:shadow-md" style={{ border: '1px solid var(--border)' }}>
            <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--primary)' }}>View Store</h3>
            <p className="text-xs mb-4" style={{ color: 'var(--muted)' }}>See your store as customers see it</p>
            <Link to="/" className="text-sm font-semibold" style={{ color: '#f59e0b' }}>Open Store →</Link>
          </div>
        </div>

      </div>
    </AdminLayout>
  )
}

export { AdminLayout }
export default Dashboard