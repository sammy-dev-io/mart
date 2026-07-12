import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import API from '../../api/axios'

function ProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    category: '',
    image: '',
    stock: 'in',
    badge: '',
    rating: 0
  })

  useEffect(() => {
    if (isEditing) {
      fetchProduct()
    }
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await API.get(`/products/${id}`)
      const product = response.data
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        original_price: product.original_price || '',
        category: product.category || '',
        image: product.image || '',
        stock: product.stock || 'in',
        badge: product.badge || '',
        rating: product.rating || 0
      })
    } catch (err) {
      setError('Failed to fetch product')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
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

      if (isEditing) {
        await API.put(`/products/${id}`, payload)
      } else {
        await API.post('/products/', payload)
      }

      navigate('/admin/products')
    } catch (err) {
      setError('Failed to save product. Please check all fields.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div style={{ padding: '2rem', maxWidth: '600px' }}>
      <h1>{isEditing ? 'Edit Product' : 'Add New Product'}</h1>

      {error && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        <div style={fieldStyle}>
          <label>Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label>Price (₦) *</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label>Original Price (₦) — leave blank if not on sale</label>
          <input
            type="number"
            name="original_price"
            value={formData.original_price}
            onChange={handleChange}
            min="0"
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label>Category *</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label>Image URL</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            style={inputStyle}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div style={fieldStyle}>
          <label>Stock</label>
          <select
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="in">In Stock</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>

        <div style={fieldStyle}>
          <label>Badge</label>
          <select
            name="badge"
            value={formData.badge}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">None</option>
            <option value="hot">Hot</option>
            <option value="sale">Sale</option>
            <option value="new">New</option>
          </select>
        </div>

        <div style={fieldStyle}>
          <label>Rating (0 - 5)</label>
          <input
            type="number"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            min="0"
            max="5"
            step="0.1"
            style={inputStyle}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button
            type="submit"
            disabled={loading}
            style={{ padding: '0.75rem 2rem' }}
          >
            {loading ? 'Saving...' : isEditing ? 'Update Product' : 'Add Product'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            style={{ padding: '0.75rem 2rem' }}
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  )
}

const fieldStyle = {
  marginBottom: '1.25rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35rem'
}

const inputStyle = {
  padding: '0.5rem',
  fontSize: '1rem',
  border: '1px solid #ccc',
  borderRadius: '4px',
  width: '100%'
}

export default ProductForm