import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import API from '../api/axios'

function Orders() {
  const { orderId } = useParams()
  const [orders, setOrders] = useState([])
  const [singleOrder, setSingleOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    setSingleOrder(null)
    setLoading(true)
    if (orderId) {
      fetchSingleOrder()
    } else {
      fetchMyOrders()
    }
  }, [orderId])

  const fetchMyOrders = async () => {
    try {
      const response = await API.get('/orders/my-orders')
      setOrders(response.data)
    } catch (err) {
      setError('Failed to fetch orders')
      console.error(err)
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
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const statusColor = (status) => {
    const colors = {
      pending:   { bg: '#fff3cd', color: '#856404' },
      confirmed: { bg: '#cce5ff', color: '#004085' },
      shipped:   { bg: '#d4edda', color: '#155724' },
      delivered: { bg: '#d4edda', color: '#155724' },
      cancelled: { bg: '#f8d7da', color: '#721c24' }
    }
    return colors[status] || { bg: '#eee', color: '#333' }
  }

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>
  if (error)   return <div style={{ padding: '2rem', color: 'red' }}>{error}</div>

  // Single order view
  if (singleOrder) {
    const { bg, color } = statusColor(singleOrder.status)
    return (
      <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1>Order #{singleOrder.id}</h1>
          <span style={{ padding: '0.4rem 1rem', borderRadius: '100px', backgroundColor: bg, color, fontWeight: '600', fontSize: '0.875rem' }}>
            {singleOrder.status.charAt(0).toUpperCase() + singleOrder.status.slice(1)}
          </span>
        </div>

        <div style={cardStyle}>
          <h3 style={{ marginBottom: '1rem' }}>Items Ordered</h3>
          {singleOrder.items.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: '1px solid #eee' }}>
              <span>Product #{item.product_id} × {item.quantity}</span>
              <span style={{ fontWeight: '600' }}>₦{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', fontWeight: 'bold', fontSize: '1.1rem' }}>
            <span>Total</span>
            <span>₦{singleOrder.total.toLocaleString()}</span>
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ marginBottom: '1rem' }}>Delivery Details</h3>
          <p style={detailStyle}><strong>Address:</strong> {singleOrder.address}</p>
          <p style={detailStyle}><strong>Phone:</strong> {singleOrder.phone}</p>
          {singleOrder.note && <p style={detailStyle}><strong>Note:</strong> {singleOrder.note}</p>}
          <p style={detailStyle}><strong>Ordered:</strong> {new Date(singleOrder.created_at).toLocaleString()}</p>
        </div>

        <button onClick={() => navigate('/orders')} style={btnStyle}>
          View All Orders
        </button>
      </div>
    )
  }

  // All orders view
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>My Orders</h1>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#666', marginBottom: '1rem' }}>You have not placed any orders yet</p>
          <button onClick={() => navigate('/')} style={btnStyle}>Start Shopping</button>
        </div>
      ) : (
        orders.map(order => {
          const { bg, color } = statusColor(order.status)
          return (
            <div key={order.id} style={{ ...cardStyle, marginBottom: '1rem', cursor: 'pointer' }}
              onClick={() => navigate(`/orders/${order.id}`)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.25rem' }}>Order #{order.id}</h3>
                  <p style={{ color: '#666', margin: 0, fontSize: '0.875rem' }}>
                    {new Date(order.created_at).toLocaleDateString()} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ display: 'block', padding: '0.3rem 0.875rem', borderRadius: '100px', backgroundColor: bg, color, fontWeight: '600', fontSize: '0.8rem', marginBottom: '0.4rem' }}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <span style={{ fontWeight: 'bold' }}>₦{order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

const cardStyle = { border: '1px solid #eee', borderRadius: '8px', padding: '1.5rem', marginBottom: '1rem' }
const detailStyle = { margin: '0 0 0.5rem', fontSize: '0.9rem' }
const btnStyle = { padding: '0.75rem 1.5rem', backgroundColor: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' }

export default Orders