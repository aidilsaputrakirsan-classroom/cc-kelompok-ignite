import { useEffect, useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useTheme } from "./context/ThemeContext"

import LoginPage from "./components/LoginPage"
import LoginChoicePage from "./components/LoginChoicePage"
import RegisterPage from "./components/RegisterPage"
import AdminDashboard from "./pages/AdminDashboard"
import CustomerHome from "./pages/CustomerHome"
import ShopPage from "./pages/ShopPage"
import AboutPage from "./pages/AboutPage"
import CartPage from "./pages/CartPage"
import OrdersPage from "./pages/OrdersPage"
import TestimoniPage from "./pages/TestimoniPage"
import ProfilePage from "./pages/ProfilePage"
import ProductDetailPage from "./pages/ProductDetailPage"
import CheckoutPage from "./pages/CheckoutPage"
import ProtectedRoute from "./components/ProtectedRoute"

import {
  login, register, getMe, checkHealth, getToken, clearToken, ServiceUnavailableError
} from "./services/api"

function App() {
  const { theme } = useTheme()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [authServiceUnavailable, setAuthServiceUnavailable] = useState(false)

  // 🌍 APPLY THEME GLOBAL KE SEMUA HALAMAN
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
  }, [theme])

  useEffect(() => {
    checkHealth().then(setIsConnected)

    const token = getToken()
    if (token) {
      getMe()
        .then(userData => setUser(userData))
        .catch((err) => {
          if (err instanceof ServiceUnavailableError) {
            // Auth service 503: keep token, keep session, show banner only
            setAuthServiceUnavailable(true)
          } else {
            clearToken()
            setUser(null)
          }
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const handleLogin = async (email, password, expectedRole) => {
    const data = await login(email, password)
    const actualRole = data.user?.role?.toLowerCase()

    if (expectedRole && actualRole !== expectedRole) {
      clearToken()
      throw new Error(
        expectedRole === "admin"
          ? "Akun ini bukan akun Admin. Silakan login sebagai Pelanggan."
          : "Akun ini bukan akun Pelanggan. Silakan login sebagai Admin."
      )
    }

    setUser(data.user)
    return data.user
  }

  const handleRegister = async (userData) => {
    await register(userData)
    return true
  }

  const handleLogout = () => {
    clearToken()
    setUser(null)
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    )
  }

  const authenticatedRedirect =
    user ? (user.role?.toLowerCase() === "admin" ? "/admin" : "/home") : "/login"

  return (
    <>
      {authServiceUnavailable && (
        <div style={styles.serviceUnavailableBanner}>
          <span style={styles.bannerIcon}>⚠️</span>
          <span>Some features temporarily unavailable</span>
          <button
            style={styles.bannerDismiss}
            onClick={() => setAuthServiceUnavailable(false)}
            aria-label="Tutup banner"
          >
            ✕
          </button>
        </div>
      )}
      <Router>
        <ToastContainer position="top-right" autoClose={3000} />

        <Routes>
            <Route
              path="/login"
              element={
                user ? <Navigate to={authenticatedRedirect} replace /> : <LoginChoicePage />
              }
            />

            <Route
              path="/login/:role"
              element={
                user ? <Navigate to={authenticatedRedirect} replace /> : <LoginPage onLogin={handleLogin} />
              }
            />

            <Route
              path="/register"
              element={
                user ? <Navigate to={authenticatedRedirect} replace /> : <RegisterPage onRegister={handleRegister} />
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute
                  element={<AdminDashboard user={user} onLogout={handleLogout} />}
                  requiredRole="admin"
                  user={user}
                />
              }
            />

            <Route
              path="/home"
              element={
                <ProtectedRoute
                  element={<CustomerHome user={user} onLogout={handleLogout} />}
                  requiredRole="customer"
                  user={user}
                />
              }
            />

            <Route
              path="/shop"
              element={
                <ProtectedRoute
                  element={<ShopPage user={user} onLogout={handleLogout} />}
                  requiredRole="customer"
                  user={user}
                />
              }
            />

            <Route
              path="/about"
              element={
                <ProtectedRoute
                  element={<AboutPage user={user} onLogout={handleLogout} />}
                  requiredRole="customer"
                  user={user}
                />
              }
            />

            <Route
              path="/cart"
              element={
                <ProtectedRoute
                  element={<CartPage user={user} onLogout={handleLogout} />}
                  requiredRole="customer"
                  user={user}
                />
              }
            />

            <Route
              path="/orders"
              element={
                <ProtectedRoute
                  element={<OrdersPage user={user} onLogout={handleLogout} />}
                  requiredRole="customer"
                  user={user}
                />
              }
            />

            <Route
              path="/testimoni"
              element={
                <ProtectedRoute
                  element={<TestimoniPage user={user} onLogout={handleLogout} />}
                  requiredRole="customer"
                  user={user}
                />
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute
                  element={<ProfilePage user={user} onLogout={handleLogout} />}
                  requiredRole="customer"
                  user={user}
                />
              }
            />

            <Route
              path="/product/:id"
              element={
                <ProtectedRoute
                  element={<ProductDetailPage user={user} onLogout={handleLogout} />}
                  requiredRole="customer"
                  user={user}
                />
              }
            />

            <Route
              path="/checkout"
              element={
                <ProtectedRoute
                  element={<CheckoutPage user={user} onLogout={handleLogout} />}
                  requiredRole="customer"
                  user={user}
                />
              }
            />

            <Route path="/" element={<Navigate to={authenticatedRedirect} replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </>
    )
  }

const styles = {
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontFamily: "sans-serif",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "5px solid #f3f3f3",
    borderTop: "5px solid #F57C00",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "20px",
  },
  serviceUnavailableBanner: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 20px",
    backgroundColor: "#FFF3CD",
    color: "#856404",
    borderBottom: "1px solid #FFEAA7",
    fontSize: "0.95rem",
    fontWeight: 600,
    position: "sticky",
    top: 0,
    zIndex: 9999,
    justifyContent: "center",
  },
  bannerIcon: {
    fontSize: "1rem",
  },
  bannerDismiss: {
    marginLeft: "auto",
    background: "none",
    border: "none",
    color: "#856404",
    cursor: "pointer",
    fontSize: "1rem",
    padding: "2px 6px",
    borderRadius: "4px",
    fontWeight: 700,
    lineHeight: 1,
  },
}


export default App