import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import About from './pages/About'
import Contact from './pages/Contact'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import Payment from './pages/Payment'
import PaymentCallback from './pages/PaymentCallback'
import Profile from './pages/account/Profile'
import Settings from './pages/account/Settings'
import Dashboard from './pages/admin/Dashboard'
import ProductList from './pages/admin/ProductList'
import ProductForm from './pages/admin/ProductForm'
import AdminOrders from './pages/admin/AdminOrders'
import AdminCustomers from './pages/admin/AdminCustomers'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function App() {
  const location = useLocation()
  const isAdminPage   = location.pathname.startsWith('/admin')
  const isAccountPage = ['/account', '/account/settings', '/orders'].includes(location.pathname)
  const hideChrome     = isAdminPage || isAccountPage

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <ScrollToTop />
      {!hideChrome && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />

        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/orders/:orderId" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
        <Route path="/payment/callback" element={<ProtectedRoute><PaymentCallback /></ProtectedRoute>} />

        <Route path="/account" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/account/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

        <Route path="/admin" element={<ProtectedRoute adminOnly={true}><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/products" element={<ProtectedRoute adminOnly={true}><ProductList /></ProtectedRoute>} />
        <Route path="/admin/products/new" element={<ProtectedRoute adminOnly={true}><ProductForm /></ProtectedRoute>} />
        <Route path="/admin/products/edit/:id" element={<ProtectedRoute adminOnly={true}><ProductForm /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute adminOnly={true}><AdminOrders /></ProtectedRoute>} />
        <Route path="/admin/customers" element={<ProtectedRoute adminOnly={true}><AdminCustomers /></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      {!hideChrome && <Footer />}
    </div>
  )
}

export default App