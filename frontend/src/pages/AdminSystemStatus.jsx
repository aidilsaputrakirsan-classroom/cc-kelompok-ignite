import { useState, useEffect, useCallback } from "react"
import {
  fetchGatewayHealth,
  fetchAuthHealth,
  fetchAuthMetrics,
  fetchProductHealth,
  fetchProductMetrics,
} from "../services/api"
import { toast } from "react-toastify"

// Helper function to format uptime in seconds to human-readable string
function formatUptime(seconds) {
  if (seconds === undefined || seconds === null) return "N/A"
  const s = Math.floor(seconds)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60

  if (h > 0) return `${h}j ${m}m ${sec}d`
  if (m > 0) return `${m}m ${sec}d`
  return `${sec}d`
}

export default function AdminSystemStatus() {
  const [gatewayState, setGatewayState] = useState({ status: "loading", data: null })
  const [authState, setAuthState] = useState({ status: "loading", data: null, metrics: null })
  const [productState, setProductState] = useState({ status: "loading", data: null, metrics: null })
  
  const [lastChecked, setLastChecked] = useState("-")
  const [secondsToRefresh, setSecondsToRefresh] = useState(10)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Fetch status of all services in parallel
  const fetchStatus = useCallback(async () => {
    setIsRefreshing(true)

    // 1. API Gateway Health
    const gatewayPromise = fetchGatewayHealth()
      .then((data) => ({ status: data?.status === "healthy" ? "healthy" : "unhealthy", data }))
      .catch(() => ({ status: "unreachable", data: null }))

    // 2. Auth Service Health & Metrics
    const authHealthPromise = fetchAuthHealth()
      .then((data) => ({ status: data?.status === "healthy" ? "healthy" : "unhealthy", data }))
      .catch(() => ({ status: "unreachable", data: null }))

    const authMetricsPromise = fetchAuthMetrics().catch(() => null)

    // 3. Item Service Health & Metrics
    const productHealthPromise = fetchProductHealth()
      .then((data) => {
        // Item service health check returns: healthy, degraded, unhealthy
        const status = data?.status || "healthy"
        return { status, data }
      })
      .catch(() => ({ status: "unreachable", data: null }))

    const productMetricsPromise = fetchProductMetrics().catch(() => null)

    // Wait for all requests to finish
    const [
      gatewayRes,
      authHealthRes,
      authMetricsRes,
      productHealthRes,
      productMetricsRes,
    ] = await Promise.all([
      gatewayPromise,
      authHealthPromise,
      authMetricsPromise,
      productHealthPromise,
      productMetricsPromise,
    ])

    // Update States
    setGatewayState({
      status: gatewayRes.status,
      data: gatewayRes.data,
    })

    setAuthState({
      status: authHealthRes.status,
      data: authHealthRes.data,
      metrics: authMetricsRes,
    })

    setProductState({
      status: productHealthRes.status,
      data: productHealthRes.data,
      metrics: productMetricsRes,
    })

    setLastChecked(new Date().toLocaleTimeString("id-ID"))
    setSecondsToRefresh(10)
    setIsRefreshing(false)
  }, [])

  // Auto Refresh & Countdown Timer
  useEffect(() => {
    // Initial fetch
    fetchStatus()

    const timer = setInterval(() => {
      setSecondsToRefresh((prev) => {
        if (prev <= 1) {
          fetchStatus() // Trigger refresh
          return 10
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [fetchStatus])

  // Count states for summary cards
  const services = [gatewayState, authState, productState]
  const counts = {
    healthy: services.filter((s) => s.status === "healthy").length,
    degraded: services.filter((s) => s.status === "degraded").length,
    unhealthy: services.filter((s) => s.status === "unhealthy").length,
    unreachable: services.filter((s) => s.status === "unreachable").length,
  }

  // Get status badge colors
  const getBadgeStyles = (status) => {
    switch (status) {
      case "healthy":
        return { bg: "#E8F5E9", text: "#2E7D32", label: "🟢 Healthy" }
      case "degraded":
        return { bg: "#FFF3E0", text: "#E65100", label: "🟡 Degraded" }
      case "unhealthy":
        return { bg: "#FFEBEE", text: "#B71C1C", label: "🔴 Unhealthy" }
      case "unreachable":
        return { bg: "#ECEFF1", text: "#455A64", label: "⚫ Unreachable" }
      default:
        return { bg: "#FFF4E6", text: "#F57C00", label: "⏳ Loading..." }
    }
  }

  const handleManualRefresh = () => {
    fetchStatus()
    toast.success("Status sistem diperbarui", { autoClose: 1000, position: "top-center" })
  }

  return (
    <div style={s.root}>
      {/* ── HEADER ── */}
      <header style={s.header}>
        <div>
          <h1 style={s.pageTitle}>System Status</h1>
          <p style={s.pageSubtitle}>Monitor status kesehatan dan metrik seluruh layanan backend secara real-time.</p>
        </div>
        
        <div style={s.refreshContainer}>
          <div style={s.refreshMeta}>
            <span style={s.checkedText}>Terakhir diperiksa: <strong>{lastChecked}</strong></span>
            <span style={s.timerText}>
              Refresh otomatis dalam: <strong>{secondsToRefresh}s</strong>
            </span>
          </div>
          <button
            type="button"
            style={{
              ...s.refreshBtn,
              cursor: isRefreshing ? "not-allowed" : "pointer",
              opacity: isRefreshing ? 0.7 : 1,
            }}
            onClick={handleManualRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <span style={s.refreshingWrapper}>
                <span style={s.miniSpinner} /> Memperbarui...
              </span>
            ) : (
              "Periksa Sekarang"
            )}
          </button>
        </div>
      </header>

      {/* ── STATUS SUMMARY ── */}
      <section style={s.summaryRow}>
        <div style={{ ...s.summaryCard, borderLeft: "5px solid #2E7D32" }}>
          <span style={s.summaryLabel}>Healthy</span>
          <span style={{ ...s.summaryValue, color: "#2E7D32" }}>{counts.healthy}</span>
        </div>
        <div style={{ ...s.summaryCard, borderLeft: "5px solid #E65100" }}>
          <span style={s.summaryLabel}>Degraded</span>
          <span style={{ ...s.summaryValue, color: "#E65100" }}>{counts.degraded}</span>
        </div>
        <div style={{ ...s.summaryCard, borderLeft: "5px solid #B71C1C" }}>
          <span style={s.summaryLabel}>Unhealthy</span>
          <span style={{ ...s.summaryValue, color: "#B71C1C" }}>{counts.unhealthy}</span>
        </div>
        <div style={{ ...s.summaryCard, borderLeft: "5px solid #455A64" }}>
          <span style={s.summaryLabel}>Unreachable</span>
          <span style={{ ...s.summaryValue, color: "#455A64" }}>{counts.unreachable}</span>
        </div>
      </section>

      {/* ── SERVICES GRID ── */}
      <section style={s.servicesGrid}>
        
        {/* === CARD 1: API GATEWAY === */}
        <article style={s.serviceCard}>
          <div style={s.cardHeader}>
            <h2 style={s.cardTitle}>API Gateway</h2>
            <span
              style={{
                ...s.badge,
                backgroundColor: getBadgeStyles(gatewayState.status).bg,
                color: getBadgeStyles(gatewayState.status).text,
              }}
            >
              {getBadgeStyles(gatewayState.status).label}
            </span>
          </div>

          <div style={s.cardBody}>
            <div style={s.section}>
              <h3 style={s.sectionTitle}>Detail Layanan</h3>
              <div style={s.detailsList}>
                <div style={s.detailRow}>
                  <span style={s.detailLabel}>Nama Service</span>
                  <span style={s.detailValue}>{gatewayState.data?.service || "gateway"}</span>
                </div>
                <div style={s.detailRow}>
                  <span style={s.detailLabel}>Tipe Gateway</span>
                  <span style={s.detailValue}>Nginx Reverse Proxy</span>
                </div>
                <div style={s.detailRow}>
                  <span style={s.detailLabel}>Status Endpoint</span>
                  <span style={s.detailValue}>
                    {gatewayState.status === "unreachable" ? "🔴 Tidak merespons" : "🟢 Aktif (/health)"}
                  </span>
                </div>
              </div>
            </div>

            <div style={s.section}>
              <h3 style={s.sectionTitle}>Metrik Layanan</h3>
              <div style={s.noMetricsBox}>
                <span style={s.infoIcon}>ℹ️</span>
                <p style={s.noMetricsText}>
                  API Gateway bertindak sebagai reverse proxy statis dan tidak mengekspos metrik runtime HTTP.
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* === CARD 2: AUTH SERVICE === */}
        <article style={s.serviceCard}>
          <div style={s.cardHeader}>
            <h2 style={s.cardTitle}>Auth Service</h2>
            <span
              style={{
                ...s.badge,
                backgroundColor: getBadgeStyles(authState.status).bg,
                color: getBadgeStyles(authState.status).text,
              }}
            >
              {getBadgeStyles(authState.status).label}
            </span>
          </div>

          <div style={s.cardBody}>
            <div style={s.section}>
              <h3 style={s.sectionTitle}>Detail Layanan</h3>
              <div style={s.detailsList}>
                <div style={s.detailRow}>
                  <span style={s.detailLabel}>Nama Service</span>
                  <span style={s.detailValue}>{authState.data?.service || "auth-service"}</span>
                </div>
                <div style={s.detailRow}>
                  <span style={s.detailLabel}>Bahasa / Framework</span>
                  <span style={s.detailValue}>Python / FastAPI</span>
                </div>
                <div style={s.detailRow}>
                  <span style={s.detailLabel}>Status Database</span>
                  <span style={s.detailValue}>
                    {authState.status === "unreachable" ? "⚫ N/A" : "🟢 Terhubung (auth_db)"}
                  </span>
                </div>
              </div>
            </div>

            <div style={s.section}>
              <h3 style={s.sectionTitle}>Metrik Layanan</h3>
              {authState.metrics ? (
                <div style={s.metricsGrid}>
                  <div style={s.metricCard}>
                    <span style={s.metricVal}>{formatUptime(authState.metrics.uptime_seconds)}</span>
                    <span style={s.metricLabel}>Uptime</span>
                  </div>
                  <div style={s.metricCard}>
                    <span style={s.metricVal}>{authState.metrics.total_requests ?? 0}</span>
                    <span style={s.metricLabel}>Total Requests</span>
                  </div>
                  <div style={s.metricCard}>
                    <span style={s.metricVal}>{authState.metrics.total_errors ?? 0}</span>
                    <span style={s.metricLabel}>Total Errors</span>
                  </div>
                  <div style={s.metricCard}>
                    <span style={s.metricVal}>{authState.metrics.error_rate_percent ?? 0}%</span>
                    <span style={s.metricLabel}>Error Rate</span>
                  </div>
                  <div style={s.metricCard}>
                    <span style={s.metricVal}>{authState.metrics.latency?.avg_ms ?? 0} ms</span>
                    <span style={s.metricLabel}>Avg Latency</span>
                  </div>
                  <div style={s.metricCard}>
                    <span style={s.metricVal}>{authState.metrics.latency?.p95_ms ?? 0} ms</span>
                    <span style={s.metricLabel}>P95 Latency</span>
                  </div>
                </div>
              ) : (
                <div style={s.noMetricsBox}>
                  <span style={s.infoIcon}>⚠️</span>
                  <p style={s.noMetricsText}>
                    {authState.status === "unreachable" 
                      ? "Metrik tidak dapat diambil karena layanan tidak dapat dihubungi."
                      : "Metrik tidak tersedia atau gagal dimuat dari service."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </article>

        {/* === CARD 3: ITEM SERVICE === */}
        <article style={s.serviceCard}>
          <div style={s.cardHeader}>
            <h2 style={s.cardTitle}>Item Service</h2>
            <span
              style={{
                ...s.badge,
                backgroundColor: getBadgeStyles(productState.status).bg,
                color: getBadgeStyles(productState.status).text,
              }}
            >
              {getBadgeStyles(productState.status).label}
            </span>
          </div>

          <div style={s.cardBody}>
            <div style={s.section}>
              <h3 style={s.sectionTitle}>Detail Layanan & Dependensi</h3>
              <div style={s.detailsList}>
                <div style={s.detailRow}>
                  <span style={s.detailLabel}>Nama Service</span>
                  <span style={s.detailValue}>{productState.data?.service || "item-service"}</span>
                </div>
                <div style={s.detailRow}>
                  <span style={s.detailLabel}>Versi Layanan</span>
                  <span style={s.detailValue}>{productState.data?.version || "2.1.0"}</span>
                </div>
                <div style={s.detailRow}>
                  <span style={s.detailLabel}>Database (item_db)</span>
                  <span style={{
                    ...s.detailValue,
                    color: productState.data?.dependencies?.database?.status === "connected" ? "#2E7D32" : "#B71C1C",
                    fontWeight: 700
                  }}>
                    {productState.data?.dependencies?.database?.status === "connected" ? "🟢 Connected" : "🔴 Disconnected"}
                  </span>
                </div>
                <div style={s.detailRow}>
                  <span style={s.detailLabel}>Auth Service Dep.</span>
                  <span style={{
                    ...s.detailValue,
                    color: productState.data?.dependencies?.["auth-service"]?.status === "available" ? "#2E7D32" : "#B71C1C",
                    fontWeight: 700
                  }}>
                    {productState.data?.dependencies?.["auth-service"]?.status === "available" ? "🟢 Available" : "🔴 Unavailable"}
                  </span>
                </div>
              </div>
            </div>

            <div style={s.section}>
              <h3 style={s.sectionTitle}>Metrik Layanan</h3>
              {productState.metrics ? (
                <div style={s.metricsGrid}>
                  <div style={s.metricCard}>
                    <span style={s.metricVal}>{formatUptime(productState.metrics.uptime_seconds)}</span>
                    <span style={s.metricLabel}>Uptime</span>
                  </div>
                  <div style={s.metricCard}>
                    <span style={s.metricVal}>{productState.metrics.total_requests ?? 0}</span>
                    <span style={s.metricLabel}>Total Requests</span>
                  </div>
                  <div style={s.metricCard}>
                    <span style={s.metricVal}>{productState.metrics.total_errors ?? 0}</span>
                    <span style={s.metricLabel}>Total Errors</span>
                  </div>
                  <div style={s.metricCard}>
                    <span style={s.metricVal}>{productState.metrics.error_rate_percent ?? 0}%</span>
                    <span style={s.metricLabel}>Error Rate</span>
                  </div>
                  <div style={s.metricCard}>
                    <span style={s.metricVal}>{productState.metrics.latency?.avg_ms ?? 0} ms</span>
                    <span style={s.metricLabel}>Avg Latency</span>
                  </div>
                  <div style={s.metricCard}>
                    <span style={s.metricVal}>{productState.metrics.latency?.p95_ms ?? 0} ms</span>
                    <span style={s.metricLabel}>P95 Latency</span>
                  </div>
                </div>
              ) : (
                <div style={s.noMetricsBox}>
                  <span style={s.infoIcon}>⚠️</span>
                  <p style={s.noMetricsText}>
                    {productState.status === "unreachable" 
                      ? "Metrik tidak dapat diambil karena layanan tidak dapat dihubungi."
                      : "Metrik tidak tersedia atau gagal dimuat dari service."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </article>

      </section>
    </div>
  )
}

const s = {
  root: {
    display: "flex",
    flexDirection: "column",
    gap: "28px",
    width: "100%",
    animation: "fadeIn 0.3s ease",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
    backgroundColor: "#FFFFFF",
    padding: "24px",
    borderRadius: "22px",
    border: "1px solid #F3D2B3",
  },
  pageTitle: {
    margin: 0,
    fontSize: "2rem",
    fontWeight: 800,
    color: "#2E1F14",
  },
  pageSubtitle: {
    margin: "6px 0 0 0",
    fontSize: "0.95rem",
    color: "#70503C",
    fontWeight: 500,
  },
  refreshContainer: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
  },
  refreshMeta: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "4px",
  },
  checkedText: {
    fontSize: "0.85rem",
    color: "#70503C",
  },
  timerText: {
    fontSize: "0.85rem",
    color: "#F57C00",
  },
  refreshBtn: {
    padding: "12px 24px",
    borderRadius: "14px",
    border: "none",
    backgroundColor: "#F57C00",
    color: "#FFFFFF",
    fontWeight: 700,
    fontSize: "0.95rem",
    transition: "background-color 0.2s, transform 0.1s active",
    boxShadow: "0 4px 6px rgba(245, 124, 0, 0.15)",
  },
  refreshingWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  miniSpinner: {
    width: "14px",
    height: "14px",
    border: "2px solid rgba(255, 255, 255, 0.3)",
    borderTop: "2px solid #FFFFFF",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  summaryRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    padding: "20px 24px",
    borderRadius: "18px",
    border: "1px solid #F3D2B3",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    minHeight: "85px",
    boxShadow: "0 2px 4px rgba(46, 31, 20, 0.02)",
  },
  summaryLabel: {
    fontSize: "0.85rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#70503C",
  },
  summaryValue: {
    fontSize: "2rem",
    fontWeight: 800,
    marginTop: "6px",
  },
  servicesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    gap: "24px",
    width: "100%",
  },
  serviceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "22px",
    border: "1px solid #F3D2B3",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 4px 12px rgba(46, 31, 20, 0.03)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 24px",
    borderBottom: "1px solid #F3D2B3",
    backgroundColor: "#FFFAF5",
  },
  cardTitle: {
    margin: 0,
    fontSize: "1.2rem",
    fontWeight: 800,
    color: "#2E1F14",
  },
  badge: {
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: 700,
  },
  cardBody: {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    flex: 1,
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  sectionTitle: {
    margin: 0,
    fontSize: "0.9rem",
    fontWeight: 800,
    color: "#70503C",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    borderBottom: "1px dashed #F3D2B3",
    paddingBottom: "6px",
  },
  detailsList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "0.9rem",
  },
  detailLabel: {
    color: "#70503C",
    fontWeight: 500,
  },
  detailValue: {
    color: "#2E1F14",
    fontWeight: 700,
  },
  noMetricsBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    backgroundColor: "#FFFAF5",
    border: "1px solid #F3D2B3",
    padding: "16px",
    borderRadius: "14px",
    minHeight: "120px",
  },
  infoIcon: {
    fontSize: "1.5rem",
    flexShrink: 0,
  },
  noMetricsText: {
    margin: 0,
    fontSize: "0.85rem",
    color: "#70503C",
    lineHeight: "1.4",
    fontWeight: 500,
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
  },
  metricCard: {
    backgroundColor: "#FFFAF5",
    border: "1px solid #F3D2B3",
    padding: "14px 12px",
    borderRadius: "14px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  metricVal: {
    fontSize: "1.1rem",
    fontWeight: 800,
    color: "#2E1F14",
  },
  metricLabel: {
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "#70503C",
    marginTop: "4px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
}
