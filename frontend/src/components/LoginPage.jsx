import { useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"

function LoginPage({ onLogin }) {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

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
      await onLogin(formData.email.trim(), formData.password)
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
          <h1 style={styles.brand}>ATHSNACK</h1>
          <p style={styles.heading}>Selamat Datang Kembali</p>
          <p style={styles.subheading}>Masuk ke akun ATHSNACK kamu.</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Email / No HP<span style={styles.required}>*</span>
          </label>
          <input
            type="text"
            name="email"
            placeholder="Email atau nomor HP"
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
            <span />
            <Link to="/register" style={styles.linkText}>
              Belum punya akun? Daftar sekarang
            </Link>
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
    backgroundColor: "#FFF4E6",
    padding: "2rem",
  },
  card: {
    width: "100%",
    maxWidth: "520px",
    backgroundColor: "#F6F1EE",
    borderRadius: "28px",
    padding: "3rem",
    boxShadow: "0 25px 60px rgba(245, 124, 0, 0.12)",
  },
  brand: {
    margin: 0,
    color: "#2E1F14",
    fontSize: "2.75rem",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    fontWeight: 700,
  },
  heading: {
    margin: "18px 0 6px",
    fontSize: "1.75rem",
    color: "#3F2920",
  },
  subheading: {
    margin: "0 0 2rem",
    color: "#7A5B48",
    lineHeight: 1.6,
  },
  form: {
    display: "grid",
    gap: "1rem",
  },
  label: {
    color: "#70503C",
    fontWeight: 600,
    fontSize: "0.95rem",
  },
  required: {
    marginLeft: "0.25rem",
    color: "#D95B12",
  },
  input: {
    width: "100%",
    padding: "16px 18px",
    borderRadius: "16px",
    border: "1px solid #E7C4A8",
    backgroundColor: "#FFFFFF",
    color: "#3F2920",
    fontSize: "1rem",
    outline: "none",
  },
  helpRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "0.9rem",
    color: "#70503C",
  },
  titleBlock: {
    textAlign: "center",
    marginBottom: "1.5rem",
  },
  linkText: {
    color: "#3F5BD9",
    textDecoration: "none",
  },
  button: {
    padding: "16px 24px",
    borderRadius: "16px",
    border: "none",
    backgroundColor: "#F57C00",
    color: "white",
    fontWeight: 700,
    fontSize: "1rem",
    cursor: "pointer",
  },
  error: {
    marginBottom: "1rem",
    padding: "14px 16px",
    borderRadius: "14px",
    backgroundColor: "#FDE7E1",
    color: "#A12A25",
    fontWeight: 600,
  },
}

export default LoginPage
