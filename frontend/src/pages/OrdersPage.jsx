import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import Header from "../components/Header"
import { fetchMyOrders, getOrderItems, createPayment, getPaymentsByOrder, createTestimonial, uploadImage } from "../services/api"
import { toast } from "react-toastify"

export default function OrdersPage({ user, onLogout }) {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [paymentForm, setPaymentForm] = useState({})
  const [testimonialForm, setTestimonialForm] = useState({})
  const [submittingPayment, setSubmittingPayment] = useState({})
  const [submittingTestimonial, setSubmittingTestimonial] = useState({})

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async ({ showLoading = true } = {}) => {
    try {
      if (showLoading) setLoading(true)
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
      if (showLoading) setLoading(false)
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

  const bankAccounts = [
    { bank: "BNI", account: "121-234-5678", owner: "Nadia Omara" },
    { bank: "BCA", account: "987-654-3210", owner: "Nadia Omara" },
    { bank: "BRI", account: "112-233-4455", owner: "Nadia Omara" },
    { bank: "Mandiri", account: "556-677-8899", owner: "Nadia Omara" },
  ]

  const qrisImageSrc = "/qris-kode.png"

  const getPaymentFormData = (orderId) => paymentForm[`payment_${orderId}`] || {}

  const setPaymentFormData = (orderId, nextData) => {
    setPaymentForm({
      ...paymentForm,
      [`payment_${orderId}`]: {
        ...(paymentForm[`payment_${orderId}`] || {}),
        ...nextData,
      },
    })
  }

  const handleSelectPaymentMethod = (orderId, paymentMethod) => {
    setPaymentFormData(orderId, {
      payment_method: paymentMethod,
      proof_file: null,
      proof_preview: "",
      selected_bank: paymentMethod === "bank_transfer" ? "BNI" : "",
    })
  }

  const handleProofFileChange = (orderId, file) => {
    setPaymentFormData(orderId, {
      proof_file: file,
      proof_preview: file ? URL.createObjectURL(file) : "",
    })
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { bg: "#FFF4E6", color: "#F57C00", text: "Menunggu Konfirmasi" },
      processing: { bg: "#E3F2FD", color: "#1976D2", text: "Diproses" },
      shipped: { bg: "#E8F5E9", color: "#388E3C", text: "Dikirim" },
      delivered: { bg: "#F3E5F5", color: "#7B1FA2", text: "Tiba" },
      cancelled: { bg: "#FFEBEE", color: "#C62828", text: "Dibatalkan" },
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

  const handleCreatePayment = async (orderId, order) => {
    if (submittingPayment[orderId]) return

    const data = getPaymentFormData(orderId)

    if (!data.payment_method) {
      toast.error("Pilih metode pembayaran", { id: `payment_${orderId}` })
      return
    }

    if ((data.payment_method === "qris" || data.payment_method === "bank_transfer") && !data.proof_file) {
      toast.error("Upload bukti pembayaran untuk metode ini", { id: `payment_${orderId}` })
      return
    }

    if (data.payment_method === "bank_transfer" && !data.selected_bank) {
      toast.error("Pilih rekening tujuan untuk transfer", { id: `payment_${orderId}` })
      return
    }

    const toastId = `payment_${orderId}`
    setSubmittingPayment((prev) => ({ ...prev, [orderId]: true }))

    try {
      toast.loading("Memproses pembayaran...", { id: toastId, autoClose: false })
      let proof_url = data.proof_url || null

      if ((data.payment_method === "qris" || data.payment_method === "bank_transfer") && data.proof_file) {
        const uploadResult = await uploadImage(data.proof_file)
        proof_url = uploadResult?.url || uploadResult?.path || proof_url
      }

      const apiPaymentMethod =
        data.payment_method === "qris"
          ? "e_wallet"
          : data.payment_method

      const paymentData = {
        order_id: orderId,
        payment_method: apiPaymentMethod,
        amount: order.total_amount,
        proof_url: proof_url || undefined,
      }

      await createPayment(paymentData)
      toast.update(toastId, {
        render: "Pembayaran berhasil dilakukan!",
        type: "success",
        isLoading: false,
        autoClose: 2,
      })
      setPaymentForm({ ...paymentForm, [`payment_${orderId}`]: {} })
      await loadOrders({ showLoading: false })
    } catch (err) {
      toast.update(toastId, {
        render: err?.message || "Gagal membuat pembayaran",
        type: "error",
        isLoading: false,
        autoClose: 3,
      })
    } finally {
      setSubmittingPayment((prev) => ({ ...prev, [orderId]: false }))
    }
  }

  const handleCreateTestimonial = async (orderId) => {
    if (submittingTestimonial[orderId]) return

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

    const toastId = `testimonial_${orderId}`
    setSubmittingTestimonial((prev) => ({ ...prev, [orderId]: true }))

    try {
      toast.loading("Mengirim testimoni...", { id: toastId, autoClose: false })
      const testimonialData = {
        order_id: orderId,
        rating: parseInt(data.rating),
        comment: data.comment,
        is_visible: true,
      }
      await createTestimonial(testimonialData)
      toast.update(toastId, {
        render: "Testimoni berhasil ditambahkan!",
        type: "success",
        isLoading: false,
        autoClose: 2,
      })
      setTestimonialForm({ ...testimonialForm, [formDataKey]: {} })
      await loadOrders({ showLoading: false })
    } catch (err) {
      toast.update(toastId, {
        render: err?.message || "Gagal mengirim testimonial",
        type: "error",
        isLoading: false,
        autoClose: 3,
      })
    } finally {
      setSubmittingTestimonial((prev) => ({ ...prev, [orderId]: false }))
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
  
  // Show all order history entries
  const activeOrders = orders
  // Filter: show active orders plus delivered and cancelled history orders
  const visibleOrders = orders.filter(order =>
    ["pending", "processing", "shipped", "delivered", "cancelled"].includes(order.status)
  )

  return (
    <div style={styles.page}>
      <Header user={user} onLogout={handleLogout} />
      <main style={styles.main}>
        <h1 style={styles.title}>Pesanan Saya</h1>

        {orders.length === 0 ? (
          <section style={styles.emptyCard}>
            <p style={styles.emptyText}>Belum ada pesanan</p>
            <button style={styles.button} onClick={() => navigate("/shop") }>
              Belanja Sekarang
            </button>
          </section>
        ) : (
          <>
            {visibleOrders.length === 0 ? (
              <section style={styles.emptyCard}>
                <p style={styles.emptyText}>Tidak ada pesanan</p>
                <p style={styles.emptyText}>Tidak ada pesanan yang sedang diproses</p>
                <button style={styles.button} onClick={() => navigate("/shop") }>
                  Belanja Sekarang
                </button>
              </section>
            ) : (
              <div style={styles.ordersList}>
                {visibleOrders.map((order) => (
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

                {(order.status === "pending" || order.status === "processing") && (!order.payments || order.payments.length === 0) && (
                  <div style={styles.paymentFormSection}>
                    <h4 style={styles.infoLabel}>Pilih Metode Pembayaran</h4>
                    <div style={styles.paymentMethodsGrid}>
                      <div
                        style={{
                          ...styles.paymentMethodCard,
                          ...(getPaymentFormData(order.id).payment_method === "qris" ? styles.paymentMethodCardSelected : {}),
                        }}
                        onClick={() => handleSelectPaymentMethod(order.id, "qris")}
                      >
                        <span style={styles.paymentMethodIcon}>📱</span>
                        <div style={styles.paymentMethodLabel}>QRIS</div>
                        <div style={styles.paymentMethodSubtitle}>Scan QR Code</div>
                      </div>

                      <div
                        style={{
                          ...styles.paymentMethodCard,
                          ...(getPaymentFormData(order.id).payment_method === "bank_transfer" ? styles.paymentMethodCardSelected : {}),
                        }}
                        onClick={() => handleSelectPaymentMethod(order.id, "bank_transfer")}
                      >
                        <span style={styles.paymentMethodIcon}>🏦</span>
                        <div style={styles.paymentMethodLabel}>Transfer Bank</div>
                        <div style={styles.paymentMethodSubtitle}>BNI, BCA, BRI, Mandiri</div>
                      </div>

                      <div
                        style={{
                          ...styles.paymentMethodCard,
                          ...(getPaymentFormData(order.id).payment_method === "cash" ? styles.paymentMethodCardSelected : {}),
                        }}
                        onClick={() => handleSelectPaymentMethod(order.id, "cash")}
                      >
                        <span style={styles.paymentMethodIcon}>💵</span>
                        <div style={styles.paymentMethodLabel}>Cash</div>
                        <div style={styles.paymentMethodSubtitle}>Bayar di tempat</div>
                      </div>
                    </div>

                    {getPaymentFormData(order.id).payment_method === "qris" && (
                      <div style={styles.qrisSection}>
                        <p style={styles.qrisHeadline}>Scan QR Code di bawah ini untuk membayar</p>
                        <div style={styles.qrCard}>
                          <img src={qrisImageSrc} alt="QRIS Pembayaran" style={styles.qrImage} />
                        </div>
                        <p style={styles.qrisAmount}>{formatRupiah(order.total_amount)}</p>
                        <p style={styles.orderCode}>Kode Pesanan ATH-{String(order.id).padStart(10, "0")}</p>

                        <div style={styles.uploadSection}>
                          <label style={styles.uploadLabel}>Unggah Bukti Pembayaran</label>
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/jpg"
                            style={styles.fileInput}
                            onChange={(e) => handleProofFileChange(order.id, e.target.files?.[0] || null)}
                          />
                          <p style={styles.uploadHint}>PNG, JPG, JPEG max 10MB</p>
                          {getPaymentFormData(order.id).proof_file && (
                            <p style={styles.uploadFileName}>{getPaymentFormData(order.id).proof_file.name}</p>
                          )}
                          {getPaymentFormData(order.id).proof_preview && (
                            <img
                              src={getPaymentFormData(order.id).proof_preview}
                              alt="Preview Bukti Pembayaran"
                              style={styles.previewImage}
                            />
                          )}
                        </div>
                      </div>
                    )}

                    {getPaymentFormData(order.id).payment_method === "bank_transfer" && (
                      <div style={styles.bankSection}>
                        <p style={styles.bankHeadline}>Pilih rekening untuk transfer kepada pemilik UMKM</p>
                        {bankAccounts.map((bank) => (
                          <div
                            key={bank.bank}
                            style={{
                              ...styles.bankCard,
                              ...(getPaymentFormData(order.id).selected_bank === bank.bank ? styles.bankCardSelected : {}),
                            }}
                            onClick={() => setPaymentFormData(order.id, { selected_bank: bank.bank })}
                          >
                            <p style={styles.bankName}>{bank.bank}</p>
                            <p style={styles.bankAccount}>{bank.account}</p>
                            <p style={styles.bankOwner}>{bank.owner}</p>
                          </div>
                        ))}

                        <div style={styles.uploadSection}>
                          <label style={styles.uploadLabel}>Unggah bukti transfer</label>
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/jpg"
                            style={styles.fileInput}
                            onChange={(e) => handleProofFileChange(order.id, e.target.files?.[0] || null)}
                          />
                          <p style={styles.uploadHint}>PNG, JPG, JPEG max 10MB</p>
                          {getPaymentFormData(order.id).proof_file && (
                            <p style={styles.uploadFileName}>{getPaymentFormData(order.id).proof_file.name}</p>
                          )}
                          {getPaymentFormData(order.id).proof_preview && (
                            <img
                              src={getPaymentFormData(order.id).proof_preview}
                              alt="Preview Bukti Transfer"
                              style={styles.previewImage}
                            />
                          )}
                        </div>
                      </div>
                    )}

                    {getPaymentFormData(order.id).payment_method === "cash" && (
                      <div style={styles.cashSection}>
                        <p style={styles.cashText}>Pesanan akan dibayar langsung ke kurir saat diterima.</p>
                      </div>
                    )}

                    <button
                      disabled={!!submittingPayment[order.id]}
                      style={{
                        ...styles.primaryButton,
                        marginTop: "16px",
                        opacity: submittingPayment[order.id] ? 0.7 : 1,
                        cursor: submittingPayment[order.id] ? "not-allowed" : "pointer",
                      }}
                      onClick={() => handleCreatePayment(order.id, order)}
                    >
                      {submittingPayment[order.id] ? "Memproses..." : "💳 Buat Pembayaran"}
                    </button>
                  </div>
                )}

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
                  {/* Step 3: Complete Payment (Admin marked as completed) */}
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
                        disabled={!!submittingTestimonial[order.id]}
                        style={{
                          ...styles.primaryButton,
                          opacity: submittingTestimonial[order.id] ? 0.7 : 1,
                          cursor: submittingTestimonial[order.id] ? "not-allowed" : "pointer",
                        }}
                        onClick={() => handleCreateTestimonial(order.id)}
                      >
                        {submittingTestimonial[order.id] ? "Mengirim..." : "📝 Kirim Testimonial"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
              </div>
            )}
          </>
        )}
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
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "24px",
  },
  title: {
    fontSize: "2rem",
    color: "var(--text-primary)",
    marginBottom: "24px",
    textAlign: "center",
  },
  emptyCard: {
    backgroundColor: "var(--surface)",
    borderRadius: "24px",
    padding: "48px 32px",
    textAlign: "center",
    boxShadow: "var(--summary-shadow)",
  },
  emptyText: {
    fontSize: "1.2rem",
    color: "var(--text-secondary)",
    marginBottom: "24px",
  },
  ordersList: {
    display: "grid",
    gap: "20px",
  },
  orderCard: {
    backgroundColor: "var(--surface)",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "var(--card-shadow)",
    borderLeft: "4px solid var(--brand)",
  },
  orderHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "16px",
    paddingBottom: "16px",
    borderBottom: "1px solid var(--border-card)",
  },
  orderTitle: {
    margin: 0,
    fontSize: "1.1rem",
    color: "var(--text-primary)",
    fontWeight: "600",
  },
  orderMeta: {
    margin: "4px 0 0 0",
    fontSize: "0.9rem",
    color: "var(--text-muted)",
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
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  infoValue: {
    margin: "4px 0",
    fontSize: "1rem",
    color: "var(--text-primary)",
    fontWeight: "500",
  },
  infoMeta: {
    margin: "2px 0",
    fontSize: "0.9rem",
    color: "var(--text-muted)",
  },
  totalAmount: {
    margin: "8px 0 0 0",
    fontSize: "1.4rem",
    fontWeight: "700",
    color: "var(--brand)",
  },
  itemsSection: {
    backgroundColor: "var(--surface-subtle)",
    borderRadius: "12px",
    padding: "12px",
    marginBottom: "16px",
  },
  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: "1px solid var(--border-card)",
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
    color: "var(--text-primary)",
  },
  itemMeta: {
    margin: 0,
    fontSize: "0.85rem",
    color: "var(--text-muted)",
  },
  itemSubtotal: {
    margin: 0,
    fontSize: "0.95rem",
    fontWeight: "600",
    color: "var(--brand)",
    textAlign: "right",
  },
  paymentSection: {
    backgroundColor: "var(--surface-subtle)",
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
    color: "var(--text-primary)",
  },
  paymentMeta: {
    margin: 0,
    fontSize: "0.85rem",
    color: "var(--text-muted)",
  },
  noData: {
    margin: 0,
    fontSize: "0.9rem",
    color: "var(--text-muted)",
    fontStyle: "italic",
  },
  actionsSection: {
    marginTop: "16px",
    paddingTop: "16px",
    borderTop: "1px solid var(--border-card)",
  },
  button: {
    backgroundColor: "var(--brand)",
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
    backgroundColor: "var(--brand)",
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
    backgroundColor: "var(--surface-subtle)",
    borderRadius: "12px",
    padding: "16px",
    marginTop: "12px",
    border: "1px solid var(--border-card)",
  },
  testimonialFormSection: {
    backgroundColor: "var(--surface-subtle)",
    borderRadius: "12px",
    padding: "16px",
    marginTop: "12px",
    border: "1px solid var(--border-card)",
  },
  formGroup: {
    marginBottom: "12px",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "var(--text-primary)",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid var(--border-input)",
    borderRadius: "8px",
    fontSize: "0.95rem",
    fontFamily: "inherit",
    boxSizing: "border-box",
    transition: "border-color 0.3s ease",
    backgroundColor: "var(--surface-input)",
    color: "var(--text-dark)",
  },
  paymentMethodsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "12px",
    marginBottom: "18px",
  },
  paymentMethodCard: {
    borderRadius: "16px",
    border: "1px solid #E6D7C2",
    backgroundColor: "#FFF8F2",
    padding: "18px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.2s ease",
    minHeight: "130px",
  },
  paymentMethodCardSelected: {
    borderColor: "#F57C00",
    boxShadow: "0 12px 24px rgba(245, 124, 0, 0.18)",
    backgroundColor: "#FFF3E0",
  },
  paymentMethodIcon: {
    fontSize: "1.6rem",
  },
  paymentMethodLabel: {
    fontSize: "1rem",
    fontWeight: "700",
    color: "#2B1A11",
  },
  paymentMethodSubtitle: {
    fontSize: "0.85rem",
    color: "#6A4D3A",
    textAlign: "center",
  },
  qrisSection: {
    marginTop: "18px",
    padding: "18px",
    borderRadius: "16px",
    backgroundColor: "#FFFFFF",
    border: "1px solid #E6D7C2",
  },
  qrisHeadline: {
    margin: 0,
    marginBottom: "16px",
    fontWeight: "700",
    color: "#2B1A11",
  },
  qrCard: {
    height: "200px",
    borderRadius: "18px",
    border: "1px dashed #D8BFAA",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9F2E8",
    marginBottom: "14px",
  },
  qrImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    borderRadius: "16px",
  },
  previewImage: {
    width: "100%",
    maxWidth: "260px",
    marginTop: "12px",
    borderRadius: "12px",
    objectFit: "contain",
    border: "1px solid #E6D7C2",
  },
  qrPlaceholder: {
    fontSize: "1.2rem",
    fontWeight: "700",
    color: "#A77A47",
  },
  qrisAmount: {
    margin: 0,
    fontSize: "1.2rem",
    fontWeight: "700",
    color: "#F57C00",
    textAlign: "center",
  },
  orderCode: {
    margin: "6px 0 0 0",
    fontSize: "0.9rem",
    color: "#A17A50",
    textAlign: "center",
  },
  uploadSection: {
    marginTop: "18px",
  },
  uploadLabel: {
    display: "block",
    marginBottom: "8px",
    fontSize: "0.9rem",
    fontWeight: "700",
    color: "#2B1A11",
  },
  fileInput: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #E6D7C2",
    borderRadius: "12px",
    fontSize: "0.95rem",
    backgroundColor: "#FFFFFF",
    cursor: "pointer",
  },
  uploadHint: {
    marginTop: "8px",
    fontSize: "0.85rem",
    color: "#6A4D3A",
  },
  uploadFileName: {
    marginTop: "8px",
    fontSize: "0.9rem",
    color: "#2B1A11",
    fontWeight: "600",
  },
  bankSection: {
    marginTop: "18px",
  },
  bankHeadline: {
    margin: 0,
    marginBottom: "14px",
    fontWeight: "700",
    color: "#2B1A11",
  },
  bankCard: {
    borderRadius: "14px",
    border: "1px solid #E6D7C2",
    backgroundColor: "#FFF8F2",
    padding: "16px",
    marginBottom: "12px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  bankCardSelected: {
    borderColor: "#F57C00",
    backgroundColor: "#FFF2E0",
  },
  bankName: {
    margin: 0,
    fontSize: "1rem",
    fontWeight: "700",
    color: "#2B1A11",
  },
  bankAccount: {
    margin: "6px 0 0 0",
    fontSize: "0.95rem",
    color: "#6A4D3A",
  },
  bankOwner: {
    margin: "4px 0 0 0",
    fontSize: "0.9rem",
    color: "#6A4D3A",
  },
  cashSection: {
    marginTop: "18px",
    padding: "18px",
    borderRadius: "16px",
    backgroundColor: "#FFF8F2",
    border: "1px solid #E6D7C2",
  },
  cashText: {
    margin: 0,
    fontSize: "0.95rem",
    color: "#2B1A11",
    lineHeight: 1.6,
  },
}
