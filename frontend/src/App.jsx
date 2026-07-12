import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/admin/Dashboard'
import ProductList from './pages/admin/ProductList'
import ProductForm from './pages/admin/ProductForm'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<Dashboard />} />
      <Route path="/admin/products" element={<ProductList />} />
      <Route path="/admin/products/new" element={<ProductForm />} />
      <Route path="/admin/products/edit/:id" element={<ProductForm />} />
    </Routes>
  )
}

export default App