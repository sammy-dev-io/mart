import { useState, useEffect } from 'react'
import { AdminLayout } from './Dashboard'
import API from '../../api/axios'

const STATUS_OPTIONS = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

const STATUS_STYLES = {
  pending:   { bg: 'rgba(245,158,11,0.1)', text: '#d97706' },
  confirmed: { bg: 'rgba(16,185,129,0.1)', text: '#059669' },
  shipped:   { bg: 'rgba(15,23,42,0.08)',  text: '#0f172a' },
  delivered: { bg: 'rgba(16,185,129,0.1)', text: '#059669' },
  cancelled: { bg: 'rgba(244,63,94,0.1)',  text: '#e11d48' },
}

function AdminOrders() {
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('all')
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await API.get('/orders/')
      setOrders(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (orderId, newStatus) => {
    try {
      setUpdating(orderId)
      await API.put(`/orders/${orderId}/status`, { status: newStatus })
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
    } catch (err) {
      alert('Failed to update order status')
    } finally {
      setUpdating(null)
    }
  }

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled' && o.status !== 'pending')
    .reduce((sum, o) => sum + o.total, 0)

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8">

        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-black" style={{ color: 'var(--primary)' }}>Orders</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Manage and track all customer orders</p>
        </div>

        {/* Revenue summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-white rounded-2xl p-3 sm:p-5 overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-1 truncate" style={{ color: 'var(--muted)' }}>Total Orders</p>
            <p className="text-lg sm:text-2xl font-black truncate" style={{ color: 'var(--primary)' }}>{orders.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-3 sm:p-5 overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-1 truncate" style={{ color: 'var(--muted)' }}>Revenue</p>
            <p className="text-lg sm:text-2xl font-black truncate" style={{ color: '#f59e0b' }}>₦{totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-2xl p-3 sm:p-5 overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-1 truncate" style={{ color: 'var(--muted)' }}>Pending</p>
            <p className="text-lg sm:text-2xl font-black truncate" style={{ color: '#d97706' }}>
              {orders.filter(o => o.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-3 sm:p-5 overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-1 truncate" style={{ color: 'var(--muted)' }}>Delivered</p>
            <p className="text-lg sm:text-2xl font-black truncate" style={{ color: '#059669' }}>
              {orders.filter(o => o.status === 'delivered').length}
            </p>
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
          {['all', ...STATUS_OPTIONS].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-colors"
              style={{
                background: filter === status ? 'var(--primary)' : '#fff',
                color: filter === status ? '#fff' : 'var(--text)',
                border: '1px solid var(--border)'
              }}
            >
              {status}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-20 animate-pulse" style={{ border: '1px solid var(--border)' }}></div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm" style={{ color: 'var(--muted)' }}>No orders found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(order => {
              const style = STATUS_STYLES[order.status]
              return (
                <div key={order.id} className="bg-white rounded-2xl p-4 sm:p-5" style={{ border: '1px solid var(--border)' }}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-sm" style={{ color: 'var(--primary)' }}>Order #{order.id}</p>
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full capitalize"
                          style={{ background: style.bg, color: style.text }}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs" style={{ color: 'var(--muted)' }}>
                        {new Date(order.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {' · '}{order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        {' · '}{order.phone}
                      </p>
                      <p className="text-xs mt-1 truncate" style={{ color: 'var(--muted)' }}>{order.address}</p>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0 flex-wrap">
                      <p className="font-black text-sm sm:text-lg" style={{ color: 'var(--primary)' }}>
                        ₦{order.total.toLocaleString()}
                      </p>
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        disabled={updating === order.id}
                        className="text-xs font-semibold px-2 sm:px-3 py-2 rounded-lg capitalize max-w-[110px] sm:max-w-none"
                        style={{ border: '1px solid var(--border)', background: '#fff', color: 'var(--text)' }}
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

      </div>
    </AdminLayout>
  )
}

export default AdminOrders