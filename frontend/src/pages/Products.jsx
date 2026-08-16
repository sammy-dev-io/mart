import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import API from '../api/axios'
import { useCart } from '../context/CartContext'

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home', 'Beauty', 'Food', 'Sports']

const SORT_OPTIONS = [
  { value: 'default',    label: 'Featured' },
  { value: 'price-low',  label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating',     label: 'Top Rated' },
  { value: 'name',       label: 'Name: A-Z' },
]

function ProductCard({ product }) {
  const { addToCart } = useCart()

  const discount = product.original_price && product.original_price > product.price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null

  const stockStyles = {
    in:  { bg: 'rgba(16,185,129,0.1)', text: '#059669' },
    low: { bg: 'rgba(245,158,11,0.1)', text: '#d97706' },
    out: { bg: 'rgba(244,63,94,0.1)',  text: '#e11d48' },
  }
  const stockLabel = { in: 'In Stock', low: 'Low Stock', out: 'Out of Stock' }

  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
      style={{ border: '1px solid var(--border)' }}
    >
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative overflow-hidden bg-zinc-50 w-full" style={{ aspectRatio: '4/3' }}>
          <img
            src={product.image || 'https://via.placeholder.com/400x300?text=No+Image'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image' }}
          />
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
            {discount && (
              <span className="text-white text-xs font-bold px-2 py-0.5 rounded-md" style={{ background: '#f43f5e' }}>
                -{discount}%
              </span>
            )}
            {product.badge === 'new' && (
              <span className="text-white text-xs font-bold px-2 py-0.5 rounded-md" style={{ background: '#10b981' }}>
                New
              </span>
            )}
            {product.badge === 'hot' && (
              <span className="text-white text-xs font-bold px-2 py-0.5 rounded-md" style={{ background: '#f59e0b' }}>
                Hot
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="p-3.5 flex flex-col flex-1">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1 truncate" style={{ color: '#f59e0b' }}>
          {product.category}
        </p>
        <Link to={`/products/${product.id}`}>
          <h3
            className="text-sm font-semibold leading-snug mb-2 line-clamp-2 min-h-[2.5rem]"
            style={{ color: 'var(--primary)' }}
          >
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-3 h-3 flex-shrink-0" fill={i < Math.floor(product.rating) ? '#f59e0b' : '#e4e4e7'} viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs flex-shrink-0" style={{ color: 'var(--muted)' }}>{product.rating}</span>
        </div>

        <div className="flex-1"></div>

        <div className="flex items-baseline gap-1.5 mb-3 flex-wrap">
          <span className="text-base font-bold truncate" style={{ color: 'var(--primary)' }}>
            ₦{product.price.toLocaleString()}
          </span>
          {product.original_price && (
            <span className="text-xs line-through truncate" style={{ color: 'var(--muted)' }}>
              ₦{product.original_price.toLocaleString()}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0"
            style={{ background: stockStyles[product.stock].bg, color: stockStyles[product.stock].text }}
          >
            {stockLabel[product.stock]}
          </span>
          <button
            onClick={() => addToCart(product)}
            disabled={product.stock === 'out'}
            className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all flex-shrink-0 whitespace-nowrap"
            style={{
              background: product.stock === 'out' ? 'var(--border)' : '#f59e0b',
              color: product.stock === 'out' ? 'var(--muted)' : '#fff'
            }}
          >
            {product.stock === 'out' ? 'Sold Out' : '+ Add'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Products() {
  const [products, setProducts]     = useState([])
  const [filtered, setFiltered]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [category, setCategory]     = useState('All')
  const [sort, setSort]             = useState('default')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [showFilter, setShowFilter] = useState(false)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [searchParams]              = useSearchParams()

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) setCategory(cat)
    const searchParam = searchParams.get('search')
    if (searchParam) setSearch(searchParam)
  }, [searchParams])

  useEffect(() => {
    applyFilters()
  }, [products, search, category, sort, priceRange, inStockOnly])

  const fetchProducts = async () => {
    try {
      const response = await API.get('/products/')
      setProducts(response.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let result = [...products]

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q)
      )
    }

    if (category !== 'All') {
      result = result.filter(p => p.category.toLowerCase() === category.toLowerCase())
    }

    if (inStockOnly) {
      result = result.filter(p => p.stock !== 'out')
    }

    if (priceRange.min !== '') {
      result = result.filter(p => p.price >= Number(priceRange.min))
    }

    if (priceRange.max !== '') {
      result = result.filter(p => p.price <= Number(priceRange.max))
    }

    switch (sort) {
      case 'price-low':  result.sort((a, b) => a.price - b.price); break
      case 'price-high': result.sort((a, b) => b.price - a.price); break
      case 'rating':     result.sort((a, b) => b.rating - a.rating); break
      case 'name':       result.sort((a, b) => a.name.localeCompare(b.name)); break
    }

    setFiltered(result)
  }

  const clearFilters = () => {
    setSearch('')
    setCategory('All')
    setSort('default')
    setPriceRange({ min: '', max: '' })
    setInStockOnly(false)
  }

  const activeFilterCount = [
    category !== 'All',
    inStockOnly,
    priceRange.min !== '',
    priceRange.max !== ''
  ].filter(Boolean).length

  const inputStyle = { border: '1px solid var(--border)' }
  const handleFocus = (e) => e.target.style.borderColor = '#f59e0b'
  const handleBlur  = (e) => e.target.style.borderColor = 'var(--border)'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{ background: 'var(--bg)' }}>

      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-black" style={{ color: 'var(--primary)' }}>All Products</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
          {loading ? 'Loading...' : `${filtered.length} products found`}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">

        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" fill="none" stroke="var(--muted)" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none transition-all"
            style={inputStyle} onFocus={handleFocus} onBlur={handleBlur}
          />
        </div>

        <div className="flex gap-3">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-xl px-3 py-2.5 text-sm focus:outline-none bg-white flex-1 sm:flex-none"
            style={inputStyle}
          >
            {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>

          <button
            onClick={() => setShowFilter(!showFilter)}
            className="relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors flex-shrink-0"
            style={{ border: '1px solid var(--border)', color: 'var(--text)' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            Filter
            {activeFilterCount > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                style={{ background: '#f59e0b' }}
              >
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6" style={{ scrollbarWidth: 'none' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className="flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
            style={{
              background: category === cat ? 'var(--primary)' : '#fff',
              color: category === cat ? '#fff' : 'var(--text)',
              border: '1px solid var(--border)'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {showFilter && (
        <div className="bg-white rounded-2xl p-5 mb-6" style={{ border: '1px solid var(--border)' }}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold" style={{ color: 'var(--primary)' }}>Filters</h3>
            <button onClick={clearFilters} className="text-sm" style={{ color: '#f59e0b' }}>
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

            <div>
              <p className="text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>Availability</p>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: '#f59e0b' }}
                />
                <span className="text-sm" style={{ color: 'var(--muted)' }}>In stock only</span>
              </label>
            </div>

            <div>
              <p className="text-sm font-medium mb-2" style={{ color: 'var(--text)' }}>Price Range (₦)</p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
                  style={inputStyle} onFocus={handleFocus} onBlur={handleBlur}
                />
                <span className="text-sm" style={{ color: 'var(--muted)' }}>to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none"
                  style={inputStyle} onFocus={handleFocus} onBlur={handleBlur}
                />
              </div>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setShowFilter(false)}
                className="w-full py-2 rounded-xl text-sm font-semibold text-white transition-colors"
                style={{ background: '#f59e0b' }}
              >
                See {filtered.length} results
              </button>
            </div>

          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse" style={{ border: '1px solid var(--border)' }}>
              <div className="bg-zinc-100" style={{ aspectRatio: '4/3' }}></div>
              <div className="p-4 space-y-2">
                <div className="h-4 rounded w-3/4" style={{ background: 'var(--bg)' }}></div>
                <div className="h-4 rounded w-1/2" style={{ background: 'var(--bg)' }}></div>
                <div className="h-8 rounded w-full mt-4" style={{ background: 'var(--bg)' }}></div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--primary)' }}>No products found</h3>
          <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>Try adjusting your search or filters</p>
          <button onClick={clearFilters} className="text-sm font-medium" style={{ color: '#f59e0b' }}>
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </div>
  )
}

export default Products