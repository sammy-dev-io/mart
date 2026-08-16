import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../../api/axios'
import { AdminLayout } from './Dashboard'

function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [search, setSearch]     = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await API.get('/products/admin/all')
      setProducts(response.data)
    } catch (err) {
      setError('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Deactivate this product?')) return
    try {
      await API.delete(`/products/${id}`)
      setProducts(products.map(p => p.id === id ? { ...p, is_active: false } : p))
    } catch (err) {
      alert('Failed to delete product')
    }
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  const STOCK_STYLES = {
    in:  { bg: 'rgba(16,185,129,0.1)', text: '#059669' },
    low: { bg: 'rgba(245,158,11,0.1)', text: '#d97706' },
    out: { bg: 'rgba(244,63,94,0.1)',  text: '#e11d48' },
  }

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8 overflow-x-hidden">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <h1 className="text-xl sm:text-2xl font-black" style={{ color: 'var(--primary)' }}>All Products</h1>
          <Link
            to="/admin/products/new"
            className="text-center font-bold px-4 py-2.5 rounded-xl text-sm text-white transition-all whitespace-nowrap"
            style={{ background: '#f59e0b' }}
          >
            + Add Product
          </Link>
        </div>

        <div className="relative mb-5 max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none"
            style={{ border: '1px solid var(--border)' }}
          />
        </div>

        <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>
          {filtered.length} product{filtered.length !== 1 ? 's' : ''}
        </p>

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-16 animate-pulse" style={{ border: '1px solid var(--border)' }}></div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10" style={{ color: '#e11d48' }}>{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p style={{ color: 'var(--muted)' }}>No products found</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted)' }}>Product</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted)' }}>Category</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted)' }}>Price</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted)' }}>Stock</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted)' }}>Status</th>
                    <th className="text-right px-5 py-3.5 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(product => (
                    <tr key={product.id} style={{ borderBottom: '1px solid var(--bg)' }}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0" style={{ background: 'var(--bg)' }}>
                            <img
                              src={product.image || 'https://via.placeholder.com/40'}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.src = 'https://via.placeholder.com/40' }}
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-sm" style={{ color: 'var(--primary)' }}>{product.name}</p>
                            <p className="text-xs" style={{ color: 'var(--muted)' }}>ID: {product.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm capitalize" style={{ color: 'var(--text)' }}>{product.category}</td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-sm" style={{ color: 'var(--primary)' }}>₦{product.price.toLocaleString()}</p>
                        {product.original_price && (
                          <p className="text-xs line-through" style={{ color: 'var(--muted)' }}>₦{product.original_price.toLocaleString()}</p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: STOCK_STYLES[product.stock].bg, color: STOCK_STYLES[product.stock].text }}>
                          {product.stock === 'in' ? 'In Stock' : product.stock === 'low' ? 'Low Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className="text-xs font-medium px-2.5 py-1 rounded-full"
                          style={{
                            background: product.is_active ? 'rgba(16,185,129,0.1)' : 'rgba(15,23,42,0.06)',
                            color: product.is_active ? '#059669' : 'var(--muted)'
                          }}
                        >
                          {product.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                            className="text-sm font-medium transition-colors"
                            style={{ color: '#f59e0b' }}
                          >
                            Edit
                          </button>
                          <span style={{ color: 'var(--border)' }}>|</span>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-sm font-medium transition-colors"
                            style={{ color: '#f43f5e' }}
                          >
                            Deactivate
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {filtered.map(product => (
                <div key={product.id} className="bg-white rounded-2xl p-4" style={{ border: '1px solid var(--border)' }}>
                  <div className="flex gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0" style={{ background: 'var(--bg)' }}>
                      <img
                        src={product.image || 'https://via.placeholder.com/48'}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/48' }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate" style={{ color: 'var(--primary)' }}>{product.name}</p>
                      <p className="text-xs capitalize" style={{ color: 'var(--muted)' }}>{product.category}</p>
                      <p className="font-bold text-sm mt-0.5" style={{ color: '#f59e0b' }}>₦{product.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: STOCK_STYLES[product.stock].bg, color: STOCK_STYLES[product.stock].text }}>
                        {product.stock === 'in' ? 'In Stock' : product.stock === 'low' ? 'Low' : 'Out'}
                      </span>
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{
                          background: product.is_active ? 'rgba(16,185,129,0.1)' : 'rgba(15,23,42,0.06)',
                          color: product.is_active ? '#059669' : 'var(--muted)'
                        }}
                      >
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => navigate(`/admin/products/edit/${product.id}`)} className="text-sm font-medium" style={{ color: '#f59e0b' }}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="text-sm font-medium" style={{ color: '#f43f5e' }}>
                        Deactivate
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}

export default ProductList