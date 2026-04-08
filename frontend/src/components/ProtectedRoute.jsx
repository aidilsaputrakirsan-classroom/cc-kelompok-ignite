import { Navigate } from "react-router-dom"
import { getToken } from "../services/api"

/**
 * ProtectedRoute - Route guard untuk halaman yang memerlukan autentikasi
 * Jika user belum login, redirect ke login page
 * Jika user login tapi role tidak sesuai, redirect ke halaman yang sesuai dengan rolenya
 */
export default function ProtectedRoute({ 
  element, 
  requiredRole = null,
  user = null 
}) {
  const token = getToken()
  const isAuthenticated = !!token && !!user

  // Jika belum login, redirect ke login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Jika ada role requirement dan user role tidak sesuai
  if (requiredRole && user?.role?.toLowerCase() !== requiredRole.toLowerCase()) {
    // Redirect sesuai role user
    if (user?.role?.toLowerCase() === "admin") {
      return <Navigate to="/admin" replace />
    } else {
      return <Navigate to="/home" replace />
    }
  }

  // Jika semua check pass, render element
  return element
}
