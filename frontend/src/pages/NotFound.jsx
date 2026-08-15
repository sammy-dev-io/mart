import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--bg)' }}
    >
      <div className="text-center">
        <p className="font-black" style={{ fontSize: '6rem', color: 'var(--primary)', opacity: 0.1, lineHeight: 1 }}>
          404
        </p>
        <h1 className="text-xl sm:text-2xl font-black -mt-8" style={{ color: 'var(--primary)' }}>
          Page Not Found
        </h1>
        <p className="text-sm mt-2 mb-8" style={{ color: 'var(--muted)' }}>
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            to="/"
            className="font-bold px-6 py-3 rounded-xl text-sm text-white transition-all"
            style={{ background: '#f59e0b' }}
          >
            Back to Home
          </Link>
          <Link
            to="/products"
            className="font-bold px-6 py-3 rounded-xl text-sm transition-all"
            style={{ border: '1px solid var(--border)', color: 'var(--text)' }}
          >
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound