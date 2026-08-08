import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import API from '../api/axios'

function Payment() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState(null)
  const [reference, setReference] = useState(null)
  const [orderInfo, setOrderInfo] = useState(null)

  useEffect(() => {
    const state = location.state
    if (!state || !state.orderId) {
      navigate('/orders')
      return
    }
    setOrderInfo(state)
    initializePayment(state.orderId, state.userEmail)
  }, [])

  const initializePayment = async (orderId, email) => {
    try {
      setLoading(true)
      const response = await API.post('/payments/initialize', {
        order_id: orderId,
        email: email
      })
      const { data } = response.data
      setReference(data.access_code)
    } catch (err) {
      setError('Failed to initialize payment. Please try again.')
    } finally {
      setLoading(false)
    }
}

  const openPaystackPopup = () => {
    if (!reference || !orderInfo) return
    
    // Redirect to Paystack hosted payment page
    window.location.href = `https://checkout.paystack.com/${reference}`
}

  if (loading) {
    return (
      <div style={centerStyle}>
        <p>Processing...</p>
      </div>
    )
  }

  return (
    <div style={centerStyle}>
      <div style={boxStyle}>
        <h2 style={{ marginBottom: '0.5rem' }}>Complete Payment</h2>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          Order #{orderInfo?.orderId} — ₦{orderInfo?.orderTotal?.toLocaleString()}
        </p>

        {error && (
          <div style={errorStyle}>{error}</div>
        )}

        {reference && !loading && (
          <button onClick={openPaystackPopup} style={payBtnStyle}>
            Pay ₦{orderInfo?.orderTotal?.toLocaleString()} with Paystack
          </button>
        )}

        <button
          onClick={() => navigate(`/orders/${orderInfo?.orderId}`)}
          style={cancelStyle}
        >
          Pay Later
        </button>
      </div>
    </div>
  )
}

const centerStyle = { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }
const boxStyle = { backgroundColor: '#fff', padding: '2.5rem', borderRadius: '8px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '420px', textAlign: 'center' }
const payBtnStyle = { width: '100%', padding: '0.875rem', backgroundColor: '#0ba4db', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', marginBottom: '0.75rem' }
const cancelStyle = { width: '100%', padding: '0.75rem', backgroundColor: 'transparent', color: '#666', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.9rem', cursor: 'pointer' }
const errorStyle = { backgroundColor: '#fee', border: '1px solid #fcc', color: '#c00', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.875rem' }

export default Payment