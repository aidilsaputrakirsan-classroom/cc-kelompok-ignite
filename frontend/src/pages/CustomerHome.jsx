import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import Header from "../components/Header"
import ItemList from "../components/ItemList"
import { fetchPublicTestimonials } from "../services/api"

export default function CustomerHome({ user, onLogout }) {
  const navigate = useNavigate()
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        setLoading(true)
        const data = await fetchPublicTestimonials(0, 20)
        if (data && data.testimonials) {
          // Map API response to match UI format
          const formattedTestimonials = data.testimonials.map((item) => ({
            name: item.user_name || "Pelanggan",
            text: item.comment || "",
          }))
          setTestimonials(formattedTestimonials)
        }
      } catch (error) {
        console.error("Failed to load testimonials:", error)
        setTestimonials([])
      } finally {
        setLoading(false)
      }
    }

    loadTestimonials()
  }, [])

  const handleLogout = () => {
    onLogout?.()
    navigate("/login", { replace: true })
  }

  return (
    <div style={styles.page}>
      <Header user={user} onLogout={handleLogout} />

      <main style={styles.main}>
        <section id="home" style={styles.heroSection}>
          <div style={styles.heroContent}>
            <p style={styles.heroLabel}>Oleh-oleh Khas Balikpapan</p>
            <h1 style={styles.heroTitle}>
              Cita Rasa Asli, Langsung dari Dapur ATHSNAC
            </h1>
            <p style={styles.heroText}>
              Snack & makanan khas Balikpapan kualitas terjamin
            </p>
            <div style={styles.heroActions}>
              <button
                style={styles.heroButton}
                onClick={() => navigate("/shop")}
              >
                Lihat Produk
              </button>
              <button
                style={styles.secondaryButton}
                onClick={() => navigate("/about")}
              >
                Pelajari Lebih
              </button>
            </div>
          </div>
        </section>

        <section id="produk" style={styles.featureSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.featureTitle}>Produk Unggulan</h2>
            <div style={styles.divider} />
          </div>
          <ItemList isAdmin={false} />
        </section>

        <section id="testimoni" style={styles.testimonialSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.featureTitle}>Kata Pelanggan</h2>
            <div style={styles.divider} />
          </div>

          <div style={styles.testimonialList}>
            {testimonials.map((item, index) => (
              <div key={index} style={styles.testimonialCard}>
                <p style={styles.testimonialText}>"{item.text}"</p>
                <p style={styles.testimonialAuthor}>- {item.name}</p>
              </div>
            ))}
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
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "24px",
  },
  heroSection: {
    marginBottom: "32px",
  },
  heroContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    padding: "48px 24px",
    backgroundColor: "var(--surface)",
    borderRadius: "28px",
  },
  heroLabel: {
    margin: 0,
    fontSize: "0.95rem",
    fontWeight: 700,
    color: "var(--brand)",
    opacity: 0.9,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
  },
  heroTitle: {
    margin: "20px 0 12px",
    fontSize: "3rem",
    lineHeight: 1.05,
    color: "var(--text-primary)",
  },
  heroText: {
    margin: 0,
    fontSize: "1.05rem",
    color: "var(--text-secondary)",
    lineHeight: 1.8,
  },
  heroActions: {
    display: "flex",
    gap: "16px",
    marginTop: "32px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  heroButton: {
    minWidth: "180px",
    padding: "16px 24px",
    borderRadius: "22px",
    border: "none",
    backgroundColor: "var(--brand)",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
  },
  secondaryButton: {
    minWidth: "180px",
    padding: "16px 24px",
    borderRadius: "22px",
    border: "none",
    backgroundColor: "var(--brand-light)",
    color: "var(--brand)",
    fontWeight: 700,
    cursor: "pointer",
  },
  featureSection: {
    marginBottom: "40px",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "24px",
  },
  featureTitle: {
    margin: 0,
    fontSize: "2rem",
    color: "var(--text-primary)",
  },
  divider: {
    flex: 1,
    height: "1px",
    backgroundColor: "var(--divider)",
  },
  testimonialSection: {
    marginBottom: "40px",
  },
  testimonialList: {
    display: "grid",
    gap: "18px",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  },
  testimonialCard: {
    backgroundColor: "var(--surface)",
    borderRadius: "22px",
    padding: "24px",
    border: "1px solid var(--border-card)",
  },
  testimonialText: {
    margin: 0,
    color: "var(--text-secondary)",
    lineHeight: 1.8,
    fontSize: "1rem",
  },
  testimonialAuthor: {
    margin: "18px 0 0",
    color: "var(--text-primary)",
    fontWeight: 700,
    fontSize: "0.95rem",
  },
}