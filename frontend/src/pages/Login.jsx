import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
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

      if (userResponse.data.is_admin) {
        navigate('/admin')
      } else {
        navigate('/')
      }

    } catch (err) {
      setError('Invalid email or password')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={containerStyle}>
      <div style={boxStyle}>
        <h1 style={{ marginBottom: '0.5rem', color: '#4e4646' }}>Mart</h1>
        <p style={{ color: '#000000', marginBottom: '2rem' }}>Sign in to your account</p>

        {error && (
          <div style={errorStyle}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="admin@mart.com"
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="•••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={buttonStyle}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

const containerStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f5f5f5'
}

const boxStyle = {
  backgroundColor: '#fff',
  padding: '2.5rem',
  borderRadius: '8px',
  boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
  width: '100%',
  maxWidth: '400px'
}

const fieldStyle = {
  marginBottom: '1.25rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35rem'
}

const labelStyle = {
  fontSize: '0.875rem',
  fontWeight: '500',
  color: '#333'
}

const inputStyle = {
  padding: '0.65rem 0.875rem',
  fontSize: '1rem',
  border: '1px solid #ddd',
  borderRadius: '6px',
  width: '100%',
  outline: 'none'
}

const buttonStyle = {
  width: '100%',
  padding: '0.75rem',
  backgroundColor: '#1a1a1a',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  fontSize: '1rem',
  fontWeight: '600',
  cursor: 'pointer',
  marginTop: '0.5rem'
}

const errorStyle = {
  backgroundColor: '#fee',
  border: '1px solid #fcc',
  color: '#c00',
  padding: '0.75rem',
  borderRadius: '6px',
  marginBottom: '1rem',
  fontSize: '0.875rem'
}

export default Login