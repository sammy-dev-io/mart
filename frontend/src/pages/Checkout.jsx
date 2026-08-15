import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import API from '../api/axios'

function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({ address: '', phone: '', note: '' })

  const user = JSON.parse(localStorage.getItem('user') || 'null')

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    if (cartItems.length === 0) navigate('/cart')
  }, [])

  if (!user || cartItems.length === 0) return null

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
        items: cartItems.map(item => ({ product_id: item.id, quantity: item.quantity }))
      }
      const response = await API.post('/orders/', orderPayload)
      const order = response.data
      navigate('/payment', { state: { orderId: order.id, orderTotal: order.total, userEmail: user.email } })
      clearCart()
    } catch (err) {
      setError('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = { border: '1px solid var(--border)' }
  const handleFocus = (e) => e.target.style.borderColor = '#f59e0b'
  const handleBlur  = (e) => e.target.style.borderColor = 'var(--border)'

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-black" style={{ color: 'var(--primary)' }}>Checkout</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Fill in your delivery details to complete your order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-4 sm:p-6" style={{ border: '1px solid var(--border)' }}>
              <h2 className="font-bold text-sm mb-5" style={{ color: 'var(--primary)' }}>Delivery Details</h2>

              {error && (
                <div className="rounded-xl p-4 mb-5 text-sm" style={{ background: 'rgba(244,63,94,0.08)', color: '#e11d48', border: '1px solid rgba(244,63,94,0.2)' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">

                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>Full Name</label>
                  <input type="text" value={user.full_name} disabled
                    className="w-full px-4 py-3 rounded-xl text-sm cursor-not-allowed"
                    style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--muted)' }} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>Email Address</label>
                  <input type="email" value={user.email} disabled
                    className="w-full px-4 py-3 rounded-xl text-sm cursor-not-allowed"
                    style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--muted)' }} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>Delivery Address *</label>
                  <textarea name="address" value={formData.address} onChange={handleChange} required rows={3}
                    placeholder="Enter your full delivery address"
                    className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all resize-none"
                    style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>Phone Number *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required
                    placeholder="08012345678"
                    className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all"
                    style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>
                    Order Note <span className="font-normal" style={{ color: 'var(--muted)' }}>(optional)</span>
                  </label>
                  <textarea name="note" value={formData.note} onChange={handleChange} rows={2}
                    placeholder="Any special instructions..."
                    className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all resize-none"
                    style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
                </div>

                <button type="submit" disabled={loading}
                  className="w-full font-bold py-3.5 rounded-xl transition-colors text-sm text-white"
                  style={{ background: loading ? '#fbbf24' : '#f59e0b' }}>
                  {loading ? 'Placing Order...' : 'Place Order & Pay'}
                </button>

              </form>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-4 sm:p-5 lg:sticky lg:top-20" style={{ border: '1px solid var(--border)' }}>
              <h2 className="font-bold text-sm mb-4" style={{ color: 'var(--primary)' }}>Order Summary</h2>

              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                {cartItems.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0" style={{ background: 'var(--bg)' }}>
                      <img src={item.image || 'https://via.placeholder.com/48'} alt={item.name} className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/48' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--primary)' }}>{item.name}</p>
                      <p className="text-xs" style={{ color: 'var(--muted)' }}>Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>₦{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="pt-4 space-y-2" style={{ borderTop: '1px solid var(--border)' }}>
                <div className="flex justify-between text-sm" style={{ color: 'var(--muted)' }}>
                  <span>Subtotal</span><span>₦{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm" style={{ color: 'var(--muted)' }}>
                  <span>Delivery</span><span style={{ color: '#059669', fontWeight: 600 }}>Free</span>
                </div>
                <div className="flex justify-between font-bold pt-2" style={{ color: 'var(--primary)', borderTop: '1px solid var(--bg)' }}>
                  <span>Total</span>
                  <span className="text-lg" style={{ color: '#f59e0b' }}>₦{cartTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-4 rounded-xl p-3" style={{ background: 'rgba(245,158,11,0.08)' }}>
                <p className="text-xs text-center" style={{ color: '#d97706' }}>Secured by Paystack</p>
              </div>

              <Link to="/cart" className="block text-center text-sm mt-3" style={{ color: 'var(--muted)' }}>
                ← Edit Cart
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Checkout