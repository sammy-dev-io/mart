import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'

function PaymentCallback() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('Verifying your payment...')

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
      setStatus('Payment successful! Redirecting...')
      setTimeout(() => {
        navigate(`/orders/${response.data.order_id}`, {
          state: { paymentSuccess: true }
        })
      }, 1500)
    } catch (err) {
      setStatus('Payment verification failed. Please contact support.')
      console.error(err)
    }
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <h2>{status}</h2>
      </div>
    </div>
  )
}

export default PaymentCallback