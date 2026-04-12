import { useState } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

function LoginPage({ onLogin }) {
  const navigate = useNavigate()
  const { role } = useParams()
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const isAdmin = role === "admin"
  const heading = isAdmin ? "Login Admin" : "Selamat Datang Kembali"
  const subheading = isAdmin ? "Masuk ke dashboard admin ATHSNAC" : "Masuk ke akun ATHSNAC kamu"

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!formData.email.trim()) {
      setError("Email atau nomor HP wajib diisi")
      setLoading(false)
      return
    }

    if (!formData.password.trim()) {
      setError("Password wajib diisi")
      setLoading(false)
      return
    }

    try {
      await onLogin(formData.email.trim(), formData.password, role)
      toast.success("Selamat datang kembali!", { position: "top-center" })
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      setError(errorMsg)
      toast.error(errorMsg, { position: "top-center" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.titleBlock}>
          <h1 style={styles.brand}>ATHSNAC</h1>
          <p style={styles.heading}>{heading}</p>
          <p style={styles.subheading}>{subheading}</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Email<span style={styles.required}>*</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="Masukkan email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
          />

          <label style={styles.label}>
            Password<span style={styles.required}>*</span>
          </label>
          <input
            type="password"
            name="password"
            placeholder="Masukkan password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
          />

          <div style={styles.helpRow}>
            <button type="button" style={styles.backButton} onClick={() => navigate("/login")}>
              ← Kembali
            </button>
            <div style={styles.registerText}>
              Belum punya akun? <Link to="/register" style={styles.linkText}>Daftar</Link>
            </div>
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAFAFA",
    padding: "2rem",
  },
  card: {
    width: "100%",
    maxWidth: "500px",
    backgroundColor: "#FFFFFF",
    borderRadius: "24px",
    padding: "3rem 2.5rem",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
  },
  brand: {
    margin: 0,
    color: "#F57C00",
    fontSize: "2.5rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    fontWeight: 700,
  },
  heading: {
    margin: "16px 0 4px",
    fontSize: "1.5rem",
    color: "#222222",
  },
  subheading: {
    margin: "0 0 2rem",
    color: "#666666",
    lineHeight: 1.5,
    fontSize: "0.95rem",
  },
  form: {
    display: "grid",
    gap: "1rem",
  },
  label: {
    color: "#333333",
    fontWeight: 600,
    fontSize: "0.9rem",
  },
  required: {
    marginLeft: "0.25rem",
    color: "#F57C00",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid #E0E0E0",
    backgroundColor: "#FFFFFF",
    color: "#333333",
    fontSize: "0.95rem",
    outline: "none",
  },
  helpRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "0.85rem",
    color: "#666666",
  },
  backButton: {
    background: "none",
    border: "none",
    color: "#F57C00",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: "0.85rem",
    padding: 0,
  },
  titleBlock: {
    textAlign: "center",
    marginBottom: "1.5rem",
  },
  linkText: {
    color: "#F57C00",
    textDecoration: "none",
    fontWeight: 600,
  },
  button: {
    padding: "14px 24px",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#F57C00",
    color: "#FFFFFF",
    fontWeight: 700,
    fontSize: "0.95rem",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  error: {
    marginBottom: "1rem",
    padding: "12px 16px",
    borderRadius: "12px",
    backgroundColor: "#FBE9E7",
    color: "#D32F2F",
    fontWeight: 600,
    fontSize: "0.9rem",
  },
  registerText: {
    fontSize: "0.85rem",
    color: "#333333",
  },
}

export default LoginPage
