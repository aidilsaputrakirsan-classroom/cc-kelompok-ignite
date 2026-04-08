import { useNavigate } from "react-router-dom"
import Header from "../components/Header"

export default function OrdersPage({ user, onLogout }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    onLogout?.()
    navigate("/login", { replace: true })
  }

  return (
    <div style={styles.page}>
      <Header user={user} onLogout={handleLogout} />
      <main style={styles.main}>
        <section style={styles.card}>
          <h1 style={styles.title}>Pesanan Saya</h1>
          <p style={styles.text}>
            Halaman pesanan disiapkan untuk setiap fitur. Nanti Anda dapat melihat riwayat pesanan dan status pengiriman di halaman ini.
          </p>
          <button style={styles.button} onClick={() => navigate("/shop")}>Lihat Menu</button>
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
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "24px",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: "24px",
    padding: "32px",
    boxShadow: "0 20px 40px rgba(245, 124, 0, 0.12)",
  },
  title: {
    margin: 0,
    fontSize: "2rem",
    color: "#2E1F14",
  },
  text: {
    margin: "18px 0 0",
    color: "#70503C",
    lineHeight: 1.7,
    fontSize: "1rem",
  },
  button: {
    marginTop: "24px",
    padding: "14px 22px",
    border: "none",
    borderRadius: "14px",
    backgroundColor: "#F57C00",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
  },
}
