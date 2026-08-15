import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom'
import API from '../api/axios'
import AccountLayout from './account/AccountLayout'

const STATUS_STYLES = {
  pending:   { bg: 'rgba(245,158,11,0.1)', text: '#d97706', label: 'Pending Payment' },
  confirmed: { bg: 'rgba(16,185,129,0.1)', text: '#059669', label: 'Confirmed' },
  shipped:   { bg: 'rgba(15,23,42,0.08)',  text: '#0f172a', label: 'Shipped' },
  delivered: { bg: 'rgba(16,185,129,0.1)', text: '#059669', label: 'Delivered' },
  cancelled: { bg: 'rgba(244,63,94,0.1)',  text: '#e11d48', label: 'Cancelled' },
}

const STATUS_STEPS = ['pending', 'confirmed', 'shipped', 'delivered']

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.pending
  return (
    <span
      className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold"
      style={{ background: style.bg, color: style.text }}
    >
      {style.label}
    </span>
  )
}

function Orders() {
  const { orderId }  = useParams()
  const location     = useLocation()
  const navigate      = useNavigate()
  const [orders, setOrders]           = useState([])
  const [singleOrder, setSingleOrder] = useState(null)
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)
  const [payLoading, setPayLoading]   = useState(false)
  const paymentSuccess = location.state?.paymentSuccess

  const user = JSON.parse(localStorage.getItem('user') || 'null')

  useEffect(() => {
    setSingleOrder(null)
    setLoading(true)
    if (orderId) fetchSingleOrder()
    else fetchMyOrders()
  }, [orderId])

  const fetchMyOrders = async () => {
    try {
      const response = await API.get('/orders/my-orders')
      setOrders(response.data)
    } catch (err) {
      setError('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  const fetchSingleOrder = async () => {
    try {
      const response = await API.get(`/orders/${orderId}`)
      setSingleOrder(response.data)
    } catch (err) {
      setError('Order not found')
    } finally {
      setLoading(false)
    }
  }

  const handleCompletePayment = async (order) => {
    try {
      setPayLoading(true)
      const response = await API.post('/payments/initialize', {
        order_id: order.id,
        email: user.email
      })
      const { data } = response.data
      window.location.href = `https://checkout.paystack.com/${data.access_code}`
    } catch (err) {
      alert('Failed to initialize payment. Please try again.')
      setPayLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="text-center">
          <div
            className="w-8 h-8 border-4 rounded-full animate-spin mx-auto mb-3"
            style={{ borderColor: 'var(--border)', borderTopColor: '#f59e0b' }}
          ></div>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Loading orders...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="text-center">
          <p className="font-semibold" style={{ color: 'var(--text)' }}>{error}</p>
          <Link to="/orders" className="text-sm mt-2 inline-block hover:underline" style={{ color: '#f59e0b' }}>
            Back to orders
          </Link>
        </div>
      </div>
    )
  }

  // ── Single Order View ──────────────────────────────
  if (singleOrder) {
    const statusIndex = STATUS_STEPS.indexOf(singleOrder.status)
    const isPending    = singleOrder.status === 'pending'

    return (
      <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {paymentSuccess && (
            <div
              className="rounded-2xl p-4 mb-6 flex items-center gap-3"
              style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}
            >
              <div>
                <p className="font-bold text-sm" style={{ color: '#059669' }}>Payment Successful</p>
                <p className="text-sm" style={{ color: '#059669', opacity: 0.8 }}>Your order has been confirmed and is being processed.</p>
              </div>
            </div>
          )}

          {/* Pending payment banner */}
          {isPending && (
            <div
              className="rounded-2xl p-5 mb-6 flex items-center justify-between gap-4 flex-wrap"
              style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)' }}
            >
              <div>
                <p className="font-bold text-sm" style={{ color: '#d97706' }}>Payment Pending</p>
                <p className="text-sm mt-0.5" style={{ color: '#d97706', opacity: 0.8 }}>
                  This order has not been paid for yet. Complete your payment to proceed.
                </p>
              </div>
              <button
                onClick={() => handleCompletePayment(singleOrder)}
                disabled={payLoading}
                className="px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all"
                style={{ background: '#f59e0b', color: '#fff' }}
              >
                {payLoading ? 'Processing...' : 'Complete Payment'}
              </button>
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black" style={{ color: 'var(--primary)', letterSpacing: '-0.02em' }}>
                Order #{singleOrder.id}
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
                Placed on {new Date(singleOrder.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <StatusBadge status={singleOrder.status} />
          </div>

          {/* Progress Tracker */}
          {singleOrder.status !== 'cancelled' && !isPending && (
            <div className="bg-white rounded-2xl p-6 mb-5" style={{ border: '1px solid var(--border)' }}>
              <h2 className="font-bold text-sm mb-5" style={{ color: 'var(--primary)' }}>Order Progress</h2>
              <div className="flex items-center">
                {STATUS_STEPS.map((step, i) => (
                  <div key={step} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                        style={{
                          background: i <= statusIndex ? '#f59e0b' : 'var(--border)',
                          color: i <= statusIndex ? '#fff' : 'var(--muted)'
                        }}
                      >
                        {i < statusIndex ? '✓' : i + 1}
                      </div>
                      <span
                        className="text-xs mt-1.5 font-medium capitalize"
                        style={{ color: i <= statusIndex ? '#f59e0b' : 'var(--muted)' }}
                      >
                        {step}
                      </span>
                    </div>
                    {i < STATUS_STEPS.length - 1 && (
                      <div
                        className="flex-1 h-0.5 mx-2 transition-colors"
                        style={{ background: i < statusIndex ? '#f59e0b' : 'var(--border)' }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Items */}
          <div className="bg-white rounded-2xl p-6 mb-5" style={{ border: '1px solid var(--border)' }}>
            <h2 className="font-bold text-sm mb-4" style={{ color: 'var(--primary)' }}>Items Ordered</h2>
            <div className="space-y-4">
              {singleOrder.items.map(item => (
                <div key={item.id} className="flex justify-between items-center pb-4" style={{ borderBottom: '1px solid var(--bg)' }}>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>Product #{item.product_id}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
                      {item.quantity} × ₦{item.price.toLocaleString()}
                    </p>
                  </div>
                  <p className="font-bold text-sm" style={{ color: 'var(--primary)' }}>
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
              <span className="font-bold text-sm" style={{ color: 'var(--primary)' }}>Total</span>
              <span className="font-black text-xl" style={{ color: '#f59e0b' }}>
                ₦{singleOrder.total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="bg-white rounded-2xl p-6 mb-6" style={{ border: '1px solid var(--border)' }}>
            <h2 className="font-bold text-sm mb-4" style={{ color: 'var(--primary)' }}>Delivery Details</h2>
            <div className="space-y-3">
              <div className="flex gap-3">
                <span className="w-20 text-sm flex-shrink-0" style={{ color: 'var(--muted)' }}>Address</span>
                <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{singleOrder.address}</span>
              </div>
              <div className="flex gap-3">
                <span className="w-20 text-sm flex-shrink-0" style={{ color: 'var(--muted)' }}>Phone</span>
                <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{singleOrder.phone}</span>
              </div>
              {singleOrder.note && (
                <div className="flex gap-3">
                  <span className="w-20 text-sm flex-shrink-0" style={{ color: 'var(--muted)' }}>Note</span>
                  <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{singleOrder.note}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              to="/orders"
              className="flex-1 text-center font-bold py-3 rounded-xl text-sm transition-colors"
              style={{ border: '1px solid var(--border)', color: 'var(--text)' }}
            >
              All Orders
            </Link>
            <Link
              to="/products"
              className="flex-1 text-center font-bold py-3 rounded-xl text-sm transition-colors text-white"
              style={{ background: 'var(--primary)' }}
            >
              Continue Shopping
            </Link>
          </div>

        </div>
      </div>
    )
  }

  // ── All Orders View ────────────────────────────────
  // ── All Orders View ────────────────────────────────
  return (
    <AccountLayout>
      <div>
        <h1 className="text-2xl font-black mb-6" style={{ color: 'var(--primary)', letterSpacing: '-0.02em' }}>
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--primary)' }}>No orders yet</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>Your order history will appear here</p>
            <Link
              to="/products"
              className="inline-block font-bold px-6 py-3 rounded-xl text-sm text-white transition-all"
              style={{ background: '#f59e0b' }}
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div
                key={order.id}
                onClick={() => navigate(`/orders/${order.id}`)}
                className="bg-white rounded-2xl p-4 sm:p-5 cursor-pointer transition-all hover:-translate-y-0.5"
                style={{ border: '1px solid var(--border)' }}
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm" style={{ color: 'var(--primary)' }}>Order #{order.id}</h3>
                    <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
                      {new Date(order.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {' · '}{order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <StatusBadge status={order.status} />
                    <p className="font-bold mt-2 text-sm sm:text-base" style={{ color: 'var(--primary)' }}>
                      ₦{order.total.toLocaleString()}
                    </p>
                  </div>
                </div>

                {order.status === 'pending' && (
                  <div
                    className="mt-3 pt-3 flex items-center justify-between gap-2"
                    style={{ borderTop: '1px solid var(--bg)' }}
                  >
                    <span className="text-xs font-medium" style={{ color: '#d97706' }}>
                      Awaiting payment
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleCompletePayment(order) }}
                      disabled={payLoading}
                      className="text-xs font-bold px-3 py-1.5 rounded-lg text-white transition-all flex-shrink-0"
                      style={{ background: '#f59e0b' }}
                    >
                      Pay Now
                    </button>
                  </div>
                )}

                {order.status !== 'cancelled' && order.status !== 'pending' && (
                  <div className="mt-4 flex items-center gap-1">
                    {STATUS_STEPS.map((step, i) => {
                      const stepIndex = STATUS_STEPS.indexOf(order.status)
                      return (
                        <div
                          key={step}
                          className="h-1.5 flex-1 rounded-full transition-colors"
                          style={{ background: i <= stepIndex ? '#f59e0b' : 'var(--border)' }}
                        />
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  )
}

export default Orders