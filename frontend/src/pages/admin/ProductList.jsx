import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../api/axios'

function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
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
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    try {
      await API.delete(`/products/${id}`)
      setProducts(products.filter(p => p.id !== id))
    } catch (err) {
      setError('Failed to delete product')
      console.error(err)
    }
  }

  if (loading) return <div>Loading products...</div>
  if (error) return <div>{error}</div>

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1>All Products</h1>
        <button onClick={() => navigate('/admin/products/new')}>
          Add New Product
        </button>
      </div>

      {products.length === 0 ? (
        <p>No products found. Add your first product.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Price</th>
              <th style={thStyle}>Stock</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td style={tdStyle}>{product.id}</td>
                <td style={tdStyle}>{product.name}</td>
                <td style={tdStyle}>{product.category}</td>
                <td style={tdStyle}>₦{product.price.toLocaleString()}</td>
                <td style={tdStyle}>{product.stock}</td>
                <td style={tdStyle}>
                  <button
                    onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                    style={{ marginRight: '0.5rem' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    style={{ color: 'red' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

const thStyle = {
  textAlign: 'left',
  padding: '0.75rem',
  borderBottom: '2px solid #ccc',
  backgroundColor: '#f5f5f5'
}

const tdStyle = {
  padding: '0.75rem',
  borderBottom: '1px solid #eee'
}

export default ProductList