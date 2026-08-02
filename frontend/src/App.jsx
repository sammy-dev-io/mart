import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/admin/Dashboard'
import ProductList from './pages/admin/ProductList'
import ProductForm from './pages/admin/ProductForm'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

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
    </Routes>
  )
}

export default App