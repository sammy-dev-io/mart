import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import API from '../../api/axios'
import { AdminLayout } from './Dashboard'

const STOCK_OPTIONS  = [
  { value: 'in',  label: 'In Stock' },
  { value: 'low', label: 'Low Stock' },
  { value: 'out', label: 'Out of Stock' },
]

const BADGE_OPTIONS = [
  { value: '',     label: 'None' },
  { value: 'hot',  label: 'Hot' },
  { value: 'sale', label: 'Sale' },
  { value: 'new',  label: 'New' },
]

function ProductForm() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const isEditing    = Boolean(id)
  const [loading, setLoading]   = useState(false)
  const [fetching, setFetching] = useState(isEditing)
  const [error, setError]       = useState(null)
  const [success, setSuccess]   = useState(false)
  const [formData, setFormData] = useState({
    name: '', description: '', price: '',
    original_price: '', category: '', image: '',
    stock: 'in', badge: '', rating: 0
  })

  useEffect(() => {
    if (isEditing) fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      setFetching(true)
      const response = await API.get(`/products/${id}`)
      const p = response.data
      setFormData({
        name: p.name || '', description: p.description || '', price: p.price || '',
        original_price: p.original_price || '', category: p.category || '', image: p.image || '',
        stock: p.stock || 'in', badge: p.badge || '', rating: p.rating || 0
      })
    } catch (err) {
      setError('Failed to fetch product')
    } finally {
      setFetching(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        rating: parseFloat(formData.rating)
      }
      if (isEditing) await API.put(`/products/${id}`, payload)
      else await API.post('/products/', payload)
      setSuccess(true)
      setTimeout(() => navigate('/admin/products'), 1200)
    } catch (err) {
      setError('Failed to save product. Please check all fields.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = { border: '1px solid var(--border)' }
  const handleFocus = (e) => e.target.style.borderColor = '#f59e0b'
  const handleBlur  = (e) => e.target.style.borderColor = 'var(--border)'

  if (fetching) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 rounded-full animate-spin" style={{ borderColor: 'var(--border)', borderTopColor: '#f59e0b' }}></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">

        <div className="flex items-center gap-3 mb-6">
          <Link to="/admin/products" className="text-sm" style={{ color: 'var(--muted)' }}>← Products</Link>
          <span style={{ color: 'var(--border)' }}>|</span>
          <h1 className="text-lg sm:text-xl font-black" style={{ color: 'var(--primary)' }}>
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h1>
        </div>

        {success && (
          <div className="rounded-xl p-4 mb-5 text-sm" style={{ background: 'rgba(16,185,129,0.08)', color: '#059669', border: '1px solid rgba(16,185,129,0.2)' }}>
            Product {isEditing ? 'updated' : 'created'} successfully! Redirecting...
          </div>
        )}

        {error && (
          <div className="rounded-xl p-4 mb-5 text-sm" style={{ background: 'rgba(244,63,94,0.08)', color: '#e11d48', border: '1px solid rgba(244,63,94,0.2)' }}>
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl p-4 sm:p-6" style={{ border: '1px solid var(--border)' }}>
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>Product Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required
                placeholder="e.g. Classic White Shirt"
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all"
                style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={3}
                placeholder="Describe the product..."
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all resize-none"
                style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>Price (₦) *</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0"
                  placeholder="25000"
                  className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all"
                  style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>Original Price (₦)</label>
                <input type="number" name="original_price" value={formData.original_price} onChange={handleChange} min="0"
                  placeholder="35000"
                  className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all"
                  style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
              </div>
            </div>

            <div>
  <label
    className="block text-sm font-medium mb-1.5"
    style={{ color: 'var(--text)' }}
  >
    Category *
  </label>

  <select
    name="category"
    value={formData.category}
    onChange={handleChange}
    required
    className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all"
    style={inputStyle}
    onFocus={handleFocus}
    onBlur={handleBlur}
  >
    <option value="">Select a category</option>
    <option value="Electronics">Electronics</option>
    <option value="Fashion">Fashion</option>
    <option value="Home">Home</option>
    <option value="Beauty">Beauty</option>
    <option value="Food">Food</option>
    <option value="Sports">Sports</option>
  </select>
</div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>Image URL</label>
              <input type="text" name="image" value={formData.image} onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all"
                style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
              {formData.image && (
                <div className="mt-2 w-20 h-20 rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none' }} />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>Stock Status</label>
                <select name="stock" value={formData.stock} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none bg-white"
                  style={inputStyle}>
                  {STOCK_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>Badge</label>
                <select name="badge" value={formData.badge} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none bg-white"
                  style={inputStyle}>
                  {BADGE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>Rating (0 – 5)</label>
              <input type="number" name="rating" value={formData.rating} onChange={handleChange} min="0" max="5" step="0.1"
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all"
                style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button type="submit" disabled={loading || success}
                className="flex-1 font-bold py-3 rounded-xl transition-colors text-sm text-white"
                style={{ background: loading || success ? '#fbbf24' : '#f59e0b' }}>
                {loading ? 'Saving...' : isEditing ? 'Update Product' : 'Add Product'}
              </button>
              <Link to="/admin/products"
                className="flex-1 text-center font-bold py-3 rounded-xl text-sm transition-colors"
                style={{ border: '1px solid var(--border)', color: 'var(--text)' }}>
                Cancel
              </Link>
            </div>

          </form>
        </div>
      </div>
    </AdminLayout>
  )
}

export default ProductForm