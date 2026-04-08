import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

function RegisterPage({ onRegister }) {
  const navigate = useNavigate()
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
        role: "customer",
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
          <h1 style={styles.brand}>ATHSNACK</h1>
          <p style={styles.heading}>Buat Akun Baru</p>
          <p style={styles.subheading}>Daftar untuk mulai belanja produk khas Balikpapan.</p>
        </div>

        {error && <div style={styles.error}>{error}</div>}

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
  titleBlock: {
    textAlign: "center",
    marginBottom: "1.5rem",
  },
  bottomText: {
    marginTop: "1.5rem",
    fontSize: "0.95rem",
    color: "#70503C",
    textAlign: "center",
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
  linkText: {
    color: "#3F5BD9",
    textDecoration: "none",
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

export default RegisterPage
