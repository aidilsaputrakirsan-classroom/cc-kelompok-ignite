import { useState, useEffect, useCallback } from "react"
import { fetchAllOrders, updateOrderStatus, deleteOrder } from "../services/api"
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
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const STATUS_MAP = {
  pending: { label: "Pending", color: "#B71C1C", bg: "#FFEBEE" },
  processing: { label: "Diproses", color: "#856404", bg: "#FFF3CD" },
  shipped: { label: "Dikirim", color: "#E65100", bg: "#FFF3E0" },
  delivered: { label: "Selesai", color: "#1B5E20", bg: "#E8F5E9" },
  cancelled: { label: "Batal", color: "#212121", bg: "#E0E0E0" },
}

// ═══════════════════════════════════════════════════════════
export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState("all")

  // modal status update
  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [targetOrder, setTargetOrder] = useState(null)
  const [newStatus, setNewStatus] = useState("")
  const [updating, setUpdating] = useState(false)

  // modal delete
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // ── load orders ──────────────────────────────────────────
  const loadOrders = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchAllOrders(0, 100)
      setOrders(data.orders ?? [])
    } catch {
      toast.error("Gagal memuat daftar pesanan")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  // ── filter logic ──────────────────────────────────────────
  const filteredOrders = orders.filter((o) => {
    if (filterStatus === "all") return true
    if (filterStatus === "diproses") return o.status === "processing" || o.status === "shipped"
    if (filterStatus === "selesai") return o.status === "delivered"
    return o.status === filterStatus
  })

  // ── edit status logic ─────────────────────────────────────
  const openStatusModal = (order) => {
    setTargetOrder(order)
    setNewStatus(order.status)
    setStatusModalOpen(true)
  }

  const handleUpdateStatus = async () => {
    if (!targetOrder) return
    setUpdating(true)
    try {
      await updateOrderStatus(targetOrder.id, newStatus)
      toast.success(`Status pesanan ${targetOrder.order_code} diperbarui ✅`)
      setStatusModalOpen(false)
      loadOrders()
    } catch (err) {
      toast.error(err.message || "Gagal memperbarui status")
    } finally {
      setUpdating(false)
    }
  }

  // ── delete logic ────────────────────────────────────────
  const confirmDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteOrder(deleteTarget.id)
      toast.success(`Pesanan ${deleteTarget.order_code} dihapus 🗑️`)
      setDeleteTarget(null)
      loadOrders()
    } catch (err) {
      toast.error(err.message || "Gagal menghapus pesanan")
    } finally {
      setDeleting(false)
    }
  }

  // ════════════════════════════════════════════════════════
  return (
    <div style={s.root}>
      <div style={s.topBar}>
        <h1 style={s.pageTitle}>Manajemen Pesanan</h1>
      </div>

      {/* ── FILTER BUTTONS ──────────────────────────────── */}
      <div style={s.filterRow}>
        {[
          { label: "Semua", key: "all" },
          { label: "Pending", key: "pending" },
          { label: "Diproses", key: "diproses" },
          { label: "Selesai", key: "selesai" },
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

      <div style={s.tableCard}>
        <div style={s.tableHead}>
          <span style={{ ...s.th, width: "120px" }}>KODE</span>
          <span style={{ ...s.th, flex: 1 }}>PELANGGAN</span>
          <span style={{ ...s.th, width: "150px" }}>TANGGAL</span>
          <span style={{ ...s.th, width: "130px", textAlign: "right" }}>TOTAL</span>
          <span style={{ ...s.th, width: "120px", textAlign: "center" }}>STATUS</span>
          <span style={{ ...s.th, width: "140px", textAlign: "center" }}>AKSI</span>
        </div>

        {loading ? (
          <div style={s.centerBox}>
            <div style={s.spinner} />
            <p style={s.mutedText}>Memuat pesanan...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div style={s.centerBox}>
            <p style={s.mutedText}>
              {filterStatus === "all" ? "Belum ada pesanan masuk." : `Tidak ada pesanan dengan status "${filterStatus}".`}
            </p>
          </div>
        ) : (
          filteredOrders.map((o, idx) => {
            const statusInfo = STATUS_MAP[o.status] || { label: o.status, color: "#F57C00", bg: "#FFF4E6" }
            return (
              <div
                key={o.id}
                style={{ ...s.tableRow, backgroundColor: idx % 2 === 0 ? "#FFFFFF" : "#FFFAF5" }}
              >
                <span style={{ ...s.tableCell, width: "120px" }}>{o.order_code}</span>
                <span style={{ ...s.tableCell, flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 700 }}>{o.receipt_name}</p>
                  <p style={{ margin: "2px 0 0", fontSize: "0.8rem", color: "#70503C" }}>{o.recipient_phone}</p>
                </span>
                <span style={{ ...s.tableCell, width: "150px", fontSize: "0.85rem" }}>
                  {formatDate(o.created_at)}
                </span>
                <span style={{ ...s.tableCell, width: "130px", textAlign: "right", fontWeight: 700 }}>
                  {formatRupiah(o.total_amount)}
                </span>
                <div style={{ width: "120px", display: "flex", justifyContent: "center" }}>
                  <span
                    style={{
                      ...s.statusBadge,
                      color: statusInfo.color,
                      backgroundColor: statusInfo.bg,
                    }}
                  >
                    {statusInfo.label}
                  </span>
                </div>
                <div style={{ width: "140px", display: "flex", gap: "8px", justifyContent: "center" }}>
                  <button style={s.editBtn} onClick={() => openStatusModal(o)}>Edit</button>
                  <button style={s.deleteBtn} onClick={() => setDeleteTarget(o)}>Hapus</button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* ── MODAL: EDIT STATUS ──────────────────────────── */}
      {statusModalOpen && (
        <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && setStatusModalOpen(false)}>
          <div style={s.modal}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>Update Status Pesanan</h2>
              <button style={s.closeBtn} onClick={() => setStatusModalOpen(false)}>✕</button>
            </div>
            <div style={s.modalBody}>
              <p style={s.label}>Pilih status terbaru untuk pesanan <strong>{targetOrder?.order_code}</strong>:</p>
              <select
                style={s.input}
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                {Object.entries(STATUS_MAP).map(([key, info]) => (
                  <option key={key} value={key}>{info.label}</option>
                ))}
              </select>
              <div style={s.modalActions}>
                <button style={s.cancelBtn} onClick={() => setStatusModalOpen(false)}>Batal</button>
                <button style={s.submitBtn} onClick={handleUpdateStatus} disabled={updating}>
                  {updating ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: DELETE CONFIRM ───────────────────────── */}
      {deleteTarget && (
        <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && setDeleteTarget(null)}>
          <div style={{ ...s.modal, maxWidth: "420px" }}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>Hapus Pesanan</h2>
              <button style={s.closeBtn} onClick={() => setDeleteTarget(null)}>✕</button>
            </div>
            <div style={s.modalBody}>
              <p>Yakin ingin menghapus data pesanan <strong>{deleteTarget.order_code}</strong>?</p>
              <p style={{ color: "#D95B12", fontSize: "0.85rem", marginTop: "8px" }}>Tindakan ini permanen dan tidak dapat dibatalkan.</p>
              <div style={s.modalActions}>
                <button style={s.cancelBtn} onClick={() => setDeleteTarget(null)}>Batal</button>
                <button
                  style={{ ...s.submitBtn, backgroundColor: "#D95B12" }}
                  onClick={confirmDelete}
                  disabled={deleting}
                >
                  {deleting ? "Menghapus..." : "Ya, Hapus"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const s = {
  root: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    width: "100%",
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
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
    fontSize: "1.9rem",
    fontWeight: 800,
    color: "#2E1F14",
  },
  tableCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "18px",
    border: "1px solid #F3D2B3",
    overflow: "hidden",
  },
  tableHead: {
    display: "flex",
    alignItems: "center",
    padding: "14px 24px",
    backgroundColor: "#FFF4E6",
    borderBottom: "1px solid #F3D2B3",
    gap: "16px",
  },
  th: {
    fontWeight: 700,
    fontSize: "0.78rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#70503C",
  },
  tableRow: {
    display: "flex",
    alignItems: "center",
    padding: "14px 24px",
    gap: "16px",
    borderBottom: "1px solid #F3D2B3",
    transition: "background-color 0.15s",
  },
  tableCell: {
    color: "#2E1F14",
    fontSize: "0.92rem",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  statusBadge: {
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "0.78rem",
    fontWeight: 700,
    textTransform: "capitalize",
    textAlign: "center",
    minWidth: "80px",
  },
  editBtn: {
    padding: "6px 16px",
    borderRadius: "10px",
    border: "1.5px solid #FBC02D",
    backgroundColor: "transparent",
    color: "#FBC02D",
    fontWeight: 700,
    fontSize: "0.82rem",
    cursor: "pointer",
  },
  deleteBtn: {
    padding: "6px 16px",
    borderRadius: "10px",
    border: "1.5px solid #D95B12",
    backgroundColor: "transparent",
    color: "#D95B12",
    fontWeight: 700,
    fontSize: "0.82rem",
    cursor: "pointer",
  },
  centerBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px 24px",
    gap: "12px",
  },
  spinner: {
    width: "36px",
    height: "36px",
    border: "3px solid #F3D2B3",
    borderTop: "3px solid #F57C00",
    borderRadius: "50%",
    animation: "spin 0.9s linear infinite",
  },
  mutedText: {
    margin: 0,
    color: "#70503C",
    fontSize: "0.95rem",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(46,31,20,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "24px",
  },
  modal: {
    backgroundColor: "#FFFFFF",
    borderRadius: "22px",
    width: "100%",
    maxWidth: "500px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
  },
  modalHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px 24px",
    borderBottom: "1px solid #F3D2B3",
  },
  modalTitle: {
    margin: 0,
    fontSize: "1.2rem",
    fontWeight: 800,
    color: "#2E1F14",
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: "1.3rem",
    color: "#70503C",
    cursor: "pointer",
  },
  modalBody: {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  label: {
    fontSize: "0.95rem",
    color: "#2E1F14",
    margin: 0,
  },
  input: {
    padding: "12px",
    borderRadius: "12px",
    border: "1.5px solid #F3D2B3",
    backgroundColor: "#FFFAF5",
    fontSize: "1rem",
    outline: "none",
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "8px",
  },
  cancelBtn: {
    padding: "10px 20px",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#FFE7D0",
    color: "#70503C",
    fontWeight: 700,
    cursor: "pointer",
  },
  submitBtn: {
    padding: "10px 24px",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#F57C00",
    color: "#FFFFFF",
    fontWeight: 700,
    cursor: "pointer",
  },
}
