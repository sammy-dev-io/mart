import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import API from '../api/axios'
import { useCart } from '../context/CartContext'

const CATEGORIES = [
  'All', 'Electronics', 'Fashion', 'Home', 'Beauty', 'Food', 'Sports'
]

const SORT_OPTIONS = [
  { value: 'default',    label: 'Featured' },
  { value: 'price-low',  label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating',     label: 'Top Rated' },
  { value: 'name',       label: 'Name: A-Z' },
]

function Products() {
  const [products, setProducts]         = useState([])
  const [filtered, setFiltered]         = useState([])
  const [loading, setLoading]           = useState(true)
  const [search, setSearch]             = useState('')
  const [category, setCategory]         = useState('All')
  const [sort, setSort]                 = useState('default')
  const [priceRange, setPriceRange]     = useState({ min: '', max: '' })
  const [showFilter, setShowFilter]     = useState(false)
  const [inStockOnly, setInStockOnly]   = useState(false)
  const [searchParams]                  = useSearchParams()
  const { addToCart }                   = useCart()

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) setCategory(cat)
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
      result = result.filter(p =>
        p.category.toLowerCase() === category.toLowerCase()
      )
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
        <p className="text-gray-500 text-sm mt-1">
          {loading ? 'Loading...' : `${filtered.length} products found`}
        </p>
      </div>

      {/* Search + Filter Bar */}
      <div className="flex gap-3 mb-6">

        {/* Search */}
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
        >
          {SORT_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {/* Filter Button */}
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="relative flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          Filter
          {activeFilterCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Category Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              category === cat
                ? 'bg-indigo-600 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filter Drawer — mobile style slide down */}
      {showFilter && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">Filters</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-indigo-600 hover:underline"
            >
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

            {/* Availability */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Availability</p>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-600">In stock only</span>
              </label>
            </div>

            {/* Price Range */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Price Range (₦)</p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-gray-400 text-sm">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Results count + apply */}
            <div className="flex items-end">
              <button
                onClick={() => setShowFilter(false)}
                className="w-full bg-indigo-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
              >
                See {filtered.length} results
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
              <div className="bg-gray-200 h-48"></div>
              <div className="p-4 space-y-2">
                <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                <div className="bg-gray-200 h-8 rounded w-full mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500 text-sm mb-4">Try adjusting your search or filters</p>
          <button
            onClick={clearFilters}
            className="text-indigo-600 font-medium text-sm hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      )}
    </div>
  )
}

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
    in: 'In Stock', low: 'Low Stock', out: 'Out of Stock'
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
      <div className="relative overflow-hidden bg-gray-50 h-48">
        <img
          src={product.image || 'https://via.placeholder.com/400x300?text=No+Image'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image' }}
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.badge === 'hot' && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">🔥 Hot</span>
          )}
          {discount && (
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">-{discount}%</span>
          )}
          {product.badge === 'new' && (
            <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">New</span>
          )}
        </div>
      </div>

      <div className="p-3">
        <p className="text-xs text-indigo-600 font-medium uppercase tracking-wide mb-1">{product.category}</p>
        <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 leading-snug">{product.name}</h3>

        <div className="flex items-center gap-1 mb-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-400">{product.rating}</span>
        </div>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-base font-bold text-gray-900">₦{product.price.toLocaleString()}</span>
          {product.original_price && (
            <span className="text-xs text-gray-400 line-through">₦{product.original_price.toLocaleString()}</span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${stockColor[product.stock]}`}>
            {stockLabel[product.stock]}
          </span>
          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 'out'}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
          >
            {product.stock === 'out' ? 'Sold Out' : '+ Add'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Products