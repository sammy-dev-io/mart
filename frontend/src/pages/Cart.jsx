import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart()
  const navigate = useNavigate()

  if (cartItems.length === 0) {
    return (
      <div style={emptyStyle}>
        <h2>Your cart is empty</h2>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
          Add some products to get started
        </p>
        <button
          onClick={() => navigate('/')}
          style={btnStyle}
        >
          Continue Shopping
        </button>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Your Cart</h1>

      <div style={{ marginBottom: '2rem' }}>
        {cartItems.map(item => (
          <div key={item.id} style={itemStyle}>
            <img
              src={item.image || 'https://via.placeholder.com/80'}
              alt={item.name}
              style={imgStyle}
            />
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 0.25rem' }}>{item.name}</h3>
              <p style={{ color: '#666', margin: '0 0 0.5rem', fontSize: '0.875rem' }}>
                {item.category}
              </p>
              <p style={{ fontWeight: 'bold', margin: 0 }}>
                ₦{item.price.toLocaleString()}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                style={qtyBtnStyle}
              >
                −
              </button>
              <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: 'bold' }}>
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                style={qtyBtnStyle}
              >
                +
              </button>
            </div>

            <div style={{ textAlign: 'right', minWidth: '100px' }}>
              <p style={{ fontWeight: 'bold', margin: '0 0 0.5rem' }}>
                ₦{(item.price * item.quantity).toLocaleString()}
              </p>
              <button
                onClick={() => removeFromCart(item.id)}
                style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={summaryStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <span style={{ fontSize: '1.1rem' }}>Total</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            ₦{cartTotal.toLocaleString()}
          </span>
        </div>
        <button
  onClick={() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
    } else {
      navigate('/checkout')
    }
  }}
  style={{ ...btnStyle, width: '100%' }}
>
  Proceed to Checkout
</button>

        <button
          onClick={() => navigate('/')}
          style={{ width: '100%', padding: '0.75rem', marginTop: '0.75rem', background: 'none', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer' }}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  )
}

const emptyStyle = {
  textAlign: 'center',
  padding: '5rem 2rem'
}

const itemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1.5rem',
  padding: '1.25rem',
  border: '1px solid #eee',
  borderRadius: '8px',
  marginBottom: '1rem',
  backgroundColor: '#fff'
}

const imgStyle = {
  width: '80px',
  height: '80px',
  objectFit: 'cover',
  borderRadius: '6px',
  flexShrink: 0,
  border: '1px solid #eee'
}

const qtyBtnStyle = {
  width: '32px',
  height: '32px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  background: '#fff',
  cursor: 'pointer',
  fontSize: '1.1rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}

const summaryStyle = {
  borderTop: '2px solid #eee',
  paddingTop: '1.5rem'
}

const btnStyle = {
  padding: '0.875rem 2rem',
  backgroundColor: '#1a1a1a',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  fontSize: '1rem',
  fontWeight: '600',
  cursor: 'pointer'
}

export default Cart