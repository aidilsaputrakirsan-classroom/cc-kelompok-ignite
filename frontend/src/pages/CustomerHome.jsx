import { useNavigate } from "react-router-dom"
import Header from "../components/Header"

const testimonials = [
  {
    name: "Siti M.",
    text: "Snack ATHSNAC selalu menjadi oleh-oleh favorit keluarga kami. Rasanya enak dan kemasannya rapi.",
  },
  {
    name: "Dedi W.",
    text: "Pelayanan cepat dan produknya fresh. Sangat cocok untuk oleh-oleh ketika pulang kampung.",
  },
  {
    name: "Rina P.",
    text: "Suka sekali dengan variasi snacknya. Harganya terjangkau dan rasanya sangat khas Balikpapan.",
  },
]

export default function CustomerHome({ user, onLogout }) {
  const navigate = useNavigate()

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
            <h1 style={styles.heroTitle}>Cita Rasa Asli, Langsung dari Dapur ATHSNAC</h1>
            <p style={styles.heroText}>Snack & makanan khas Balikpapan kualitas terjamin</p>
            <div style={styles.heroActions}>
              <button style={styles.heroButton} onClick={() => navigate("/shop")}>Lihat Produk</button>
              <button style={styles.secondaryButton} onClick={() => navigate("/about")}>Pelajari Lebih</button>
            </div>
          </div>
        </section>

        <section id="produk" style={styles.featureSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.featureTitle}>Produk Unggulan</h2>
            <div style={styles.divider} />
          </div>
          <div style={styles.emptySection} />
        </section>

        <section id="testimoni" style={styles.testimonialSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.featureTitle}>Kata Pelanggan</h2>
            <div style={styles.divider} />
          </div>
          <div style={styles.emptySection} />
        </section>
      </main>
    </div>
  )
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#FFF4E6",
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
    backgroundColor: "#FFFFFF",
    borderRadius: "28px",
  },
  heroLabel: {
    margin: 0,
    fontSize: "0.95rem",
    fontWeight: 700,
    color: "#F57C00",
    opacity: 0.8,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
  },
  heroTitle: {
    margin: "20px 0 12px",
    fontSize: "3rem",
    lineHeight: 1.05,
    color: "#2E1F14",
  },
  heroText: {
    margin: 0,
    fontSize: "1.05rem",
    color: "#70503C",
    lineHeight: 1.8,
  },
  heroActions: {
    display: "flex",
    gap: "16px",
    marginTop: "32px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  emptySection: {
    minHeight: "220px",
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
    backgroundColor: "#FFFFFF",
    borderRadius: "22px",
    padding: "24px",
    border: "1px solid #F3D2B3",
  },
  testimonialText: {
    margin: 0,
    color: "#5C4635",
    lineHeight: 1.8,
    fontSize: "1rem",
  },
  testimonialAuthor: {
    margin: "18px 0 0",
    color: "#2E1F14",
    fontWeight: 700,
    fontSize: "0.95rem",
  },
  heroButton: {
    minWidth: "180px",
    padding: "16px 24px",
    borderRadius: "22px",
    border: "none",
    backgroundColor: "#F57C00",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
  },
  secondaryButton: {
    minWidth: "180px",
    padding: "16px 24px",
    borderRadius: "22px",
    border: "none",
    backgroundColor: "#FFE7D0",
    color: "#F57C00",
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
    color: "#2E1F14",
  },
  divider: {
    flex: 1,
    height: "1px",
    backgroundColor: "#F3D2B3",
  },
  productGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "20px",
  },
  placeholderText: {
    textAlign: "center",
    color: "#70503C",
    fontSize: "1rem",
    padding: "40px",
  },
  aboutSection: {
    marginBottom: "40px",
  },
  aboutWrapper: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr",
    gap: "32px",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: "28px",
    padding: "32px",
  },
  aboutTextWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  aboutText: {
    margin: 0,
    color: "#70503C",
    fontSize: "1rem",
    lineHeight: 1.8,
  },
  aboutImage: {
    width: "100%",
    minHeight: "260px",
    objectFit: "cover",
    borderRadius: "24px",
    backgroundColor: "#F3F0EE",
  },
  contactSection: {
    marginBottom: "40px",
  },
  contactWrapper: {
    display: "grid",
    gridTemplateColumns: "1fr 1.1fr",
    gap: "32px",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: "28px",
    padding: "32px",
  },
  contactImage: {
    width: "100%",
    minHeight: "260px",
    objectFit: "cover",
    borderRadius: "24px",
    backgroundColor: "#F3F0EE",
  },
  contactInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
}
