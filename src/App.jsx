import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ProductsPage from './pages/ProductsPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { isAuthenticated } from './services/authService'
import './App.css'

function App() {
  const auth = isAuthenticated()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={auth ? '/dashboard' : '/login'} replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <ProductsPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={auth ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
