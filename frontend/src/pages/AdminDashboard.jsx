import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { clearToken, fetchProductStats, fetchAllOrders, fetchAllPayments } from "../services/api"
import { toast } from "react-toastify"
import AdminProducts from "./AdminProducts"
import AdminOrders from "./AdminOrders"
import AdminPayments from "./AdminPayments"
import AdminCustomers from "./AdminCustomers"
import AdminTestimonials from "./AdminTestimonials"

const menuItems = [
  { label: "Dashboard", key: "dashboard" },
  { label: "Produk", key: "products" },
  { label: "Pesanan", key: "orders" },
  { label: "Pembayaran", key: "payments" },
  { label: "Pelanggan", key: "customers" },
  { label: "Testimoni", key: "testimonials" },
]

function formatRupiah(amount) {
  if (amount === null || amount === undefined) return "Rp 0"
  if (amount >= 1_000_000) return `Rp ${(amount / 1_000_000).toFixed(1).replace(".", ",")} Jt`
  if (amount >= 1_000) return `Rp ${(amount / 1_000).toFixed(0)}rb`
  return `Rp ${amount}`
}

function getToday() {
  return new Date().toISOString().slice(0, 10)
}

function getLast7Days() {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().slice(0, 10))
  }
  return days
}

export default function AdminDashboard({ user, onLogout }) {
  const [activeMenu, setActiveMenu] = useState("dashboard")
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalProducts: 0,
    ordersToday: 0,
    revenue: 0,
    pendingPayments: 0,
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true)
      try {
        const [productStats, ordersData, paymentsData] = await Promise.all([
          fetchProductStats().catch(() => null),
          fetchAllOrders(0, 100).catch(() => null),
          fetchAllPayments(0, 100).catch(() => null),
        ])

        const today = getToday()
        const last7 = getLast7Days()

        const allOrders = ordersData?.orders ?? []
        const allPayments = paymentsData?.payments ?? []

        // Pesanan hari ini
        const ordersToday = allOrders.filter(
          (o) => o.created_at?.slice(0, 10) === today
        ).length

        // Pendapatan: jumlahkan total_amount dari semua order
        const revenue = allOrders.reduce((sum, o) => sum + (o.total_amount ?? 0), 0)

        // Menunggu verifikasi: payments dengan status pending
        const pendingPayments = allPayments.filter(
          (p) => p.payment_status === "pending"
        ).length

        // Chart: hitung order per hari untuk 7 hari terakhir
        const dayCounts = last7.map((day) => ({
          day,
          count: allOrders.filter((o) => o.created_at?.slice(0, 10) === day).length,
        }))

        // Normalisasi tinggi bar (maks 100%)
        const maxCount = Math.max(...dayCounts.map((d) => d.count), 1)
        const normalizedChart = dayCounts.map((d) => ({
          ...d,
          pct: Math.max((d.count / maxCount) * 100, 4), // min 4% supaya bar tetap kelihatan
        }))

        setStats({
          totalProducts: productStats?.total_products ?? 0,
          ordersToday,
          revenue,
          pendingPayments,
        })
        setRecentOrders(allOrders.slice(0, 5))
        setChartData(normalizedChart)
      } catch (err) {
        toast.error("Gagal memuat data dashboard")
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const handleLogout = () => {
    clearToken()
    onLogout?.()
    toast.info("Anda telah logout", { position: "top-center" })
    navigate("/login", { replace: true })
  }

  const statCards = [
    { label: "TOTAL PRODUK", value: stats.totalProducts },
    { label: "PESANAN HARI INI", value: stats.ordersToday },
    { label: "PENDAPATAN", value: formatRupiah(stats.revenue) },
    { label: "MENUNGGU VERIFIKASI", value: stats.pendingPayments },
  ]

  const statusBadgeStyle = (status) => {
    const map = {
      pending: { backgroundColor: "#FFF3E0", color: "#E65100" },
      processing: { backgroundColor: "#E3F2FD", color: "#1565C0" },
      shipped: { backgroundColor: "#E8F5E9", color: "#2E7D32" },
      delivered: { backgroundColor: "#F3E5F5", color: "#6A1B9A" },
      cancelled: { backgroundColor: "#FFEBEE", color: "#B71C1C" },
    }
    return map[status] ?? { backgroundColor: "#FFF4E6", color: "#F57C00" }
  }

  return (
    <div style={styles.page}>
      {/* ===== SIDEBAR ===== */}
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

      {/* ===== MAIN ===== */}
      <main style={styles.main}>
        {activeMenu === "dashboard" && (
          <>
            <header style={styles.hero}>
              <h1 style={styles.pageTitle}>Selamat datang, Admin!</h1>
            </header>

            {loading ? (
          <div style={styles.loadingBox}>
            <div style={styles.spinner} />
            <p style={styles.loadingText}>Memuat data...</p>
          </div>
        ) : (
          <>
            {/* ===== STAT CARDS ===== */}
            <section style={styles.statsGrid}>
              {statCards.map((item) => (
                <article key={item.label} style={styles.statCard}>
                  <span style={styles.statLabel}>{item.label}</span>
                  <strong style={styles.statValue}>{item.value}</strong>
                </article>
              ))}
            </section>

            {/* ===== CHART ===== */}
            <section style={styles.chartSection}>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>Pesanan 7 Hari Terakhir</h2>
              </div>
              <div style={styles.chartCard}>
                {chartData.every((d) => d.count === 0) ? (
                  <p style={styles.emptyChart}>Belum ada pesanan dalam 7 hari terakhir.</p>
                ) : (
                  <div style={styles.chartBars}>
                    {chartData.map((d) => (
                      <div key={d.day} style={styles.chartBarWrap}>
                        <div
                          title={`${d.day}: ${d.count} pesanan`}
                          style={{ ...styles.chartBar, height: `${d.pct}%` }}
                        />
                        <span style={styles.chartLabel}>
                          {new Date(d.day + "T00:00:00").toLocaleDateString("id-ID", {
                            weekday: "short",
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* ===== RECENT ORDERS ===== */}
            <section style={styles.tableSection}>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>Pesanan Terbaru</h2>
              </div>
              <div style={styles.tableCard}>
                <div style={styles.tableRowHeader}>
                  <span style={styles.tableHeading}>KODE</span>
                  <span style={styles.tableHeading}>PENERIMA</span>
                  <span style={styles.tableHeading}>TOTAL</span>
                  <span style={styles.tableHeading}>STATUS</span>
                </div>
                {recentOrders.length === 0 ? (
                  <p style={styles.emptyTable}>Belum ada pesanan.</p>
                ) : (
                  recentOrders.map((order) => (
                    <div key={order.id} style={styles.tableRow}>
                      <span style={styles.tableCell}>{order.order_code}</span>
                      <span style={styles.tableCell}>{order.receipt_name}</span>
                      <span style={styles.tableCell}>
                        {formatRupiah(order.total_amount)}
                      </span>
                      <span>
                        <span
                          style={{
                            ...styles.statusBadge,
                            ...statusBadgeStyle(order.status),
                          }}
                        >
                          {order.status}
                        </span>
                      </span>
                    </div>
                  ))
                )}
              </div>
            </section>
          </>
        )}
        </>
        )}

        {activeMenu === "products" && <AdminProducts />}
        {activeMenu === "orders" && <AdminOrders />}
        {activeMenu === "payments" && <AdminPayments />}
        {activeMenu === "customers" && <AdminCustomers />}
        {activeMenu === "testimonials" && <AdminTestimonials />}

        {activeMenu !== "dashboard" && activeMenu !== "products" && (
          <div style={styles.loadingBox}>
            <p style={styles.loadingText}>Fitur {activeMenu} sedang dalam pengembangan</p>
          </div>
        )}
      </main>
    </div>
  )
}

const styles = {
  /* ===== LAYOUT ===== */
  page: {
    minHeight: "100vh",
    display: "flex",
    backgroundColor: "#FFF4E6",
    color: "#2E1F14",
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  /* ===== SIDEBAR ===== */
  sidebar: {
    width: "240px",
    backgroundColor: "#FFE7D0",
    padding: "28px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    borderRight: "1px solid #F3D2B3",
  },
  sidebarHeader: {
    padding: "18px 16px",
    backgroundColor: "#FFFFFF",
    borderRadius: "18px",
    marginBottom: "12px",
    border: "1px solid #F3D2B3",
  },
  sidebarTitle: {
    display: "block",
    fontSize: "0.9rem",
    fontWeight: 800,
    letterSpacing: "0.1em",
    color: "#2E1F14",
  },
  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  menuButton: {
    width: "100%",
    border: "none",
    borderRadius: "14px",
    padding: "12px 16px",
    backgroundColor: "transparent",
    textAlign: "left",
    fontSize: "0.95rem",
    color: "#5C4635",
    cursor: "pointer",
    transition: "background-color 0.2s ease, color 0.2s ease",
    fontWeight: 500,
  },
  menuButtonActive: {
    backgroundColor: "#F57C00",
    color: "#FFFFFF",
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
    fontSize: "0.95rem",
  },

  /* ===== MAIN ===== */
  main: {
    flex: 1,
    padding: "32px 28px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    overflowY: "auto",
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
    color: "#2E1F14",
  },

  /* ===== LOADING ===== */
  loadingBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    gap: "16px",
    minHeight: "300px",
  },
  spinner: {
    width: "44px",
    height: "44px",
    border: "4px solid #F3D2B3",
    borderTop: "4px solid #F57C00",
    borderRadius: "50%",
    animation: "spin 0.9s linear infinite",
  },
  loadingText: {
    margin: 0,
    color: "#70503C",
    fontSize: "1rem",
  },

  /* ===== STATS ===== */
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "18px",
  },
  statCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "18px",
    padding: "22px",
    minHeight: "110px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    border: "1px solid #F3D2B3",
  },
  statLabel: {
    color: "#70503C",
    fontSize: "0.78rem",
    letterSpacing: "0.08em",
    fontWeight: 700,
    textTransform: "uppercase",
  },
  statValue: {
    marginTop: "10px",
    fontSize: "1.9rem",
    fontWeight: 800,
    color: "#2E1F14",
  },

  /* ===== CHART ===== */
  chartSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: "22px",
    padding: "24px",
    border: "1px solid #F3D2B3",
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
    color: "#2E1F14",
  },
  chartCard: {
    backgroundColor: "#FFF4E6",
    borderRadius: "16px",
    padding: "20px 24px",
    minHeight: "180px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  chartBars: {
    display: "flex",
    alignItems: "flex-end",
    gap: "12px",
    height: "180px",
    width: "100%",
  },
  chartBarWrap: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    height: "100%",
    gap: "6px",
  },
  chartBar: {
    width: "100%",
    borderRadius: "10px 10px 0 0",
    backgroundColor: "#F57C00",
    transition: "height 0.4s ease",
  },
  chartLabel: {
    fontSize: "0.72rem",
    color: "#70503C",
    fontWeight: 600,
    textTransform: "capitalize",
  },
  emptyChart: {
    margin: 0,
    color: "#70503C",
    fontSize: "0.95rem",
    textAlign: "center",
  },

  /* ===== TABLE ===== */
  tableSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: "22px",
    padding: "24px",
    border: "1px solid #F3D2B3",
  },
  tableCard: {
    marginTop: "4px",
    borderRadius: "14px",
    overflow: "hidden",
    border: "1px solid #F3D2B3",
  },
  tableRowHeader: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1.5fr 1fr 1fr",
    backgroundColor: "#FFF4E6",
    padding: "14px 20px",
    fontWeight: 700,
  },
  tableHeading: {
    textTransform: "uppercase",
    fontSize: "0.78rem",
    letterSpacing: "0.08em",
    color: "#70503C",
  },
  tableRow: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1.5fr 1fr 1fr",
    padding: "14px 20px",
    borderTop: "1px solid #F3D2B3",
    alignItems: "center",
  },
  tableCell: {
    color: "#2E1F14",
    fontWeight: 600,
    fontSize: "0.92rem",
  },
  statusBadge: {
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "0.78rem",
    fontWeight: 700,
    textTransform: "capitalize",
  },
  emptyTable: {
    textAlign: "center",
    padding: "32px",
    color: "#70503C",
    margin: 0,
    fontSize: "0.95rem",
  },
}

// Inject spinner animation once
if (!document.getElementById("admin-spin-anim")) {
  const s = document.createElement("style")
  s.id = "admin-spin-anim"
  s.innerHTML = `@keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }`
  document.head.appendChild(s)
}
