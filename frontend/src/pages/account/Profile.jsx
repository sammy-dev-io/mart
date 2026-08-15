import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../../api/axios'
import AccountLayout from './AccountLayout'

function Profile() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await API.get('/orders/my-orders')
      setOrders(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const totalSpent = orders
    .filter(o => o.status !== 'cancelled' && o.status !== 'pending')
    .reduce((sum, o) => sum + o.total, 0)

  const pendingOrders = orders.filter(o => o.status === 'pending').length
  const recentOrders  = orders.slice(0, 3)

  return (
    <AccountLayout>
      <div className="space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-black" style={{ color: 'var(--primary)', letterSpacing: '-0.02em' }}>
            Welcome back, {user?.full_name?.split(' ')[0]}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
            Here is an overview of your account
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--muted)' }}>
              Total Orders
            </p>
            <p className="text-2xl font-black" style={{ color: 'var(--primary)' }}>{orders.length}</p>
          </div>
          <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--muted)' }}>
              Total Spent
            </p>
            <p className="text-2xl font-black" style={{ color: '#f59e0b' }}>₦{totalSpent.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--muted)' }}>
              Pending Payment
            </p>
            <p className="text-2xl font-black" style={{ color: pendingOrders > 0 ? '#f43f5e' : 'var(--primary)' }}>
              {pendingOrders}
            </p>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-sm" style={{ color: 'var(--primary)' }}>Recent Orders</h2>
            <Link to="/orders" className="text-xs font-semibold" style={{ color: '#f59e0b' }}>
              View All
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: 'var(--bg)' }}></div>
              ))}
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm" style={{ color: 'var(--muted)' }}>You have not placed any orders yet</p>
              <Link to="/products" className="text-sm font-semibold mt-2 inline-block" style={{ color: '#f59e0b' }}>
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map(order => (
                <Link
                  key={order.id}
                  to={`/orders/${order.id}`}
                  className="flex items-center justify-between p-3 rounded-xl transition-colors hover:bg-zinc-50"
                  style={{ border: '1px solid var(--border)' }}
                >
                  <div>
                    <p className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>Order #{order.id}</p>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>
                      {new Date(order.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                  <p className="text-sm font-bold" style={{ color: 'var(--primary)' }}>
                    ₦{order.total.toLocaleString()}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid var(--border)' }}>
          <h2 className="font-bold text-sm mb-4" style={{ color: 'var(--primary)' }}>Account Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span style={{ color: 'var(--muted)' }}>Full Name</span>
              <span className="font-medium" style={{ color: 'var(--text)' }}>{user?.full_name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: 'var(--muted)' }}>Email</span>
              <span className="font-medium" style={{ color: 'var(--text)' }}>{user?.email}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: 'var(--muted)' }}>Member Since</span>
              <span className="font-medium" style={{ color: 'var(--text)' }}>
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-NG', { month: 'long', year: 'numeric' }) : '—'}
              </span>
            </div>
          </div>
        </div>

      </div>
    </AccountLayout>
  )
}

export default Profile