import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../api/axios'
import { useCart } from '../context/CartContext'


// ── Product Card ─────────────────────────────────────────────
function ProductCard({ product, onAddToCart }) {
  const discount = product.original_price && product.original_price > product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null

  const stockColor = {
    in:  'text-green-600 bg-green-50',
    low: 'text-yellow-600 bg-yellow-50',
    out: 'text-red-600 bg-red-50'
  }

  const stockLabel = {
    in:  'In Stock',
    low: 'Low Stock',
    out: 'Out of Stock'
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow group flex flex-col h-full">

      <div className="relative overflow-hidden bg-gray-50 w-full" style={{ aspectRatio: '4/3' }}>
        <img
          src={product.image || 'https://via.placeholder.com/400x300?text=No+Image'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image' }}
        />

        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.badge === 'hot' && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              🔥 Hot
            </span>
          )}
          {discount && (
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              -{discount}%
            </span>
          )}
          {product.badge === 'new' && (
            <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              New
            </span>
          )}
        </div>
      </div>

      <div className="p-3 flex flex-col flex-1">
        <p className="text-xs text-indigo-600 font-medium uppercase tracking-wide mb-1 truncate">
          {product.category}
        </p>
        <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 leading-snug min-h-[2.5rem]">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mb-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-3 h-3 flex-shrink-0 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-200'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-400 flex-shrink-0">{product.rating}</span>
        </div>

        {/* This spacer pushes price+button to the bottom regardless of content above */}
        <div className="flex-1"></div>

        <div className="flex items-baseline gap-1 mb-2 flex-wrap">
          <span className="text-sm font-bold text-gray-900 truncate">
            ₦{product.price.toLocaleString()}
          </span>
          {product.original_price && (
            <span className="text-xs text-gray-400 line-through truncate">
              ₦{product.original_price.toLocaleString()}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${stockColor[product.stock]}`}>
            {stockLabel[product.stock]}
          </span>
          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 'out'}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex-shrink-0 whitespace-nowrap"
          >
            {product.stock === 'out' ? 'Sold Out' : '+ Add'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Skeleton Card ─────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden animate-pulse" style={{ border: '1px solid var(--border)' }}>
      <div className="bg-zinc-100" style={{ aspectRatio: '4/3' }}></div>
      
      <div className="p-3.5 space-y-2">
        <div className="h-3 bg-zinc-100 rounded w-1/3"></div>
        <div className="h-4 bg-zinc-100 rounded w-4/5"></div>
        <div className="h-3 bg-zinc-100 rounded w-1/2"></div>
        <div className="h-8 bg-zinc-100 rounded w-full mt-2"></div>
      </div>
    </div>
  )
}

// ── Hero Slides ───────────────────────────────────────────────
const HERO_SLIDES = [
  {
    headline: 'Shop Without Limits',
    sub: 'Thousands of products. One destination. Delivered to your door.',
    bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=900&q=80'
  },
  {
    headline: 'New Arrivals Daily',
    sub: 'Fresh products added every day across every category.',
    bg: 'linear-gradient(135deg, #1c1917 0%, #292524 50%, #1c1917 100%)',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=900&q=80'
  },
  {
    headline: 'Deals You Cannot Miss',
    sub: 'Up to 60% off on selected items. Limited time only.',
    bg: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
    image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=900&q=80'
  }
]

// ── Category data ─────────────────────────────────────────────
const CATEGORIES = [
  { name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80' },
  { name: 'Fashion',     image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80' },
  { name: 'Home',        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80' },
  { name: 'Beauty',      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80' },
  { name: 'Sports',      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&q=80' },
  { name: 'Food',        image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400&q=80' },
]

// ── Main Home Component ───────────────────────────────────────
function Home() {
  const [products, setProducts]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [slideIndex, setSlideIndex] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const slideTimer                  = useRef(null)
  const navigate                    = useNavigate()

  const user  = JSON.parse(localStorage.getItem('user') || 'null')
  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchProducts()
    startSlider()
    return () => clearInterval(slideTimer.current)
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await API.get('/products/')
      setProducts(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const startSlider = () => {
    slideTimer.current = setInterval(() => {
      setSlideIndex(prev => (prev + 1) % HERO_SLIDES.length)
    }, 5000)
  }

  const goToSlide = (i) => {
    setSlideIndex(i)
    clearInterval(slideTimer.current)
    startSlider()
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) navigate(`/products?search=${searchQuery.trim()}`)
  }

  const slide = HERO_SLIDES[slideIndex]

  const featuredProducts  = products.slice(0, 8)
  const dealProducts      = products.filter(p => p.original_price && p.original_price > p.price).slice(0, 4)

  return (
    <div style={{ background: 'var(--bg)' }}>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: slide.bg, minHeight: '92vh', transition: 'background 0.8s ease' }}
      >
        {/* Background image */}
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center transition-all duration-1000"
          style={{ backgroundImage: `url(${slide.image})` }}
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(15,23,42,0.95) 50%, rgba(15,23,42,0.3))' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center" style={{ minHeight: '92vh' }}>
          <div className="max-w-2xl pt-16">

            {/* Greeting */}
            {token && user && (
              <p className="text-sm font-medium mb-4" style={{ color: '#f59e0b' }}>
                Welcome back, {user.full_name?.split(' ')[0]}
              </p>
            )}

            {/* Headline */}
            <h1
              className="font-black leading-none mb-6"
              style={{
                fontSize: 'clamp(2.5rem, 7vw, 5rem)',
                color: '#fff',
                letterSpacing: '-0.02em'
              }}
            >
              {slide.headline.split(' ').map((word, i, arr) =>
                i === arr.length - 1
                  ? <span key={i} style={{ color: '#f59e0b' }}> {word}</span>
                  : <span key={i}>{word} </span>
              )}
            </h1>

            <p className="text-lg mb-8 max-w-lg" style={{ color: 'rgba(255,255,255,0.65)', lineHeight: '1.7' }}>
              {slide.sub}
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-2 mb-8 max-w-lg">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What are you looking for?"
                className="flex-1 px-5 py-3.5 rounded-xl text-sm font-medium focus:outline-none"
                style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}
              />
              <button
                type="submit"
                className="px-6 py-3.5 rounded-xl text-sm font-bold transition-all"
                style={{ background: '#f59e0b', color: '#fff' }}
              >
                Search
              </button>
            </form>

            {/* CTAs */}
            <div className="flex gap-3 flex-wrap">
              <Link
                to="/products"
                className="px-7 py-3.5 rounded-xl text-sm font-bold transition-all"
                style={{ background: '#f59e0b', color: '#fff' }}
              >
                Shop Now
              </Link>
              {!token && (
                <Link
                  to="/register"
                  className="px-7 py-3.5 rounded-xl text-sm font-bold transition-all"
                  style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}
                >
                  Create Account
                </Link>
              )}
            </div>

            {/* Slide Dots */}
            <div className="flex gap-2 mt-12">
              {HERO_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === slideIndex ? '28px' : '8px',
                    height: '8px',
                    background: i === slideIndex ? '#f59e0b' : 'rgba(255,255,255,0.3)'
                  }}
                />
              ))}
            </div>

          </div>
        </div>

        {/* Stats strip at bottom of hero */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { number: '10k+', label: 'Products' },
                { number: '50k+', label: 'Customers' },
                { number: '99%',  label: 'Satisfaction' },
                { number: '24/7', label: 'Support' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-xl font-black" style={{ color: '#f59e0b' }}>{stat.number}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ──────────────────────────────────── */}
      <section className="bg-white" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: 'Fast Delivery',    desc: 'Same day in Lagos' },
              { title: 'Secure Payment',   desc: 'Powered by Paystack' },
              { title: 'Verified Products', desc: '100% authentic' },
              { title: 'Easy Returns',     desc: '7-day return policy' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-1">
                <div className="w-1.5 h-8 rounded-full flex-shrink-0" style={{ background: '#f59e0b' }} />
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>{item.title}</p>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#f59e0b' }}>
                Browse
              </p>
              <h2 className="text-3xl font-black" style={{ color: 'var(--primary)', letterSpacing: '-0.02em' }}>
                Shop by Category
              </h2>
            </div>
            <Link to="/products" className="text-sm font-semibold" style={{ color: '#f59e0b' }}>
              All Products
            </Link>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to={`/products?category=${cat.name}`}
                className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{ aspectRatio: '3/4', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.1) 60%)' }} />
                <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
                  <p className="text-xs font-bold text-white">{cat.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEALS SECTION ────────────────────────────────── */}
      {dealProducts.length > 0 && (
        <section className="py-16" style={{ background: 'var(--primary)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#f59e0b' }}>
                  Limited Time
                </p>
                <h2 className="text-3xl font-black text-white" style={{ letterSpacing: '-0.02em' }}>
                  Hot Deals
                </h2>
              </div>
              <Link to="/products" className="text-sm font-semibold" style={{ color: '#f59e0b' }}>
                See All
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {dealProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── FEATURED PRODUCTS ────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#f59e0b' }}>
                Handpicked
              </p>
              <h2 className="text-3xl font-black" style={{ color: 'var(--primary)', letterSpacing: '-0.02em' }}>
                Featured Products
              </h2>
            </div>
            <Link to="/products" className="text-sm font-semibold" style={{ color: '#f59e0b' }}>
              View All
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {loading
              ? [...Array(8)].map((_, i) => <SkeletonCard key={i} />)
              : featuredProducts.map(p => <ProductCard key={p.id} product={p} />)
            }
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────── */}
      {!token && (
        <section className="py-20" style={{ background: 'var(--primary)' }}>
          <div className="max-w-3xl mx-auto px-4 text-center">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#f59e0b' }}>
              Join Mart
            </p>
            <h2
              className="font-black text-white mb-5"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.02em' }}
            >
              Start Shopping Today
            </h2>
            <p className="text-lg mb-8" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Create a free account and get access to thousands of products, order tracking and fast delivery.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                to="/register"
                className="px-8 py-4 rounded-xl font-bold text-sm transition-all"
                style={{ background: '#f59e0b', color: '#fff' }}
              >
                Create Free Account
              </Link>
              <Link
                to="/products"
                className="px-8 py-4 rounded-xl font-bold text-sm transition-all"
                style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                Browse First
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default Home