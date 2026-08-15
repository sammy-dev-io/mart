import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer style={{ background: '#0a0f1a', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-12 mb-10 sm:mb-12">

          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-black text-white">MART</span>
              <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ background: '#f59e0b', color: '#fff' }}>
                STORE
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Your one-stop destination for everything you need. Quality products, fast delivery, unbeatable prices.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-5 text-white">Shop</p>
            <div className="space-y-3">
              {['Electronics', 'Fashion', 'Home', 'Beauty', 'Sports'].map(item => (
                <Link
                  key={item}
                  to={`/products?category=${item}`}
                  className="block text-sm transition-colors hover:text-amber-400"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-5 text-white">Account</p>
            <div className="space-y-3">
              {[
                { label: 'My Account', path: '/account' },
                { label: 'My Orders', path: '/orders' },
                { label: 'Cart', path: '/cart' },
                { label: 'Sign In', path: '/login' },
              ].map(item => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="block text-sm transition-colors hover:text-amber-400"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-5 text-white">Company</p>
            <div className="space-y-3">
              <Link to="/about" className="block text-sm transition-colors hover:text-amber-400" style={{ color: 'rgba(255,255,255,0.4)' }}>
                About Us
              </Link>
              <Link to="/contact" className="block text-sm transition-colors hover:text-amber-400" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        <div
          className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
            © 2024 Mart Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer