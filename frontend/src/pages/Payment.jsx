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
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

          {/* Order Summary */}
          {orderInfo && (
            <div className="bg-indigo-50 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-indigo-900">
                    Order #{orderInfo.orderId}
                  </p>
                  <p className="text-xs text-indigo-600 mt-0.5">
                    {orderInfo.userEmail}
                  </p>
                </div>
                <p className="text-xl font-bold text-indigo-600">
                  ₦{orderInfo.orderTotal?.toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm">
              {error}
              <button
                onClick={() => orderInfo && initializePayment(orderInfo.orderId, orderInfo.userEmail)}
                className="block text-red-600 font-medium mt-1 hover:underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-6">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-500 text-sm">Initializing payment...</span>
            </div>
          )}

          {/* Pay Button */}
          {reference && !loading && (
            <button
              onClick={openPaystackPopup}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
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