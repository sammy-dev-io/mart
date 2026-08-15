import { useCart } from '../context/CartContext'
import { useNavigate, Link } from 'react-router-dom'

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart()
  const navigate = useNavigate()

  const handleCheckout = () => {
    const token = localStorage.getItem('token')
    if (!token) navigate('/login')
    else navigate('/checkout')
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-black mb-2" style={{ color: 'var(--primary)' }}>Your cart is empty</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>Add some products to get started</p>
          <Link
            to="/products"
            className="inline-block font-bold px-6 py-3 rounded-xl text-sm text-white transition-all"
            style={{ background: '#f59e0b' }}
          >
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Header with close button */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-black" style={{ color: 'var(--primary)' }}>
              
              Your Cart
              <span className="ml-2 text-sm sm:text-base font-normal" style={{ color: 'var(--muted)' }}>
                ({cartItems.length})
              </span>
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="text-xs sm:text-sm font-medium transition-colors"
            style={{ color: '#f43f5e' }}
          >
            Clear cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            {cartItems.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-3 sm:p-4 flex gap-3 sm:gap-4"
                style={{ border: '1px solid var(--border)' }}
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0" style={{ background: 'var(--bg)' }}>
                  <img
                    src={item.image || 'https://via.placeholder.com/80'}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/80' }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-semibold text-xs sm:text-sm truncate pr-2" style={{ color: 'var(--primary)' }}>
                      {item.name}
                    </h3>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="flex-shrink-0 p-1 rounded-lg transition-colors"
                      style={{ color: 'var(--muted)' }}
                      aria-label="Remove item"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <p className="font-bold text-sm sm:text-base mt-0.5" style={{ color: '#f59e0b' }}>
                    ₦{item.price.toLocaleString()}
                  </p>

                  <div className="flex items-center justify-between mt-2 sm:mt-3">
                    <div className="flex items-center rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2.5 sm:px-3 py-1 text-sm sm:text-lg font-medium transition-colors"
                        style={{ color: 'var(--text)' }}
                      >
                        −
                      </button>
                      <span className="px-3 sm:px-4 py-1 text-xs sm:text-sm font-semibold" style={{ borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2.5 sm:px-3 py-1 text-sm sm:text-lg font-medium transition-colors"
                        style={{ color: 'var(--text)' }}
                      >
                        +
                      </button>
                    </div>

                    <p className="font-bold text-xs sm:text-sm" style={{ color: 'var(--primary)' }}>
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-4 sm:p-5 lg:sticky lg:top-20" style={{ border: '1px solid var(--border)' }}>
              <h2 className="font-bold text-sm mb-4" style={{ color: 'var(--primary)' }}>Order Summary</h2>

              <div className="space-y-2.5 mb-4 max-h-48 overflow-y-auto">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between text-xs sm:text-sm gap-2">
                    <span className="truncate flex-1" style={{ color: 'var(--muted)' }}>
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium flex-shrink-0" style={{ color: 'var(--text)' }}>
                      ₦{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 mb-5" style={{ borderTop: '1px solid var(--border)' }}>
                <div className="flex justify-between">
                  <span className="font-bold text-sm sm:text-base" style={{ color: 'var(--primary)' }}>Total</span>
                  <span className="font-black text-lg sm:text-xl" style={{ color: '#f59e0b' }}>
                    ₦{cartTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full font-bold py-3 rounded-xl transition-colors text-sm text-white"
                style={{ background: '#f59e0b' }}
              >
                Proceed to Checkout
              </button>

              <Link
                to="/products"
                className="block text-center text-xs sm:text-sm mt-3 transition-colors"
                style={{ color: 'var(--muted)' }}
              >
                Continue Shopping
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Cart