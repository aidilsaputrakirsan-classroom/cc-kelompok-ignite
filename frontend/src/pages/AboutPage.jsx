import { useNavigate } from "react-router-dom"
import Header from "../components/Header"

export default function AboutPage({ user, onLogout }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    onLogout?.()
    navigate("/login", { replace: true })
  }

  return (
    <div style={styles.page}>
      <Header user={user} onLogout={handleLogout} />
      <main style={styles.main}>
        <section id="about" style={styles.aboutSection}>
          <div style={styles.sectionHeader}>
            <h1 style={styles.pageTitle}>Tentang ATHSNAC</h1>
            <div style={styles.divider} />
          </div>
          <div style={styles.aboutWrapper}>
            <div style={styles.aboutTextWrapper}>
              <h2 style={styles.aboutTitle}>Snack Khas Balikpapan, Rasanya Tak Terlupakan</h2>
              <p style={styles.aboutText}>
                ATHSNAC hadir sebagai pilihan snack dan oleh-oleh khas Balikpapan. Kami fokus pada kualitas, rasa tradisional,
                dan kemasan praktis untuk perjalanan dan oleh-oleh keluarga.
              </p>
              <p style={styles.aboutText}>
                Nikmati berbagai pilihan snack lokal yang diolah dengan resep autentik, langsung dari pengrajin terpercaya.
              </p>
            </div>
            <img src="/About-1.png" alt="Tentang ATHSNAC" style={styles.aboutImage} />
          </div>
        </section>

        <section id="hubungi" style={styles.contactSection}>
          <div style={styles.sectionHeader}>
            <h1 style={styles.pageTitle}>Hubungi Kami</h1>
            <div style={styles.divider} />
          </div>
          <div style={styles.contactWrapper}>
            <img src="/About-2.png" alt="Hubungi Kami" style={styles.contactImage} />
            <div style={styles.contactInfo}>
              <h2 style={styles.contactTitle}>Siap Membantu Pesananmu</h2>
              <p style={styles.aboutText}>
                Butuh bantuan produk, status pesanan, atau rekomendasi snack? Hubungi kami melalui WA atau email untuk layanan cepat.
              </p>
              <div style={styles.contactItems}>
                <div style={styles.contactCard}>
                  <span style={styles.contactLabel}>Lokasi Toko</span>
                  <p style={styles.contactValue}>Jl. MT Haryono Dalam Perumahan Keren Banget No. 90, Balikpapan Selatan</p>
                </div>
                <div style={styles.contactCard}>
                  <span style={styles.contactLabel}>Jam Operasional</span>
                  <p style={styles.contactValue}>Senin - Sabtu: 09.00 - 20.00</p>
                  <p style={styles.contactValue}>Minggu: 10.00 - 18.00</p>
                </div>
                <div style={styles.contactCard}>
                  <span style={styles.contactLabel}>WhatsApp</span>
                  <p style={styles.contactValue}>+62 812-3456-7890</p>
                </div>
                <div style={styles.contactCard}>
                  <span style={styles.contactLabel}>Email</span>
                  <p style={styles.contactValue}>info@athsac.com</p>
                </div>
              </div>
            </div>
          </div>
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
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "24px",
  },
  pageTitle: {
    margin: 0,
    fontSize: "2rem",
    color: "#2E1F14",
  },
  divider: {
    flex: 1,
    height: "1px",
    backgroundColor: "#F3D2B3",
  },
  aboutSection: {
    marginBottom: "40px",
  },
  aboutWrapper: {
    display: "grid",
    gridTemplateColumns: "1.3fr 1fr",
    gap: "32px",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: "28px",
    padding: "32px",
  },
  aboutTextWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  aboutTitle: {
    margin: 0,
    fontSize: "1.8rem",
    color: "#2E1F14",
  },
  aboutText: {
    margin: 0,
    color: "#70503C",
    fontSize: "1rem",
    lineHeight: 1.8,
  },
  aboutImage: {
    width: "100%",
    minHeight: "320px",
    objectFit: "cover",
    borderRadius: "24px",
    backgroundColor: "#F3F0EE",
  },
  contactSection: {
    marginBottom: "40px",
  },
  contactWrapper: {
    display: "grid",
    gridTemplateColumns: "1fr 1.2fr",
    gap: "32px",
    alignItems: "stretch",
    backgroundColor: "#FFFFFF",
    borderRadius: "28px",
    padding: "32px",
  },
  contactImage: {
    width: "100%",
    height: "100%",
    minHeight: "360px",
    objectFit: "cover",
    borderRadius: "24px",
    backgroundColor: "#F3F0EE",
    display: "block",
  },
  contactInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  contactTitle: {
    margin: 0,
    fontSize: "1.5rem",
    color: "#2E1F14",
  },
  contactItems: {
    display: "grid",
    gap: "14px",
  },
  contactCard: {
    padding: "18px",
    backgroundColor: "#FFF7F0",
    borderRadius: "20px",
    border: "1px solid #F3D2B3",
  },
  contactLabel: {
    display: "block",
    marginBottom: "8px",
    color: "#8A5D3B",
    fontWeight: 700,
  },
  contactValue: {
    margin: 0,
    color: "#2E1F14",
    fontSize: "1rem",
  },
}
