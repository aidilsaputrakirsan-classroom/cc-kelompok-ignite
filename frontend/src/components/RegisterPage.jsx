import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

function RegisterPage({ onRegister }) {
  const navigate = useNavigate()
  const [role, setRole] = useState("customer")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password) => {
    return password.length >= 8 && /\d/.test(password)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (!formData.name.trim()) {
      setError("Nama Lengkap wajib diisi")
      setLoading(false)
      return
    }

    if (!validateEmail(formData.email)) {
      setError("Format email tidak valid")
      setLoading(false)
      return
    }

    if (!validatePassword(formData.password)) {
      setError("Password minimal 8 karakter dan harus memuat angka")
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Konfirmasi password tidak cocok")
      setLoading(false)
      return
    }

    try {
      await onRegister({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        address: formData.address.trim() || null,
        password: formData.password,
        role: role,
      })
      toast.success("Akun berhasil dibuat. Silakan login.", { position: "top-center" })
      navigate("/login", { replace: true })
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
          <p style={styles.heading}>Buat Akun Baru</p>
          <p style={styles.subheading}>Daftar untuk mulai belanja produk khas Balikpapan.</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.roleSection}>
          <label style={styles.roleLabel}>Daftar Sebagai</label>
          <div style={styles.roleOptions}>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                name="role"
                value="customer"
                checked={role === "customer"}
                onChange={(e) => setRole(e.target.value)}
              />
              Pelanggan
            </label>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                name="role"
                value="admin"
                checked={role === "admin"}
                onChange={(e) => setRole(e.target.value)}
              />
              Admin
            </label>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Nama Lengkap<span style={styles.required}>*</span>
          </label>
          <input
            type="text"
            name="name"
            placeholder="Masukkan nama lengkap"
            value={formData.name}
            onChange={handleChange}
            style={styles.input}
          />

          <label style={styles.label}>
            Email<span style={styles.required}>*</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="contoh@gmail.com"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
          />

          <label style={styles.label}>
            Nomor HP<span style={styles.required}>*</span>
          </label>
          <input
            type="tel"
            name="phone"
            placeholder="08xxxxxxxxxxxx"
            value={formData.phone}
            onChange={handleChange}
            style={styles.input}
          />

          <label style={styles.label}>
            Password<span style={styles.required}>*</span>
          </label>
          <input
            type="password"
            name="password"
            placeholder="Minimal 8 karakter"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
          />

          <label style={styles.label}>
            Konfirmasi Password<span style={styles.required}>*</span>
          </label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Ulangi password"
            value={formData.confirmPassword}
            onChange={handleChange}
            style={styles.input}
          />

          <label style={styles.label}>Alamat Lengkap</label>
          <textarea
            name="address"
            placeholder="Jl. nama jalan, kota, kode pos..."
            value={formData.address}
            onChange={handleChange}
            style={{ ...styles.input, minHeight: "88px", resize: "vertical" }}
          />

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Mendaftar..." : "Daftar Sekarang"}
          </button>
        </form>

        <div style={styles.bottomText}>
          Sudah punya akun? <Link to="/login" style={styles.linkText}>Masuk di sini</Link>
        </div>
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
  titleBlock: {
    textAlign: "center",
    marginBottom: "1.5rem",
  },
  form: {
    display: "grid",
    gap: "1rem",
  },
  bottomText: {
    marginTop: "1.5rem",
    fontSize: "0.9rem",
    color: "#666666",
    textAlign: "center",
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
  linkText: {
    color: "#F57C00",
    textDecoration: "none",
    fontWeight: 600,
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
  roleSection: {
    marginBottom: "1.5rem",
    padding: "1rem",
    backgroundColor: "#FAFAFA",
    borderRadius: "12px",
    border: "1px solid #E8E8E8",
  },
  roleLabel: {
    display: "block",
    marginBottom: "0.75rem",
    color: "#333333",
    fontWeight: 600,
    fontSize: "0.9rem",
  },
  roleOptions: {
    display: "flex",
    gap: "1.5rem",
  },
  radioLabel: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    color: "#555555",
    cursor: "pointer",
    fontWeight: 500,
    fontSize: "0.9rem",
  },
}

export default RegisterPage
