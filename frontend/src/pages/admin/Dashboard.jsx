import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../../api/axios'

const STAT_CARDS = [
  { key: 'totalProducts', label: 'Total Products', icon: '📦', color: 'bg-blue-50 text-blue-600' },
  { key: 'inStock',       label: 'In Stock',        icon: '✅', color: 'bg-green-50 text-green-600' },
  { key: 'lowStock',      label: 'Low Stock',       icon: '⚠️', color: 'bg-yellow-50 text-yellow-600' },
  { key: 'outOfStock',    label: 'Out of Stock',    icon: '❌', color: 'bg-red-50 text-red-600' },
]

function Dashboard() {
  const [stats, setStats]   = useState({ totalProducts: 0, inStock: 0, lowStock: 0, outOfStock: 0 })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await API.get('/products/admin/all')
      const products = response.data
      setStats({
        totalProducts: products.length,
        inStock:       products.filter(p => p.stock === 'in').length,
        lowStock:      products.filter(p => p.stock === 'low').length,
        outOfStock:    products.filter(p => p.stock === 'out').length,
      })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const user = JSON.parse(localStorage.getItem('user') || 'null')

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Admin Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm">Welcome back, {user?.full_name?.split(' ')[0]}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Quick Actions */}
        <div className="flex gap-3 mb-8 flex-wrap">
          <Link
            to="/admin/products"
            className="bg-indigo-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors text-sm"
          >
            Manage Products
          </Link>
          <Link
            to="/admin/products/new"
            className="border border-indigo-600 text-indigo-600 font-semibold px-5 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors text-sm"
          >
            + Add New Product
          </Link>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                <div className="bg-gray-200 h-8 w-8 rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-6 w-16 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 w-24 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {STAT_CARDS.map(card => (
              <div key={card.key} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-4 ${card.color}`}>
                  {card.icon}
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {stats[card.key]}
                </p>
                <p className="text-gray-500 text-sm">{card.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-1">Products</h3>
            <p className="text-gray-500 text-sm mb-4">Add, edit and manage your product catalogue</p>
            <Link
              to="/admin/products"
              className="text-indigo-600 font-medium text-sm hover:underline"
            >
              Go to Products →
            </Link>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-1">Store</h3>
            <p className="text-gray-500 text-sm mb-4">View your store as customers see it</p>
            <Link
              to="/"
              className="text-indigo-600 font-medium text-sm hover:underline"
            >
              View Store →
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard