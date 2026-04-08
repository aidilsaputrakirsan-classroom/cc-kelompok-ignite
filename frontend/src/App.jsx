import { useEffect, useState } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
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
import ProtectedRoute from "./components/ProtectedRoute"
import {
  login, register, getMe, checkHealth, getToken, clearToken
} from "./services/api"

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)


  useEffect(() => {
    checkHealth().then(setIsConnected)

    const token = getToken()
    if (token) {
      getMe()
        .then(userData => {
          setUser(userData)
        })
        .catch(() => {
          clearToken()
          setUser(null)
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const handleLogin = async (email, password) => {
    try {
      const data = await login(email, password)
      setUser(data.user)
      return data.user
    } catch (err) {
      throw err
    }
  }

  const handleRegister = async (userData) => {
    try {
      await register(userData)
      return true
    } catch (err) {
      throw err
    }
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

  const authenticatedRedirect = user ? (user.role?.toLowerCase() === "admin" ? "/admin" : "/home") : "/login"

  return (
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
          path="/"
          element={<Navigate to={authenticatedRedirect} replace />}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

const styles = {
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#FFF4E6",
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

if (!document.getElementById("spin-animation")) {
  const style = document.createElement("style")
  style.id = "spin-animation"
  style.innerHTML = `
    @keyframes spin {
      0% { transform: rotate(0deg) }
      100% { transform: rotate(360deg) }
    }
  `
  document.head.appendChild(style)
}

export default App
