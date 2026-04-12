import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import Header from "../components/Header"
import { fetchMyOrders, getOrderItems, confirmOrder, completePayment, createPayment, getPaymentsByOrder, createTestimonial, API_URL } from "../services/api"
import { toast } from "react-toastify"

export default function OrdersPage({ user, onLogout }) {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [paymentForm, setPaymentForm] = useState({})
  const [testimonialForm, setTestimonialForm] = useState({})

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const data = await fetchMyOrders()
      let orders = data?.orders || []  // Response format: { total, orders }

      // Fetch items and payments for each order if not already included
      orders = await Promise.all(orders.map(async (order) => {
        try {
          // Fetch items if not included
          if (!order.items || order.items.length === 0) {
            const itemsResponse = await getOrderItems(order.id)
            // Response format: { order_id, total_items, items: [...] }
            order.items = itemsResponse?.items || []
          }
          // Fetch payments if not included
          if (!order.payments) {
            const paymentsResponse = await getPaymentsByOrder(order.id)
            // Handle both array and paginated response formats
            order.payments = Array.isArray(paymentsResponse) ? paymentsResponse : paymentsResponse?.payments || []
          }
        } catch (e) {
          console.warn(`Failed to fetch items/payments for order ${order.id}:`, e)
          // Continue even if fetch fails - order will just have empty items/payments
          if (!order.items) order.items = []
          if (!order.payments) order.payments = []
        }
        return order
      }))

      setOrders(orders)
    } catch (err) {
      console.error("Error loading orders:", err)
      toast.error("Gagal memuat pesanan")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    onLogout?.()
    navigate("/login", { replace: true })
  }

  const formatRupiah = (num) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num || 0)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { bg: "#FFF4E6", color: "#F57C00", text: "Menunggu Konfirmasi" },
      processing: { bg: "#E3F2FD", color: "#1976D2", text: "Diproses" },
      shipped: { bg: "#E8F5E9", color: "#388E3C", text: "Dikirim" },
      delivered: { bg: "#F3E5F5", color: "#7B1FA2", text: "Tiba" },
    }
    const style = statusMap[status] || statusMap.pending
    return (
      <span style={{
        backgroundColor: style.bg,
        color: style.color,
        padding: "6px 12px",
        borderRadius: "20px",
        fontSize: "14px",
        fontWeight: "600",
      }}>
        {style.text}
      </span>
    )
  }

  const getPaymentStatusBadge = (status) => {
    const statusMap = {
      pending: { bg: "#FFF4E6", color: "#F57C00", text: "Menunggu" },
      completed: { bg: "#E8F5E9", color: "#388E3C", text: "Selesai" },
      failed: { bg: "#FFEBEE", color: "#D32F2F", text: "Gagal" },
      refunded: { bg: "#FCE4EC", color: "#C2185B", text: "Kembali" },
    }
    const style = statusMap[status] || statusMap.pending
    return (
      <span style={{
        backgroundColor: style.bg,
        color: style.color,
        padding: "4px 10px",
        borderRadius: "16px",
        fontSize: "12px",
        fontWeight: "600",
      }}>
        {style.text}
      </span>
    )
  }

  const handleConfirmOrder = async (orderId) => {
    try {
      toast.loading("Mengkonfirmasi pesanan...", { id: "confirm" })
      await confirmOrder(orderId)
      toast.success("Pesanan dikonfirmasi!", { id: "confirm" })
      loadOrders()
    } catch (err) {
      toast.error(err?.message || "Gagal mengkonfirmasi pesanan", { id: "confirm" })
    }
  }

  const handleCreatePayment = async (orderId, order) => {
    const formDataKey = `payment_${orderId}`
    const data = paymentForm[formDataKey] || {}

    if (!data.payment_method?.trim()) {
      toast.error("Pilih metode pembayaran", { id: `payment_${orderId}` })
      return
    }
    if (!data.proof_url?.trim()) {
      toast.error("Upload bukti pembayaran", { id: `payment_${orderId}` })
      return
    }

    try {
      toast.loading("Membuat pembayaran...", { id: `payment_${orderId}` })
      const paymentData = {
        order_id: orderId,
        payment_method: data.payment_method,
        amount: order.total_amount,
        proof_url: data.proof_url,
      }
      await createPayment(paymentData)
      toast.success("Pembayaran berhasil dibuat! Tunggu admin verifikasi.", { id: `payment_${orderId}` })
      setPaymentForm({ ...paymentForm, [formDataKey]: {} })
      loadOrders()
    } catch (err) {
      toast.error(err?.message || "Gagal membuat pembayaran", { id: `payment_${orderId}` })
    }
  }

  const handleCreateTestimonial = async (orderId) => {
    const formDataKey = `testimonial_${orderId}`
    const data = testimonialForm[formDataKey] || {}

    if (!data.rating) {
      toast.error("Berikan rating", { id: `testimonial_${orderId}` })
      return
    }
    if (!data.comment?.trim()) {
      toast.error("Tulis komentar", { id: `testimonial_${orderId}` })
      return
    }

    try {
      toast.loading("Mengirim testimonial...", { id: `testimonial_${orderId}` })
      const testimonialData = {
        order_id: orderId,
        rating: parseInt(data.rating),
        comment: data.comment,
        is_visible: true,
      }
      await createTestimonial(testimonialData)
      toast.success("Testimonial berhasil dikirim!", { id: `testimonial_${orderId}` })
      setTestimonialForm({ ...testimonialForm, [formDataKey]: {} })
      loadOrders()
    } catch (err) {
      toast.error(err?.message || "Gagal mengirim testimonial", { id: `testimonial_${orderId}` })
    }
  }

  const handleCompletePayment = async (orderId) => {
    try {
      toast.loading("Menyelesaikan pembayaran...", { id: `complete_${orderId}` })
      await completePayment(orderId)
      toast.success("Pembayaran selesai! Order siap untuk testimonial.", { id: `complete_${orderId}` })
      loadOrders()
    } catch (err) {
      toast.error(err?.message || "Gagal menyelesaikan pembayaran", { id: `complete_${orderId}` })
    }
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <Header user={user} onLogout={handleLogout} />
        <main style={styles.main}>
          <p style={{ textAlign: "center", color: "#666" }}>Memuat pesanan...</p>
        </main>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <Header user={user} onLogout={handleLogout} />
      <main style={styles.main}>
        <h1 style={styles.title}>Pesanan Saya</h1>

        {orders.length === 0 ? (
          <section style={styles.emptyCard}>
            <p style={styles.emptyText}>Belum ada pesanan</p>
            <button style={styles.button} onClick={() => navigate("/shop")}>
              Belanja Sekarang
            </button>
          </section>
        ) : (
          <div style={styles.ordersList}>
            {orders.map((order) => (
              <div key={order.id} style={styles.orderCard}>
                <div style={styles.orderHeader}>
                  <div>
                    <h3 style={styles.orderTitle}>Pesanan #{order.id}</h3>
                    <p style={styles.orderMeta}>{formatDate(order.created_at)}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                <div style={styles.orderInfo}>
                  <div style={styles.infoSection}>
                    <h4 style={styles.infoLabel}>Penerima</h4>
                    <p style={styles.infoValue}>{order.receipt_name}</p>
                    <p style={styles.infoMeta}>{order.recipient_phone}</p>
                    <p style={styles.infoMeta}>{order.shipping_address}</p>
                  </div>

                  <div style={styles.infoSection}>
                    <h4 style={styles.infoLabel}>Total Pesanan</h4>
                    <p style={styles.totalAmount}>{formatRupiah(order.total_amount)}</p>
                  </div>
                </div>

                {/* Items */}
                {order.items && order.items.length > 0 && (
                  <div style={styles.itemsSection}>
                    <h4 style={styles.infoLabel}>Item Pesanan</h4>
                    {order.items.map((item) => (
                      <div key={item.item_id || item.id} style={styles.itemRow}>
                        <div style={styles.itemInfo}>
                          <p style={styles.itemName}>{item.product_name || item.product?.name || "Produk"}</p>
                          <p style={styles.itemMeta}>{item.quantity}x @ {formatRupiah(item.price_at_time)}</p>
                        </div>
                        <p style={styles.itemSubtotal}>{formatRupiah(item.subtotal)}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Payment Status */}
                <div style={styles.paymentSection}>
                  <h4 style={styles.infoLabel}>Status Pembayaran</h4>
                  {order.payments && order.payments.length > 0 ? (
                    <div>
                      {order.payments.map((payment) => (
                        <div key={payment.id} style={styles.paymentRow}>
                          <div>
                            <p style={styles.paymentMethod}>{payment.payment_method}</p>
                            <p style={styles.paymentMeta}>
                              {formatRupiah(payment.amount)} - {formatDate(payment.created_at)}
                            </p>
                          </div>
                          {getPaymentStatusBadge(payment.payment_status)}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={styles.noData}>Belum ada pembayaran</p>
                  )}
                </div>

                {/* Actions based on order status */}
                <div style={styles.actionsSection}>
                  {/* Step 1: Confirm Order */}
                  {order.status === "pending" && (
                    <button
                      style={styles.primaryButton}
                      onClick={() => handleConfirmOrder(order.id)}
                    >
                      ✓ Konfirmasi Pesanan
                    </button>
                  )}

                  {/* Step 2: Create Payment */}
                  {(order.status === "pending" || order.status === "processing") && (!order.payments || order.payments.length === 0) && (
                    <div style={styles.paymentFormSection}>
                      <h4 style={styles.infoLabel}>Buat Pembayaran</h4>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Metode Pembayaran</label>
                        <input
                          type="text"
                          placeholder="Contoh: Transfer Bank, QRIS, etc"
                          value={paymentForm[`payment_${order.id}`]?.payment_method || ""}
                          onChange={(e) => setPaymentForm({
                            ...paymentForm,
                            [`payment_${order.id}`]: {
                              ...paymentForm[`payment_${order.id}`],
                              payment_method: e.target.value,
                            },
                          })}
                          style={styles.input}
                        />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>URL Bukti Pembayaran</label>
                        <input
                          type="text"
                          placeholder="Contoh: https://imgur.com/xxx"
                          value={paymentForm[`payment_${order.id}`]?.proof_url || ""}
                          onChange={(e) => setPaymentForm({
                            ...paymentForm,
                            [`payment_${order.id}`]: {
                              ...paymentForm[`payment_${order.id}`],
                              proof_url: e.target.value,
                            },
                          })}
                          style={styles.input}
                        />
                      </div>
                      <button
                        style={styles.primaryButton}
                        onClick={() => handleCreatePayment(order.id, order)}
                      >
                        💳 Buat Pembayaran
                      </button>
                    </div>
                  )}

                  {/* Step 3: Complete Payment (Admin marked as completed) */}
                  {order.payments?.some(p => p.payment_status === "completed") && order.status !== "delivered" && (
                    <button
                      style={styles.secondaryButton}
                      onClick={() => handleCompletePayment(order.id)}
                    >
                      ✓ Pembayaran Selesai - Tandai Tiba
                    </button>
                  )}

                  {/* Step 4: Testimonial (Order delivered + payment completed) */}
                  {order.status === "delivered" && order.payments?.some(p => p.payment_status === "completed") && (
                    <div style={styles.testimonialFormSection}>
                      <h4 style={styles.infoLabel}>Berikan Testimonial</h4>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Rating</label>
                        <select
                          value={testimonialForm[`testimonial_${order.id}`]?.rating || ""}
                          onChange={(e) => setTestimonialForm({
                            ...testimonialForm,
                            [`testimonial_${order.id}`]: {
                              ...testimonialForm[`testimonial_${order.id}`],
                              rating: e.target.value,
                            },
                          })}
                          style={styles.input}
                        >
                          <option value="">-- Pilih Rating --</option>
                          <option value="5">⭐⭐⭐⭐⭐ Sangat Puas</option>
                          <option value="4">⭐⭐⭐⭐ Puas</option>
                          <option value="3">⭐⭐⭐ Biasa Saja</option>
                          <option value="2">⭐⭐ Kurang</option>
                          <option value="1">⭐ Sangat Kurang</option>
                        </select>
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>Komentar</label>
                        <textarea
                          placeholder="Bagikan pengalaman Anda..."
                          value={testimonialForm[`testimonial_${order.id}`]?.comment || ""}
                          onChange={(e) => setTestimonialForm({
                            ...testimonialForm,
                            [`testimonial_${order.id}`]: {
                              ...testimonialForm[`testimonial_${order.id}`],
                              comment: e.target.value,
                            },
                          })}
                          style={{ ...styles.input, minHeight: "80px", fontFamily: "inherit" }}
                        />
                      </div>
                      <button
                        style={styles.primaryButton}
                        onClick={() => handleCreateTestimonial(order.id)}
                      >
                        📝 Kirim Testimonial
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
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
  title: {
    fontSize: "2rem",
    color: "#2E1F14",
    marginBottom: "24px",
    textAlign: "center",
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "24px",
    padding: "48px 32px",
    textAlign: "center",
    boxShadow: "0 20px 40px rgba(245, 124, 0, 0.12)",
  },
  emptyText: {
    fontSize: "1.2rem",
    color: "#666",
    marginBottom: "24px",
  },
  ordersList: {
    display: "grid",
    gap: "20px",
  },
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 10px 30px rgba(245, 124, 0, 0.1)",
    borderLeft: "4px solid #F57C00",
  },
  orderHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "16px",
    paddingBottom: "16px",
    borderBottom: "1px solid #EEE",
  },
  orderTitle: {
    margin: 0,
    fontSize: "1.1rem",
    color: "#2E1F14",
    fontWeight: "600",
  },
  orderMeta: {
    margin: "4px 0 0 0",
    fontSize: "0.9rem",
    color: "#999",
  },
  orderInfo: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "20px",
    marginBottom: "16px",
  },
  infoSection: {
    padding: "12px 0",
  },
  infoLabel: {
    margin: "0 0 8px 0",
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  infoValue: {
    margin: "4px 0",
    fontSize: "1rem",
    color: "#2E1F14",
    fontWeight: "500",
  },
  infoMeta: {
    margin: "2px 0",
    fontSize: "0.9rem",
    color: "#666",
  },
  totalAmount: {
    margin: "8px 0 0 0",
    fontSize: "1.4rem",
    fontWeight: "700",
    color: "#F57C00",
  },
  itemsSection: {
    backgroundColor: "#FAFAFA",
    borderRadius: "12px",
    padding: "12px",
    marginBottom: "16px",
  },
  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: "1px solid #EEE",
  },
  itemRow_last: {
    borderBottom: "none",
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    margin: "0 0 4px 0",
    fontSize: "0.95rem",
    fontWeight: "500",
    color: "#2E1F14",
  },
  itemMeta: {
    margin: 0,
    fontSize: "0.85rem",
    color: "#666",
  },
  itemSubtotal: {
    margin: 0,
    fontSize: "0.95rem",
    fontWeight: "600",
    color: "#F57C00",
    textAlign: "right",
  },
  paymentSection: {
    backgroundColor: "#F0F7FF",
    borderRadius: "12px",
    padding: "12px",
    marginBottom: "16px",
  },
  paymentRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
  },
  paymentMethod: {
    margin: "0 0 4px 0",
    fontSize: "0.95rem",
    fontWeight: "500",
    color: "#2E1F14",
  },
  paymentMeta: {
    margin: 0,
    fontSize: "0.85rem",
    color: "#666",
  },
  noData: {
    margin: 0,
    fontSize: "0.9rem",
    color: "#999",
    fontStyle: "italic",
  },
  actionsSection: {
    marginTop: "16px",
    paddingTop: "16px",
    borderTop: "1px solid #EEE",
  },
  button: {
    backgroundColor: "#F57C00",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "12px",
    padding: "12px 24px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  primaryButton: {
    backgroundColor: "#F57C00",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "12px",
    padding: "12px 20px",
    fontSize: "0.95rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginRight: "8px",
    marginBottom: "8px",
  },
  secondaryButton: {
    backgroundColor: "#4CAF50",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "12px",
    padding: "12px 20px",
    fontSize: "0.95rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginRight: "8px",
    marginBottom: "8px",
  },
  paymentFormSection: {
    backgroundColor: "#FFF9F5",
    borderRadius: "12px",
    padding: "16px",
    marginTop: "12px",
    border: "1px solid #FFE0CC",
  },
  testimonialFormSection: {
    backgroundColor: "#F3E5F5",
    borderRadius: "12px",
    padding: "16px",
    marginTop: "12px",
    border: "1px solid #E1BEE7",
  },
  formGroup: {
    marginBottom: "12px",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#2E1F14",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #DDD",
    borderRadius: "8px",
    fontSize: "0.95rem",
    fontFamily: "inherit",
    boxSizing: "border-box",
    transition: "border-color 0.3s ease",
  },
}
