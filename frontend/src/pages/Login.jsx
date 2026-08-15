import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../api/axios'

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)

      const response = await API.post('/auth/login', formData)
      const { access_token } = response.data
      localStorage.setItem('token', access_token)

      const userResponse = await API.get('/auth/me', {
        headers: { Authorization: `Bearer ${access_token}` }
      })
      localStorage.setItem('user', JSON.stringify(userResponse.data))

      if (userResponse.data.is_admin) navigate('/admin')
      else navigate('/')
    } catch (err) {
      setError('Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <span className="text-3xl font-black" style={{ color: 'var(--primary)' }}>MART</span>
            <span className="text-xs font-bold px-1.5 py-0.5 rounded text-white" style={{ background: '#f59e0b' }}>
              STORE
            </span>
          </Link>
          <p className="mt-3 text-sm" style={{ color: 'var(--muted)' }}>Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl p-8" style={{ border: '1px solid var(--border)' }}>

          {error && (
            <div
              className="px-4 py-3 rounded-xl mb-6 text-sm"
              style={{ background: 'rgba(244,63,94,0.08)', color: '#e11d48', border: '1px solid rgba(244,63,94,0.2)' }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all"
                style={{ border: '1px solid var(--border)' }}
                onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all"
                style={{ border: '1px solid var(--border)' }}
                onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full font-bold py-3 rounded-xl transition-colors text-sm text-white"
              style={{ background: loading ? '#fbbf24' : '#f59e0b' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'var(--muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold hover:underline" style={{ color: '#f59e0b' }}>
              Create one
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}

export default Login