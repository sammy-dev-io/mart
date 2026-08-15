import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import API from '../api/axios'

function Payment() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState(null)
  const [reference, setReference]     = useState(null)
  const [orderInfo, setOrderInfo]     = useState(null)

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
    window.location.href = `https://checkout.paystack.com/${reference}`
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">💳</div>
          <h1 className="text-2xl font-bold text-gray-900">Complete Payment</h1>
          <p className="text-gray-500 text-sm mt-1">
            Secure payment powered by Paystack
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid var(--border)' }}>

          {/* Order Summary */}
          {orderInfo && (
            <div className="rounded-xl p-4 mb-6" style={{ background: 'rgba(245,158,11,0.08)' }}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--primary)' }}>
                    Order #{orderInfo.orderId}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: '#d97706' }}>
                    {orderInfo.userEmail}
                  </p>
                </div>
                <p className="text-xl font-bold" style={{ color: '#f59e0b' }}>
                  ₦{orderInfo.orderTotal?.toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              className="px-4 py-3 rounded-xl mb-5 text-sm"
              style={{ background: 'rgba(244,63,94,0.08)', color: '#e11d48', border: '1px solid rgba(244,63,94,0.2)' }}
            >
              {error}
              <button
                onClick={() => orderInfo && initializePayment(orderInfo.orderId, orderInfo.userEmail)}
                className="block font-medium mt-1 hover:underline"
                style={{ color: '#e11d48' }}
              >
                Try again
              </button>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-6">
              <div
                className="w-8 h-8 border-4 rounded-full animate-spin"
                style={{ borderColor: 'var(--border)', borderTopColor: '#f59e0b' }}
              ></div>
              <span className="ml-3 text-sm" style={{ color: 'var(--muted)' }}>Initializing payment...</span>
            </div>
          )}

          {/* Pay Button */}
          {reference && !loading && (
            <button
              onClick={openPaystackPopup}
              className="w-full font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-white"
              style={{ background: '#f59e0b' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Pay ₦{orderInfo?.orderTotal?.toLocaleString()} Securely
            </button>
          )}

          {/* Pay Later */}
          <Link
            to={`/orders/${orderInfo?.orderId}`}
            className="block text-center text-sm text-gray-500 hover:text-indigo-600 mt-4 transition-colors"
          >
            Pay later — view order
          </Link>

          {/* Security note */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
              <span>🔒 SSL Encrypted</span>
              <span>·</span>
              <span>✅ Paystack Secured</span>
              <span>·</span>
              <span>💳 All cards accepted</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Payment