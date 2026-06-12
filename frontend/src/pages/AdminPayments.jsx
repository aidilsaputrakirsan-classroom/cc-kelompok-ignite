import { useState, useEffect, useCallback } from "react"
import { fetchAllPayments, fetchAllOrders, updatePaymentStatus, API_URL } from "../services/api"
import { toast } from "react-toastify"

// ── helpers ────────────────────────────────────────────────
function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount ?? 0)
}

function formatDate(isoDate) {
  if (!isoDate) return "-"
  return new Date(isoDate).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function getFullImageUrl(url) {
  if (!url) return null
  if (url.startsWith("http")) return url
  return `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`
}

const PAYMENT_STATUS_MAP = {
  pending: { label: "Menunggu Verifikasi", color: "#856404", bg: "#FFF3CD" },
  completed: { label: "Terverifikasi", color: "#1B5E20", bg: "#C8E6C9" },
  failed: { label: "Ditolak", color: "#B71C1C", bg: "#FFEBEE" },
  refunded: { label: "Dikembalikan", color: "#424242", bg: "#E0E0E0" },
}

// ═══════════════════════════════════════════════════════════
export default function AdminPayments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const [filterStatus, setFilterStatus] = useState("all")

  // ── load payments ─────────────────────────────────────────
  const loadPayments = useCallback(async () => {
    setLoading(true)
    try {
      const [paymentsData, ordersData] = await Promise.all([
        fetchAllPayments(0, 100),
        fetchAllOrders(0, 100)
      ])
      
      const ordersMap = {}
      if (ordersData && ordersData.orders) {
        ordersData.orders.forEach(order => {
          ordersMap[order.id] = order
        })
      }

      const enrichedPayments = (paymentsData.payments ?? []).map(p => ({
        ...p,
        order: ordersMap[p.order_id]
      }))

      setPayments(enrichedPayments)
    } catch {
      toast.error("Gagal memuat daftar pembayaran")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPayments()
  }, [loadPayments])

  // ── filter logic ──────────────────────────────────────────
  const filteredPayments = payments.filter((p) => {
    if (filterStatus === "all") return true
    return p.payment_status === filterStatus
  })

  // ── update logic ──────────────────────────────────────────
  const handleUpdateStatus = async (paymentId, status) => {
    setUpdatingId(paymentId)
    try {
      await updatePaymentStatus(paymentId, status)
      toast.success(`Pembayaran berhasil ${status === "completed" ? "diverifikasi" : "ditolak"} ✅`)
      loadPayments()
    } catch (err) {
      toast.error(err.message || "Gagal memperbarui status pembayaran")
    } finally {
      setUpdatingId(null)
    }
  }

  // ════════════════════════════════════════════════════════
  return (
    <div style={s.root}>
      <header style={s.header}>
        <h1 style={s.pageTitle}>Verifikasi Pembayaran</h1>
      </header>

      {/* ── FILTER BUTTONS ──────────────────────────────── */}
      <div style={s.filterRow}>
        {[
          { label: "Semua", key: "all" },
          { label: "Menunggu Verifikasi", key: "pending" },
          { label: "Terverifikasi", key: "completed" },
          { label: "Ditolak", key: "failed" },
        ].map((btn) => (
          <button
            key={btn.key}
            style={{
              ...s.filterBtn,
              backgroundColor: filterStatus === btn.key ? "#F57C00" : "#FFE7D0",
              color: filterStatus === btn.key ? "#FFFFFF" : "#70503C",
            }}
            onClick={() => setFilterStatus(btn.key)}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={s.centerBox}>
          <div style={s.spinner} />
          <p style={s.mutedText}>Memuat data pembayaran...</p>
        </div>
      ) : filteredPayments.length === 0 ? (
        <div style={s.centerBox}>
          <p style={s.mutedText}>
            {filterStatus === "all" ? "Belum ada data pembayaran." : `Tidak ada pembayaran dengan status "${PAYMENT_STATUS_MAP[filterStatus]?.label || filterStatus}".`}
          </p>
        </div>
      ) : (
        <div style={s.paymentGrid}>
          {filteredPayments.map((p) => {
            const statusInfo = PAYMENT_STATUS_MAP[p.payment_status] || { label: p.payment_status, color: "#70503C", bg: "#FFF4E6" }
            const isPending = p.payment_status === "pending"

            return (
              <div key={p.id} style={s.paymentCard}>
                <div style={s.cardHeader}>
                  <div style={s.codeGroup}>
                    <strong style={s.orderCode}>
                      {p.order_id ? `ATH-${String(p.order_id).padStart(10, "0")}` : "KODE TIDAK ADA"}
                    </strong>
                    <p style={s.customerName}>{p.order?.receipt_name || "Tanpa Nama"}</p>
                    <p style={s.paymentMethod}>{p.payment_method || "QRIS"}</p>
                  </div>
                  <div style={{ ...s.statusBadge, backgroundColor: statusInfo.bg, color: statusInfo.color }}>
                    {statusInfo.label}
                  </div>
                </div>

                <div style={s.cardBody}>
                  <h2 style={s.amountText}>{formatRupiah(p.amount)}</h2>
                  
                  <div style={s.proofSection}>
                    <p style={s.proofLabel}>Bukti Pembayaran :</p>
                    <div style={s.proofBox}>
                      {p.proof_url ? (
                        <img 
                          src={getFullImageUrl(p.proof_url)} 
                          alt="Bukti Transfer" 
                          style={s.proofImage} 
                          onClick={() => window.open(getFullImageUrl(p.proof_url), "_blank")}
                        />
                      ) : (
                        <div style={s.proofContentPlaceholder}>
                          <p style={{ color: "#707070", fontSize: "0.85rem", textAlign: "center", margin: "0 10px" }}>
                            Screenshot Transfer / Bukti QRIS
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {isPending ? (
                    <div style={s.actionRow}>
                      <button 
                        style={s.verifyBtn} 
                        onClick={() => handleUpdateStatus(p.id, "completed")}
                        disabled={updatingId === p.id}
                      >
                        {updatingId === p.id ? "..." : "Verifikasi"}
                      </button>
                      <button 
                        style={s.rejectBtn} 
                        onClick={() => handleUpdateStatus(p.id, "failed")}
                        disabled={updatingId === p.id}
                      >
                        {updatingId === p.id ? "..." : "Tolak"}
                      </button>
                    </div>
                  ) : (
                    <div style={s.footerInfo}>
                      {p.payment_status === "completed" && (
                        <p style={s.verifiedText}>
                          Diverifikasi oleh Admin : {formatDate(p.verified_at || p.updated_at)}
                        </p>
                      )}
                      {p.payment_status === "failed" && (
                        <p style={{ ...s.verifiedText, color: "#D32F2F" }}>
                          Pembayaran Ditolak pada {formatDate(p.updated_at)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const s = {
  root: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    width: "100%",
    paddingBottom: "40px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  filterRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "4px",
  },
  filterBtn: {
    padding: "8px 20px",
    borderRadius: "12px",
    border: "none",
    fontWeight: 700,
    fontSize: "0.85rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  pageTitle: {
    margin: 0,
    fontSize: "2rem",
    fontWeight: 800,
    color: "#2E1F14",
  },
  paymentGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  paymentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "24px",
    padding: "32px",
    border: "1px solid #D1D1D1",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    width: "100%",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "20px",
  },
  codeGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  orderCode: {
    fontSize: "1.25rem",
    fontWeight: 800,
    color: "#000000",
  },
  customerName: {
    margin: 0,
    color: "#6D6D6D",
    fontSize: "1rem",
    fontWeight: 500,
  },
  paymentMethod: {
    margin: 0,
    color: "#6D6D6D",
    fontSize: "1rem",
    fontWeight: 500,
  },
  statusBadge: {
    padding: "10px 24px",
    borderRadius: "24px",
    fontSize: "0.9rem",
    fontWeight: 700,
    border: "0.5px solid #00000030",
  },
  cardBody: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  amountText: {
    margin: 0,
    fontSize: "1.6rem",
    fontWeight: 800,
    color: "#00B0FF",
  },
  proofSection: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  proofLabel: {
    margin: 0,
    color: "#6D6D6D",
    fontSize: "0.95rem",
    fontWeight: 500,
  },
  proofBox: {
    width: "240px",
    height: "150px",
    backgroundColor: "#BDBDBD",
    borderRadius: "16px",
    overflow: "hidden",
    border: "1px solid #9E9E9E",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  proofImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  proofContentPlaceholder: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  actionRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "10px",
  },
  verifyBtn: {
    padding: "12px 36px",
    borderRadius: "14px",
    border: "none",
    backgroundColor: "#32CD32",
    color: "#FFFFFF",
    fontWeight: 700,
    fontSize: "1.1rem",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(50, 205, 50, 0.2)",
  },
  rejectBtn: {
    padding: "12px 36px",
    borderRadius: "14px",
    border: "none",
    backgroundColor: "#E53935",
    color: "#FFFFFF",
    fontWeight: 700,
    fontSize: "1.1rem",
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(229, 57, 53, 0.2)",
  },
  footerInfo: {
    marginTop: "16px",
    paddingTop: "16px",
    borderTop: "1px solid #EEEEEE",
  },
  verifiedText: {
    margin: 0,
    fontSize: "1rem",
    color: "#6D6D6D",
    fontWeight: 500,
  },
  centerBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 24px",
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
    fontSize: "1rem",
    textAlign: "center",
  },
}
