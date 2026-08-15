import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import API from '../api/axios'
import { useCart } from '../context/CartContext'

function ProductDetail() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const { addToCart } = useCart()

  const [product, setProduct]   = useState(null)
  const [related, setRelated]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded]       = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const res = await API.get(`/products/${id}`)
      setProduct(res.data)
      fetchRelated(res.data.category, res.data.id)
    } catch (err) {
      navigate('/products')
    } finally {
      setLoading(false)
    }
  }

  const fetchRelated = async (category, currentId) => {
    try {
      const res = await API.get('/products/')
      const filtered = res.data
        .filter(p => p.category === category && p.id !== currentId)
        .slice(0, 4)
      setRelated(filtered)
    } catch (err) {
      console.error(err)
    }
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const discount = product?.original_price && product.original_price > product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
          <div className="bg-zinc-100 rounded-2xl" style={{ aspectRatio: '1' }}></div>
          <div className="space-y-4">
            <div className="h-4 bg-zinc-100 rounded w-1/4"></div>
            <div className="h-8 bg-zinc-100 rounded w-3/4"></div>
            <div className="h-8 bg-zinc-100 rounded w-1/2"></div>
            <div className="h-24 bg-zinc-100 rounded w-full"></div>
            <div className="h-12 bg-zinc-100 rounded w-full"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) return null

  return (
    <div style={{ background: 'var(--bg)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm" style={{ color: 'var(--muted)' }}>
          <Link to="/" className="hover:text-amber-500 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-amber-500 transition-colors">Products</Link>
          <span>/</span>
          <Link
            to={`/products?category=${product.category}`}
            className="hover:text-amber-500 transition-colors capitalize"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span style={{ color: 'var(--text)' }} className="line-clamp-1">{product.name}</span>
        </div>

        {/* Product Main */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 mb-12 sm:mb-16 md:mb-20">

          {/* Image */}
          <div className="relative">
            <div
              className="rounded-2xl overflow-hidden bg-zinc-50"
              style={{ aspectRatio: '1', border: '1px solid var(--border)' }}
            >
              <img
                src={product.image || 'https://via.placeholder.com/600x600?text=No+Image'}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/600x600?text=No+Image' }}
              />
            </div>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {discount && (
                <span className="text-white text-sm font-bold px-3 py-1 rounded-lg" style={{ background: '#f43f5e' }}>
                  -{discount}% OFF
                </span>
              )}
              {product.badge === 'new' && (
                <span className="text-white text-sm font-bold px-3 py-1 rounded-lg" style={{ background: '#10b981' }}>
                  New Arrival
                </span>
              )}
              {product.badge === 'hot' && (
                <span className="text-white text-sm font-bold px-3 py-1 rounded-lg" style={{ background: '#f59e0b' }}>
                  Hot Item
                </span>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col">

            {/* Category */}
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#f59e0b' }}>
              {product.category}
            </p>

            {/* Name */}
            <h1
              className="font-black mb-4 leading-tight"
              style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', color: 'var(--primary)', letterSpacing: '-0.02em' }}
            >
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4" fill={i < Math.floor(product.rating) ? '#f59e0b' : '#e4e4e7'} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>{product.rating}</span>
              <span className="text-sm" style={{ color: 'var(--muted)' }}>/ 5.0</span>
            </div>

            {/* Price */}
            <div
              className="flex items-baseline gap-4 mb-6 pb-6"
              style={{ borderBottom: '1px solid var(--border)' }}
            >
              <span
                className="font-black"
                style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: 'var(--primary)', letterSpacing: '-0.02em' }}
              >
                ₦{product.price.toLocaleString()}
              </span>
              {product.original_price && (
                <>
                  <span className="text-lg line-through" style={{ color: 'var(--muted)' }}>
                    ₦{product.original_price.toLocaleString()}
                  </span>
                  <span
                    className="text-sm font-bold px-2.5 py-1 rounded-lg"
                    style={{ background: 'rgba(244,63,94,0.08)', color: '#f43f5e' }}
                  >
                    Save ₦{(product.original_price - product.price).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--muted)' }}>
                {product.description}
              </p>
            )}

            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-6">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  background: product.stock === 'in' ? '#10b981' : product.stock === 'low' ? '#f59e0b' : '#f43f5e'
                }}
              />
              <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                {product.stock === 'in' ? 'In Stock' : product.stock === 'low' ? 'Low Stock — Order Soon' : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity */}
            {product.stock !== 'out' && (
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>Quantity</span>
                <div
                  className="flex items-center rounded-xl overflow-hidden"
                  style={{ border: '1px solid var(--border)' }}
                >
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-4 py-2.5 text-lg font-bold transition-colors hover:bg-zinc-50"
                    style={{ color: 'var(--primary)' }}
                  >
                    −
                  </button>
                  <span
                    className="px-5 py-2.5 text-sm font-bold"
                    style={{ borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)', color: 'var(--primary)' }}
                  >
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => Math.min(5, q + 1))}
                    className="px-4 py-2.5 text-lg font-bold transition-colors hover:bg-zinc-50"
                    style={{ color: 'var(--primary)' }}
                  >
                    +
                  </button>
                </div>
                <span className="text-xs" style={{ color: 'var(--muted)' }}>Max 5</span>
              </div>
            )}

            {/* Add to Cart */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 'out'}
                className="flex-1 py-4 rounded-xl text-sm font-bold transition-all"
                style={{
                  background: product.stock === 'out' ? 'var(--border)' : added ? '#10b981' : '#f59e0b',
                  color: product.stock === 'out' ? 'var(--muted)' : '#fff'
                }}
              >
                {product.stock === 'out' ? 'Out of Stock' : added ? 'Added to Cart!' : 'Add to Cart'}
              </button>
              <button
                onClick={() => { handleAddToCart(); navigate('/cart') }}
                disabled={product.stock === 'out'}
                className="flex-1 py-4 rounded-xl text-sm font-bold transition-all"
                style={{
                  background: product.stock === 'out' ? 'transparent' : 'var(--primary)',
                  color: product.stock === 'out' ? 'var(--muted)' : '#fff',
                  border: product.stock === 'out' ? '1px solid var(--border)' : 'none'
                }}
              >
                Buy Now
              </button>
            </div>

            {/* Trust badges */}
            <div
              className="grid grid-cols-3 gap-3 mt-6 pt-6"
              style={{ borderTop: '1px solid var(--border)' }}
            >
              {[
                { title: 'Secure Payment',  desc: 'Paystack secured' },
                { title: 'Fast Delivery',   desc: 'Same day Lagos' },
                { title: 'Easy Returns',    desc: '7-day policy' },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <p className="text-xs font-semibold mb-0.5" style={{ color: 'var(--primary)' }}>{item.title}</p>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>{item.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section>
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#f59e0b' }}>
                More Like This
              </p>
              <h2 className="text-2xl font-black" style={{ color: 'var(--primary)', letterSpacing: '-0.02em' }}>
                Related Products
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map(p => (
                <Link
                  key={p.id}
                  to={`/products/${p.id}`}
                  className="group bg-white rounded-2xl overflow-hidden transition-all hover:-translate-y-1"
                  style={{ border: '1px solid var(--border)' }}
                >
                  <div className="overflow-hidden bg-zinc-50" style={{ aspectRatio: '4/3' }}>
                    <img
                      src={p.image || 'https://via.placeholder.com/400x300'}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300' }}
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-semibold line-clamp-2 mb-1" style={{ color: 'var(--primary)' }}>{p.name}</p>
                    <p className="text-sm font-bold" style={{ color: '#f59e0b' }}>₦{p.price.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  )
}

export default ProductDetail