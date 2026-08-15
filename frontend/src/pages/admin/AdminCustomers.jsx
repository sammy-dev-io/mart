import { useState, useEffect } from 'react'
import { AdminLayout } from './Dashboard'
import API from '../../api/axios'

function AdminCustomers() {
  const [users, setUsers]     = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await API.get('/auth/users')
      setUsers(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const toggleStatus = async (userId) => {
    try {
      await API.put(`/auth/users/${userId}/status`)
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_active: !u.is_active } : u))
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to update user status')
    }
}

  const filtered = users.filter(u =>
    u.full_name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8">

        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-black" style={{ color: 'var(--primary)' }}>Customers</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
            {users.length} registered {users.length === 1 ? 'customer' : 'customers'}
          </p>
        </div>

        <div className="relative mb-5 max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers..."
            className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none"
            style={{ border: '1px solid var(--border)' }}
          />
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-16 animate-pulse" style={{ border: '1px solid var(--border)' }}></div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm" style={{ color: 'var(--muted)' }}>No customers found</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>

            {/* Desktop table */}
            <table className="w-full hidden md:table">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted)' }}>Customer</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted)' }}>Email</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted)' }}>Role</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted)' }}>Joined</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted)' }}>Status</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--muted)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid var(--bg)' }}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-white flex-shrink-0"
                          style={{ background: '#f59e0b' }}
                        >
                          {user.full_name[0]?.toUpperCase()}
                        </div>
                        <p className="font-semibold text-sm" style={{ color: 'var(--primary)' }}>{user.full_name}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm" style={{ color: 'var(--text)' }}>{user.email}</td>
                    <td className="px-5 py-4">
                      <span
                        className="text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{
                          background: user.is_active ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)',
                          color: user.is_active ? '#059669' : '#e11d48'
                        }}
                      >
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {!user.is_admin && (
                        <button
                          onClick={() => toggleStatus(user.id)}
                          className="text-sm font-medium"
                          style={{ color: user.is_active ? '#f43f5e' : '#059669' }}
                        >
                          {user.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm" style={{ color: 'var(--muted)' }}>
                      {new Date(user.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{
                          background: user.is_active ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)',
                          color: user.is_active ? '#059669' : '#e11d48'
                        }}
                      >
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile cards */}
            <div className="md:hidden divide-y" style={{ borderColor: 'var(--bg)' }}>
              {filtered.map(user => (
                <div key={user.id} className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-white flex-shrink-0"
                      style={{ background: '#f59e0b' }}
                    >
                      {user.full_name[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate" style={{ color: 'var(--primary)' }}>{user.full_name}</p>
                      <p className="text-xs truncate" style={{ color: 'var(--muted)' }}>{user.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{
                        background: user.is_admin ? 'rgba(245,158,11,0.1)' : 'rgba(15,23,42,0.06)',
                        color: user.is_admin ? '#d97706' : 'var(--muted)'
                      }}
                    >
                      {user.is_admin ? 'Admin' : 'Customer'}
                    </span>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{
                        background: user.is_active ? 'rgba(16,185,129,0.1)' : 'rgba(244,63,94,0.1)',
                        color: user.is_active ? '#059669' : '#e11d48'
                      }}
                    >
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {!user.is_admin && (
                    <button
                      onClick={() => toggleStatus(user.id)}
                      className="text-xs font-semibold mt-2"
                      style={{ color: user.is_active ? '#f43f5e' : '#059669' }}
                    >
                      {user.is_active ? 'Deactivate Account' : 'Activate Account'}
                    </button>
                  )}
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </AdminLayout>
  )
}

export default AdminCustomers