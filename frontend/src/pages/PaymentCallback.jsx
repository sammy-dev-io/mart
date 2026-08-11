import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'

function PaymentCallback() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('verifying')
  const [message, setMessage] = useState('Verifying your payment...')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const reference = params.get('reference')

    if (!reference) {
      navigate('/orders')
      return
    }

    verifyPayment(reference)
  }, [])

  const verifyPayment = async (reference) => {
    try {
      const orderId = reference.split('-')[1]
      const response = await API.post('/payments/verify', {
        reference: reference,
        order_id: parseInt(orderId)
      })
      setStatus('success')
      setMessage('Payment verified successfully!')
      setTimeout(() => {
        navigate(`/orders/${response.data.order_id}`, {
          state: { paymentSuccess: true }
        })
      }, 2000)
    } catch (err) {
      setStatus('failed')
      setMessage('Payment verification failed. Please contact support.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 max-w-sm w-full text-center">

        {status === 'verifying' && (
          <>
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-5"></div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Verifying Payment</h2>
            <p className="text-gray-500 text-sm">Please wait while we confirm your payment...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-500 text-sm">Redirecting you to your order...</p>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Verification Failed</h2>
            <p className="text-gray-500 text-sm mb-5">{message}</p>
            <button
              onClick={() => navigate('/orders')}
              className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors text-sm"
            >
              View My Orders
            </button>
          </>
        )}

      </div>
    </div>
  )
}

export default PaymentCallback