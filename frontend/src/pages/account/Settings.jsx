import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../api/axios'
import AccountLayout from './AccountLayout'

function Settings() {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()

  const handleDeactivate = async () => {
    if (!window.confirm('Are you sure you want to deactivate your account? You will be logged out immediately.')) return
    try {
      await API.put('/auth/deactivate')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      navigate('/login')
    } catch (err) {
      alert('Failed to deactivate account. Please try again.')
    }
  }

  return (
    <AccountLayout>
      <div className="space-y-6">

        <div>
          <h1 className="text-2xl font-black" style={{ color: 'var(--primary)', letterSpacing: '-0.02em' }}>
            Account Settings
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
            Manage your personal information
          </p>
        </div>

        {message && (
          <div
            className="rounded-xl p-4 text-sm"
            style={{ background: 'rgba(16,185,129,0.08)', color: '#059669', border: '1px solid rgba(16,185,129,0.2)' }}
          >
            {message}
          </div>
        )}

        <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid var(--border)' }}>
          <h2 className="font-bold text-sm mb-5" style={{ color: 'var(--primary)' }}>Profile Details</h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>
                Full Name
              </label>
              <input
                type="text"
                value={user?.full_name || ''}
                disabled
                className="w-full px-4 py-3 rounded-xl text-sm"
                style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--muted)' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>
                Email Address
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-3 rounded-xl text-sm"
                style={{ border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--muted)' }}
              />
            </div>
            <p className="text-xs" style={{ color: 'var(--muted)' }}>
              Profile editing is not yet available. Contact support to update your details.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid var(--border)' }}>
          <h2 className="font-bold text-sm mb-2" style={{ color: 'var(--primary)' }}>Danger Zone</h2>
          <p className="text-xs mb-4" style={{ color: 'var(--muted)' }}>
            Deactivating your account will log you out and prevent future logins. Contact support to reactivate.
          </p>
          <button
            onClick={handleDeactivate}
            className="text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            style={{ border: '1px solid #f43f5e', color: '#f43f5e' }}
          >
            Deactivate My Account
          </button>
        </div>

      </div>
    </AccountLayout>
  )
}

export default Settings