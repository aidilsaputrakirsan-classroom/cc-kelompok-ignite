import { useState, useEffect, useCallback } from "react"
import { fetchAllTestimonials, toggleTestimonialVisibility, deleteTestimonial } from "../services/api"
import { toast } from "react-toastify"

// ═══════════════════════════════════════════════════════════
export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)

  // ── load testimonials ────────────────────────────────────
  const loadTestimonials = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchAllTestimonials(0, 100)
      setTestimonials(data.testimonials ?? [])
    } catch {
      toast.error("Gagal memuat testimoni pelanggan")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTestimonials()
  }, [loadTestimonials])

  // ── actions ──────────────────────────────────────────────
  const handleToggleVisibility = async (t) => {
    try {
      await toggleTestimonialVisibility(t.id)
      toast.success(`Testimoni ${t.user_name} berhasil ${t.is_visible ? "disembunyikan" : "ditampilkan"} ✅`)
      loadTestimonials()
    } catch {
      toast.error("Gagal memperbarui status testimoni")
    }
  }

  const handleDelete = async (t) => {
    if (!window.confirm(`Hapus testimoni dari ${t.user_name}?`)) return
    try {
      await deleteTestimonial(t.id)
      toast.success("Testimoni berhasil dihapus 🗑️")
      loadTestimonials()
    } catch {
      toast.error("Gagal menghapus testimoni")
    }
  }

  // ════════════════════════════════════════════════════════
  return (
    <div style={s.root}>
      <header style={s.header}>
        <h1 style={s.pageTitle}>Manajemen Testimoni</h1>
      </header>

      {loading ? (
        <div style={s.centerBox}>
          <div style={s.spinner} />
          <p style={s.mutedText}>Memuat data testimoni...</p>
        </div>
      ) : testimonials.length === 0 ? (
        <div style={s.centerBox}>
          <p style={s.mutedText}>Belum ada data testimoni dari pelanggan.</p>
        </div>
      ) : (
        <div style={s.grid}>
          {testimonials.map((t) => (
            <div key={t.id} style={s.card}>
              <div style={s.cardBody}>
                <div style={s.avatar}>{t.user_name?.charAt(0).toUpperCase()}</div>
                <div style={s.content}>
                  <div style={s.userInfo}>
                    <h3 style={s.userName}>{t.user_name}</h3>
                    <p style={s.productName}>{t.product_name}</p>
                  </div>
                  
                  <div style={s.ratingRow}>
                    {[...Array(5)].map((_, i) => (
                      <span key={i} style={{ color: i < t.rating ? "#F57C00" : "#D9D9D9", fontSize: "1.2rem" }}>
                        ★
                      </span>
                    ))}
                  </div>

                  <p style={s.comment}>“ {t.comment || "Tidak ada komentar."} ”</p>

                  <div style={s.actionRow}>
                    <button
                      style={{
                        ...s.actionBtn,
                        ...(t.is_visible ? s.hideBtn : s.showBtn),
                      }}
                      onClick={() => handleToggleVisibility(t)}
                    >
                      {t.is_visible ? "Sembunyikan" : "Tampilkan"}
                    </button>
                    <button style={{ ...s.actionBtn, ...s.deleteBtn }} onClick={() => handleDelete(t)}>
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const s = {
  root: {
    display: "flex",
    flexDirection: "column",
    gap: "28px",
    width: "100%",
  },
  header: {
    display: "flex",
    alignItems: "center",
  },
  pageTitle: {
    margin: 0,
    fontSize: "2rem",
    fontWeight: 800,
    color: "#2E1F14",
  },
  grid: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  card: {
    backgroundColor: "#F9F9F9",
    borderRadius: "36px",
    padding: "32px",
    border: "1px solid #D1D1D1",
    boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
  },
  cardBody: {
    display: "flex",
    gap: "24px",
    alignItems: "flex-start",
  },
  avatar: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    backgroundColor: "#D9D9D9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
    fontWeight: 800,
    color: "#FFFFFF",
    flexShrink: 0,
  },
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  userInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  userName: {
    margin: 0,
    fontSize: "1.3rem",
    fontWeight: 800,
    color: "#000000",
  },
  productName: {
    margin: 0,
    fontSize: "1rem",
    fontWeight: 600,
    color: "#9E9E9E",
  },
  ratingRow: {
    display: "flex",
    gap: "4px",
    margin: "4px 0",
  },
  comment: {
    margin: "8px 0 16px 0",
    fontSize: "1.05rem",
    fontWeight: 600,
    color: "#000000",
    lineHeight: "1.5",
  },
  actionRow: {
    display: "flex",
    gap: "16px",
  },
  actionBtn: {
    padding: "10px 32px",
    borderRadius: "14px",
    fontSize: "1.1rem",
    fontWeight: 800,
    cursor: "pointer",
    transition: "all 0.2s",
    border: "1px solid transparent",
  },
  showBtn: {
    backgroundColor: "#00B2FF",
    color: "#FFFFFF",
    border: "none",
  },
  hideBtn: {
    backgroundColor: "#FFFFFF",
    color: "#00B2FF",
    border: "1.5px solid #00B2FF",
  },
  deleteBtn: {
    backgroundColor: "#FFFFFF",
    color: "#FF5C5C",
    border: "1.5px solid #FF5C5C",
  },
  centerBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "80px 24px",
    gap: "16px",
  },
  spinner: {
    width: "44px",
    height: "44px",
    border: "4px solid #F3D2B3",
    borderTop: "4px solid #F57C00",
    borderRadius: "50%",
    animation: "spin 0.9s linear infinite",
  },
  mutedText: {
    margin: 0,
    color: "#70503C",
    fontSize: "1.05rem",
    textAlign: "center",
  },
}
