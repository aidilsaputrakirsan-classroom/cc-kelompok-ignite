import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import Header from "../components/Header"

export default function ProfilePage({ user, onLogout }) {
  const navigate = useNavigate()
  const [originalData, setOriginalData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  })
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    password: "",
  })
  const [editing, setEditing] = useState(false)

  const handleLogout = () => {
    onLogout?.()
    navigate("/login", { replace: true })
  }

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleEdit = () => {
    setEditing(true)
  }

  const handleSave = () => {
    const changed =
      formData.name !== originalData.name ||
      formData.email !== originalData.email ||
      formData.phone !== originalData.phone ||
      formData.address !== originalData.address ||
      formData.password.length > 0

    if (!changed) {
      setEditing(false)
      setFormData((prev) => ({ ...prev, password: "" }))
      return
    }

    toast.success("Perubahan berhasil disimpan", { position: "top-center" })
    const updatedUser = {
      ...user,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
    }

    setOriginalData({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
    })
    setEditing(false)
    setFormData((prev) => ({ ...prev, password: "" }))
  }

  return (
    <div style={styles.page}>
      <Header user={user} onLogout={onLogout} />
      <main style={styles.main}>
        <section style={styles.card}>
          <div style={styles.headerRow}>
            <div style={styles.profileInfo}>
              <h1 style={styles.title}>Profil Pelanggan</h1>
              <p style={styles.subTitle}>{formData.name || "Nama Pelanggan"}</p>
            </div>
          </div>
          <div style={styles.fields}>
            <div style={styles.field}>
              <span style={styles.label}>Nama Lengkap</span>
              {editing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleChange("name")}
                  style={styles.input}
                />
              ) : (
                <p style={styles.value}>{formData.name || "-"}</p>
              )}
            </div>
            <div style={styles.field}>
              <span style={styles.label}>Email</span>
              {editing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={handleChange("email")}
                  style={styles.input}
                />
              ) : (
                <p style={styles.value}>{formData.email || "-"}</p>
              )}
            </div>
            <div style={styles.field}>
              <span style={styles.label}>Nomor HP</span>
              {editing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange("phone")}
                  style={styles.input}
                />
              ) : (
                <p style={styles.value}>{formData.phone || "-"}</p>
              )}
            </div>
            <div style={styles.field}>
              <span style={styles.label}>Alamat</span>
              {editing ? (
                <textarea
                  value={formData.address}
                  onChange={handleChange("address")}
                  style={styles.textarea}
                />
              ) : (
                <p style={styles.value}>{formData.address || "-"}</p>
              )}
            </div>
            {editing && (
              <div style={styles.field}>
                <span style={styles.label}>Password baru (opsional)</span>
                <input
                  type="password"
                  value={formData.password}
                  onChange={handleChange("password")}
                  placeholder="Kosongkan jika tidak diubah"
                  style={styles.input}
                />
              </div>
            )}
          </div>
          <div style={styles.footerButtons}>
            {editing ? (
              <button type="button" onClick={handleSave} style={styles.saveButton}>
                Simpan Perubahan
              </button>
            ) : (
              <button type="button" onClick={handleEdit} style={styles.editButton}>
                Edit Profil
              </button>
            )}
            <button type="button" onClick={handleLogout} style={styles.logoutButton}>
              Keluar dari Akun
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "var(--bg-page)",
    paddingBottom: "40px",
  },
  main: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "24px",
  },
  card: {
    backgroundColor: "var(--surface)",
    borderRadius: "24px",
    padding: "32px",
    boxShadow: "var(--summary-shadow)",
  },
  title: {
    margin: 0,
    fontSize: "2rem",
    color: "var(--text-primary)",
  },
  fields: {
    display: "grid",
    gap: "16px",
    marginTop: "24px",
  },
  field: {
    backgroundColor: "var(--surface-subtle)",
    borderRadius: "18px",
    padding: "18px",
    border: "1px solid var(--border-card)",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    color: "var(--text-muted)",
    fontWeight: 700,
    fontSize: "0.95rem",
  },
  value: {
    margin: 0,
    color: "var(--text-dark)",
    fontSize: "1rem",
    lineHeight: 1.6,
  },
  headerRow: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    marginBottom: "24px",
  },
  profileInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  subTitle: {
    margin: 0,
    color: "var(--text-secondary)",
    fontSize: "1rem",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "16px",
    border: "1px solid var(--border-input)",
    fontSize: "1rem",
    color: "var(--text-dark)",
    backgroundColor: "var(--surface-input)",
    outline: "none",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    minHeight: "110px",
    padding: "14px 16px",
    borderRadius: "16px",
    border: "1px solid var(--border-input)",
    fontSize: "1rem",
    color: "var(--text-dark)",
    backgroundColor: "var(--surface-input)",
    outline: "none",
    resize: "vertical",
    boxSizing: "border-box",
  },
  footerButtons: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginTop: "28px",
  },
  editButton: {
    flex: 1,
    minWidth: "180px",
    padding: "14px 22px",
    border: "none",
    borderRadius: "14px",
    backgroundColor: "var(--brand)",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
  },
  saveButton: {
    flex: 1,
    minWidth: "180px",
    padding: "14px 22px",
    border: "none",
    borderRadius: "14px",
    backgroundColor: "var(--success-bg)",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
  },
  logoutButton: {
    flex: 1,
    minWidth: "180px",
    padding: "14px 22px",
    border: "1px solid var(--brand-hover)",
    borderRadius: "14px",
    backgroundColor: "var(--brand-light)",
    color: "var(--brand-hover)",
    fontWeight: 700,
    cursor: "pointer",
  },
}

