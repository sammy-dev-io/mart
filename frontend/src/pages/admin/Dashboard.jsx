import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../api/axios'

function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    inStock: 0,
    lowStock: 0,
    outOfStock: 0
  })
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
        inStock: products.filter(p => p.stock === 'in').length,
        lowStock: products.filter(p => p.stock === 'low').length,
        outOfStock: products.filter(p => p.stock === 'out').length
      })
    } catch (err) {
      console.error('Failed to fetch stats', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Admin Dashboard</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Welcome back. Here is your store summary.
      </p>

      <div style={gridStyle}>
        <div style={cardStyle}>
          <h3 style={{ color: '#666', fontWeight: 'normal' }}>Total Products</h3>
          <p style={numStyle}>{stats.totalProducts}</p>
        </div>
        <div style={cardStyle}>
          <h3 style={{ color: '#666', fontWeight: 'normal' }}>In Stock</h3>
          <p style={{ ...numStyle, color: 'green' }}>{stats.inStock}</p>
        </div>
        <div style={cardStyle}>
          <h3 style={{ color: '#666', fontWeight: 'normal' }}>Low Stock</h3>
          <p style={{ ...numStyle, color: 'orange' }}>{stats.lowStock}</p>
        </div>
        <div style={cardStyle}>
          <h3 style={{ color: '#666', fontWeight: 'normal' }}>Out of Stock</h3>
          <p style={{ ...numStyle, color: 'red' }}>{stats.outOfStock}</p>
        </div>
      </div>

      <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem' }}>
        <button
          onClick={() => navigate('/admin/products')}
          style={{ padding: '0.75rem 1.5rem' }}
        >
          Manage Products
        </button>
        <button
          onClick={() => navigate('/admin/products/new')}
          style={{ padding: '0.75rem 1.5rem' }}
        >
          Add New Product
        </button>
      </div>
    </div>
  )
}

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '1rem'
}

const cardStyle = {
  padding: '1.5rem',
  border: '1px solid #eee',
  borderRadius: '8px',
  backgroundColor: '#fafafa'
}

const numStyle = {
  fontSize: '2.5rem',
  fontWeight: 'bold',
  margin: '0.5rem 0 0 0'
}

export default Dashboard