import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link, useLocation } from 'react-router-dom'
import API from '../api/axios'

const STATUS_STYLES = {
  pending:   { bg: 'bg-yellow-50',  text: 'text-yellow-700',  border: 'border-yellow-200', label: 'Pending' },
  confirmed: { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200',   label: 'Confirmed' },
  shipped:   { bg: 'bg-indigo-50',  text: 'text-indigo-700',  border: 'border-indigo-200', label: 'Shipped' },
  delivered: { bg: 'bg-green-50',   text: 'text-green-700',   border: 'border-green-200',  label: 'Delivered' },
  cancelled: { bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200',    label: 'Cancelled' },
}

const STATUS_STEPS = ['pending', 'confirmed', 'shipped', 'delivered']

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.pending
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${style.bg} ${style.text} ${style.border}`}>
      {style.label}
    </span>
  )
}

function Orders() {
  const { orderId }  = useParams()
  const location     = useLocation()
  const navigate     = useNavigate()
  const [orders, setOrders]           = useState([])
  const [singleOrder, setSingleOrder] = useState(null)
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)
  const paymentSuccess = location.state?.paymentSuccess

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Loading orders...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3">😕</div>
          <p className="text-gray-700 font-semibold">{error}</p>
          <Link to="/orders" className="text-indigo-600 text-sm mt-2 inline-block hover:underline">
            Back to orders
          </Link>
        </div>
      </div>
    )
  }

  // Single order view
  if (singleOrder) {
    const statusIndex = STATUS_STEPS.indexOf(singleOrder.status)

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Payment success banner */}
          {paymentSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
              <span className="text-2xl">🎉</span>
              <div>
                <p className="font-semibold text-green-800">Payment Successful!</p>
                <p className="text-sm text-green-600">Your order has been confirmed and is being processed.</p>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order #{singleOrder.id}</h1>
              <p className="text-gray-500 text-sm mt-1">
                Placed on {new Date(singleOrder.created_at).toLocaleDateString('en-NG', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
              </p>
            </div>
            <StatusBadge status={singleOrder.status} />
          </div>

          {/* Progress Tracker */}
          {singleOrder.status !== 'cancelled' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
              <h2 className="font-semibold text-gray-900 mb-5">Order Progress</h2>
              <div className="flex items-center">
                {STATUS_STEPS.map((step, i) => (
                  <div key={step} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                        i <= statusIndex
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        {i < statusIndex ? '✓' : i + 1}
                      </div>
                      <span className={`text-xs mt-1 font-medium capitalize ${
                        i <= statusIndex ? 'text-indigo-600' : 'text-gray-400'
                      }`}>
                        {step}
                      </span>
                    </div>
                    {i < STATUS_STEPS.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-2 transition-colors ${
                        i < statusIndex ? 'bg-indigo-600' : 'bg-gray-100'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Items */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
            <h2 className="font-semibold text-gray-900 mb-4">Items Ordered</h2>
            <div className="space-y-4">
              {singleOrder.items.map(item => (
                <div key={item.id} className="flex justify-between items-center pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Product #{item.product_id}</p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {item.quantity} × ₦{item.price.toLocaleString()}
                    </p>
                  </div>
                  <p className="font-bold text-gray-900">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-bold text-xl text-indigo-600">
                ₦{singleOrder.total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <h2 className="font-semibold text-gray-900 mb-4">Delivery Details</h2>
            <div className="space-y-3">
              <div className="flex gap-3">
                <span className="text-gray-400 w-20 text-sm flex-shrink-0">Address</span>
                <span className="text-gray-900 text-sm font-medium">{singleOrder.address}</span>
              </div>
              <div className="flex gap-3">
                <span className="text-gray-400 w-20 text-sm flex-shrink-0">Phone</span>
                <span className="text-gray-900 text-sm font-medium">{singleOrder.phone}</span>
              </div>
              {singleOrder.note && (
                <div className="flex gap-3">
                  <span className="text-gray-400 w-20 text-sm flex-shrink-0">Note</span>
                  <span className="text-gray-900 text-sm font-medium">{singleOrder.note}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              to="/orders"
              className="flex-1 text-center border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm"
            >
              ← All Orders
            </Link>
            <Link
              to="/products"
              className="flex-1 text-center bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition-colors text-sm"
            >
              Continue Shopping
            </Link>
          </div>

        </div>
      </div>
    )
  }

  // All orders view
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📦</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 text-sm mb-6">Your order history will appear here</p>
            <Link
              to="/products"
              className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors"
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
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 cursor-pointer hover:shadow-md hover:border-indigo-100 transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">Order #{order.id}</h3>
                    <p className="text-gray-500 text-sm mt-0.5">
                      {new Date(order.created_at).toLocaleDateString('en-NG', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                      {' · '}
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={order.status} />
                    <p className="font-bold text-gray-900 mt-2">
                      ₦{order.total.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Status progress mini */}
                {order.status !== 'cancelled' && (
                  <div className="mt-4 flex items-center gap-1">
                    {STATUS_STEPS.map((step, i) => {
                      const stepIndex = STATUS_STEPS.indexOf(order.status)
                      return (
                        <div
                          key={step}
                          className={`h-1.5 flex-1 rounded-full transition-colors ${
                            i <= stepIndex ? 'bg-indigo-600' : 'bg-gray-100'
                          }`}
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
    </div>
  )
}

export default Orders