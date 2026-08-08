import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import API from '../api/axios'

function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    address: '',
    phone: '',
    note: ''
  })

  const user = JSON.parse(localStorage.getItem('user') || 'null')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    if (cartItems.length === 0) {
      navigate('/cart')
    }
  }, [])

  if (!user || cartItems.length === 0) {
    return null
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

      const orderPayload = {
        address: formData.address,
        phone: formData.phone,
        note: formData.note,
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        }))
      }

      const response = await API.post('/orders/', orderPayload)
      const order = response.data

      navigate('/payment', {
        state: {
          orderId: order.id,
          orderTotal: order.total,
          userEmail: user.email
        }
      })

      clearCart()

    } catch (err) {
      setError('Failed to place order. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Checkout</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

        <div>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Delivery Details</h2>

          {error && (
            <div style={{ color: 'red', padding: '0.75rem', border: '1px solid #fcc', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Delivery Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows={3}
                style={{ ...inputStyle, resize: 'vertical' }}
                placeholder="Enter your full delivery address"
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                style={inputStyle}
                placeholder="08012345678"
              />
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Order Note (optional)</label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                rows={2}
                style={{ ...inputStyle, resize: 'vertical' }}
                placeholder="Any special instructions..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={btnStyle}
            >
              {loading ? 'Placing Order...' : `Place Order — ₦${cartTotal.toLocaleString()}`}
            </button>
          </form>
        </div>

        <div>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Order Summary</h2>
          <div style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden' }}>
            {cartItems.map(item => (
              <div key={item.id} style={summaryItemStyle}>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 0.2rem', fontWeight: '600', fontSize: '0.9rem' }}>
                    {item.name}
                  </p>
                  <p style={{ margin: 0, color: '#666', fontSize: '0.8rem' }}>
                    Qty: {item.quantity}
                  </p>
                </div>
                <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                  ₦{(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
            <div style={{ padding: '1rem', borderTop: '2px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 'bold' }}>Total</span>
              <span style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
                ₦{cartTotal.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

const fieldStyle = { marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }
const labelStyle = { fontSize: '0.875rem', fontWeight: '500', color: '#333' }
const inputStyle = { padding: '0.65rem 0.875rem', fontSize: '0.95rem', border: '1px solid #ddd', borderRadius: '6px', width: '100%', outline: 'none' }
const btnStyle = { width: '100%', padding: '0.875rem', backgroundColor: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }
const summaryItemStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem 1rem', borderBottom: '1px solid #eee' }

export default Checkout