import { useEffect, useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
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
  login, register, getMe, checkHealth, getToken, clearToken
} from "./services/api"

function App() {
  const { theme } = useTheme()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)

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
        .catch(() => {
          clearToken()
          setUser(null)
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
    console.log("App: handleLogout called")
    clearToken()
    setUser(null)
    toast.info("Anda telah logout", { position: "top-center" })
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
      <Router>
        <ToastContainer position="top-center" autoClose={3000} />

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
}

export default App