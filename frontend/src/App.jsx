import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import Dashboard from './pages/admin/Dashboard'
import ProductList from './pages/admin/ProductList'
import ProductForm from './pages/admin/ProductForm'
import ProtectedRoute from './components/ProtectedRoute'
import Payment from './pages/Payment'
import PaymentCallback from './pages/PaymentCallback'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cart" element={<Cart />} />

      <Route path="/checkout" element={
        <ProtectedRoute>
          <Checkout />
        </ProtectedRoute>
      } />

      <Route path="/orders" element={
        <ProtectedRoute>
          <Orders />
        </ProtectedRoute>
      } />

      <Route path="/orders/:orderId" element={
        <ProtectedRoute>
          <Orders />
        </ProtectedRoute>
      } />

      <Route path="/admin" element={
        <ProtectedRoute adminOnly={true}>
          <Dashboard />
        </ProtectedRoute>
      } />

      <Route path="/admin/products" element={
        <ProtectedRoute adminOnly={true}>
          <ProductList />
        </ProtectedRoute>
      } />

      <Route path="/admin/products/new" element={
        <ProtectedRoute adminOnly={true}>
          <ProductForm />
        </ProtectedRoute>
      } />

      <Route path="/admin/products/edit/:id" element={
        <ProtectedRoute adminOnly={true}>
          <ProductForm />
        </ProtectedRoute>
      } />

      <Route path="/payment" element={
  <ProtectedRoute>
    <Payment />
  </ProtectedRoute>
} />

<Route path="/payment/callback" element={
  <ProtectedRoute>
    <PaymentCallback />
  </ProtectedRoute>
} />

    </Routes>
  )
}


export default App