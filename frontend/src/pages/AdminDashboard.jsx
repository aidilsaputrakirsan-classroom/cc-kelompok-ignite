import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { clearToken } from "../services/api"
import { toast } from "react-toastify"

const stats = [
  { label: "TOTAL PRODUK", value: "12" },
  { label: "PESANAN HARI INI", value: "8" },
  { label: "PENDAPATAN", value: "Rp 4,2 Jt" },
  { label: "MENUNGGU VERIFIKASI", value: "3" },
]

const orders = [
  { code: "ATH 001", customer: "Andini P", total: "Rp 60rb" },
  { code: "ATH 002", customer: "Putri R", total: "Rp 100rb" },
]

const menuItems = [
  { label: "Dashboard", key: "dashboard" },
  { label: "Produk", key: "products" },
  { label: "Pesanan", key: "orders" },
  { label: "Pembayaran", key: "payments" },
  { label: "Pelanggan", key: "customers" },
  { label: "Testimoni", key: "testimonials" },
]

export default function AdminDashboard({ user, onLogout }) {
  const [activeMenu, setActiveMenu] = useState("dashboard")
  const navigate = useNavigate()

  const handleLogout = () => {
    clearToken()
    onLogout?.()
    toast.info("Anda telah logout", { position: "top-center" })
    navigate("/login", { replace: true })
  }

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <span style={styles.sidebarTitle}>ATHSNAC ADMIN</span>
        </div>

        <nav style={styles.menu}>
          {menuItems.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveMenu(item.key)}
              style={{
                ...styles.menuButton,
                ...(activeMenu === item.key ? styles.menuButtonActive : {}),
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <button type="button" style={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main style={styles.main}>
        <header style={styles.hero}>
          <div>
            <h1 style={styles.pageTitle}>Selamat datang, Admin!</h1>
          </div>
        </header>

        <section style={styles.statsGrid}>
          {stats.map((item) => (
            <article key={item.label} style={styles.statCard}>
              <span style={styles.statLabel}>{item.label}</span>
              <strong style={styles.statValue}>{item.value}</strong>
            </article>
          ))}
        </section>

        <section style={styles.chartSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Pesanan 7 Hari Terakhir</h2>
          </div>
          <div style={styles.chartCard}>
            <div style={styles.chartBars}>
              {[60, 68, 75, 70, 64, 88, 92, 88].map((height, index) => (
                <div key={index} style={{ ...styles.chartBar, height: `${height}%` }} />
              ))}
            </div>
          </div>
        </section>

        <section style={styles.tableSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Pesanan Terbaru</h2>
          </div>
          <div style={styles.tableCard}>
            <div style={styles.tableRowHeader}>
              <span style={styles.tableHeading}>KODE</span>
              <span style={styles.tableHeading}>PELANGGAN</span>
              <span style={styles.tableHeading}>TOTAL</span>
            </div>
            {orders.map((order) => (
              <div key={order.code} style={styles.tableRow}>
                <span style={styles.tableCell}>{order.code}</span>
                <span style={styles.tableCell}>{order.customer}</span>
                <span style={styles.tableCell}>{order.total}</span>
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
    display: "flex",
    backgroundColor: "#E6E0DE",
    color: "#1F1F1F",
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  sidebar: {
    width: "260px",
    backgroundColor: "#C5C0BE",
    padding: "28px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  sidebarHeader: {
    padding: "18px 16px",
    backgroundColor: "#E7E1E0",
    borderRadius: "18px",
    marginBottom: "16px",
  },
  sidebarTitle: {
    display: "block",
    fontSize: "0.95rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
  },
  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  menuButton: {
    width: "100%",
    border: "none",
    borderRadius: "14px",
    padding: "14px 16px",
    backgroundColor: "transparent",
    textAlign: "left",
    fontSize: "0.95rem",
    color: "#191919",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  },
  menuButtonActive: {
    backgroundColor: "#8FD3FD",
    color: "#111",
    fontWeight: 700,
  },
  logoutButton: {
    marginTop: "auto",
    padding: "14px 16px",
    borderRadius: "14px",
    border: "none",
    backgroundColor: "#D95B12",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
  },
  main: {
    flex: 1,
    padding: "32px 28px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  hero: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pageTitle: {
    margin: 0,
    fontSize: "2rem",
    fontWeight: 800,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "20px",
  },
  statCard: {
    backgroundColor: "#F0F2F2",
    borderRadius: "18px",
    padding: "22px",
    minHeight: "120px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  statLabel: {
    color: "#8A8A8A",
    fontSize: "0.85rem",
    letterSpacing: "0.08em",
    fontWeight: 700,
    textTransform: "uppercase",
  },
  statValue: {
    marginTop: "14px",
    fontSize: "2rem",
    fontWeight: 800,
    color: "#141414",
  },
  chartSection: {
    backgroundColor: "#F0F2F2",
    borderRadius: "22px",
    padding: "24px",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px",
  },
  sectionTitle: {
    margin: 0,
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "#1F1F1F",
  },
  chartCard: {
    backgroundColor: "#EDE9E7",
    borderRadius: "18px",
    padding: "24px",
  },
  chartBars: {
    display: "flex",
    alignItems: "flex-end",
    gap: "14px",
    height: "220px",
  },
  chartBar: {
    flex: 1,
    borderRadius: "12px 12px 0 0",
    backgroundColor: "#8FD3FD",
  },
  tableSection: {
    backgroundColor: "#F0F2F2",
    borderRadius: "22px",
    padding: "24px",
  },
  tableCard: {
    marginTop: "14px",
    borderRadius: "18px",
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  tableRowHeader: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    backgroundColor: "#EDF4FF",
    padding: "18px 24px",
    fontWeight: 700,
    color: "#333",
  },
  tableHeading: {
    textTransform: "uppercase",
    fontSize: "0.85rem",
    letterSpacing: "0.08em",
  },
  tableRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    padding: "18px 24px",
    borderTop: "1px solid #F0F2F2",
  },
  tableCell: {
    color: "#2A2A2A",
    fontWeight: 600,
  },
}
