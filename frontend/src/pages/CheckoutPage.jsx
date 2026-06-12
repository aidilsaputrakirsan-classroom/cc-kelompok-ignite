import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Header from "../components/Header"
import { createOrder } from "../services/api"
import { toast } from "react-toastify"

export default function CheckoutPage({ user, onLogout }) {
  const location = useLocation()
  const navigate = useNavigate()
  const selectedItems = location.state?.selectedItems || []
  const [backBtnHovered, setBackBtnHovered] = useState(false)
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate("/cart")
    }
  }

  const [formData, setFormData] = useState({
    receipt_name: user?.name || "",
    recipient_phone: user?.phone || "",
    shipping_address: user?.address || "",
    notes: "",
    shipping_method: "pickup",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (selectedItems.length === 0) {
      toast.warn("Tidak ada produk untuk di-checkout")
      navigate("/cart")
    }
  }, [selectedItems, navigate])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const formatRupiah = (num) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num)
  }

  const calculateTotal = () => {
    return selectedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (isSubmitting) return

    if (!formData.receipt_name.trim()) {
      toast.error("Nama penerima harus diisi", {
        id: "checkout",
      })
      return
    }

    if (!formData.recipient_phone.trim()) {
      toast.error("Nomor telepon harus diisi", {
        id: "checkout",
      })
      return
    }

    if (!formData.shipping_address.trim()) {
      toast.error("Alamat pengiriman harus diisi", {
        id: "checkout",
      })
      return
    }

    if (selectedItems.length === 0) {
      toast.error("Tidak ada produk untuk dipesan", {
        id: "checkout",
      })
      return
    }

    const toastId = toast.loading("Memproses pesanan...")
    setIsSubmitting(true)

    try {
      const orderData = {
        ...formData,
        items: selectedItems.map((item) => ({
          product_id: item.product_id || item.id,
          quantity: item.quantity,
        })),
      }

      const result = await createOrder(orderData)

      toast.dismiss(toastId)
      toast.success("Pesanan berhasil dibuat! Mengarahkan ke halaman pesanan...", {
        autoClose: 2000,
      })

      setTimeout(() => {
        navigate("/orders", {
          state: { orderId: result?.id },
        })
      }, 2000)
    } catch (err) {
      console.error(err)
      toast.dismiss(toastId)
      toast.error(err?.message || err?.detail || "Gagal membuat pesanan. Silakan coba lagi.", {
        autoClose: 3000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div style={styles.page}>
      <Header user={user} onLogout={onLogout} />
      <main style={styles.main} className="checkout-main">
        {/* ===== OUTER LAYOUT: Back Button + Form sejajar ===== */}
        <div style={styles.outerLayout} className="checkout-outer-layout">

          {/* KOLOM KIRI — Tombol Kembali */}
          <div style={styles.backColumn} className="checkout-back-col">
            <button
              type="button"
              id="checkout-back-btn"
              onClick={handleBack}
              style={{
                ...styles.backBtn,
                ...(backBtnHovered ? styles.backBtnHover : {}),
              }}
              onMouseEnter={() => setBackBtnHovered(true)}
              onMouseLeave={() => setBackBtnHovered(false)}
              title="Kembali ke halaman sebelumnya"
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span>Kembali</span>
            </button>
          </div>

          {/* KOLOM KANAN — Form Checkout */}
          <form onSubmit={handleSubmit} style={styles.form}>

          {/* CUSTOMER INFO */}
          <section style={styles.customerInfoSection}>
            <h2 style={styles.sectionTitle}>
              Informasi Penerima
            </h2>

            <div style={styles.divider}></div>

            <div style={styles.dualInputRow}>
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Nama Penerima</label>
                <input
                  type="text"
                  name="receipt_name"
                  value={formData.receipt_name}
                  onChange={handleChange}
                  placeholder="Masukkan nama penerima"
                  style={styles.inputField}
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Nomor Telepon</label>
                <input
                  type="tel"
                  name="recipient_phone"
                  value={formData.recipient_phone}
                  onChange={handleChange}
                  placeholder="Masukkan nomor telepon"
                  style={styles.inputField}
                  required
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.inputLabel}>Alamat Pengiriman</label>
              <textarea
                name="shipping_address"
                value={formData.shipping_address}
                onChange={handleChange}
                placeholder="Masukkan alamat lengkap"
                style={styles.textareaField}
                required
              />
            </div>
          </section>

          {/* RINGKASAN */}
          <section style={styles.summaryBox}>
            <h2 style={styles.sectionTitle}>
              Ringkasan Pesanan
            </h2>

            <div style={styles.divider}></div>

            {selectedItems.map((item, idx) => (
              <div
                key={idx}
                style={styles.itemRow}
              >
                <span>{item.name}</span>

                <span style={styles.qty}>
                  x {item.quantity}
                </span>

                <span style={styles.price}>
                  {formatRupiah(
                    item.price * item.quantity
                  )}
                </span>
              </div>
            ))}

            <div style={styles.divider}></div>

            <div style={styles.totalRow}>
              <span>Total</span>

              <span>
                {formatRupiah(
                  calculateTotal()
                )}
              </span>
            </div>
          </section>

          {/* NOTES */}
          <section style={styles.notesSection}>
            <label style={styles.notesLabel}>
              Catatan Pesanan (Opsional)
            </label>

            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Contoh : Plastiknya tolong dipisah setiap produk ya!"
              style={styles.notesTextarea}
            />
          </section>

          {/* SHIPPING */}
          <section style={styles.shippingSection}>
            <h2 style={styles.sectionTitle}>
              Opsi Pengiriman
            </h2>

            <div style={styles.divider}></div>

            <div style={styles.shippingGrid}>

              {/* PICKUP */}
              <div
                onClick={() =>
                  setFormData({
                    ...formData,
                    shipping_method: "pickup",
                  })
                }
                style={{
                  ...styles.shippingCard,
                  ...(formData.shipping_method === "pickup" ? styles.shippingCardSelected : {}),
                }}
              >
                <div style={styles.shippingIcon}>🏪</div>
                <div style={styles.shippingTitle}>Ambil ke Store</div>
                <div style={styles.shippingDesc}>Gratis - Ambil di toko</div>
              </div>

              {/* DELIVERY */}
              <div
                onClick={() =>
                  setFormData({
                    ...formData,
                    shipping_method: "delivery",
                  })
                }
                style={{
                  ...styles.shippingCard,
                  ...(formData.shipping_method === "delivery" ? styles.shippingCardSelected : {}),
                }}
              >
                <div style={styles.shippingIcon}>🚚</div>
                <div style={styles.shippingTitle}>Diantar</div>
                <div style={styles.shippingDesc}>Biaya sesuai jarak</div>
              </div>
            </div>
          </section>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              ...styles.submitBtn,
              opacity: isSubmitting ? 0.7 : 1,
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
          >
            {isSubmitting ? "Memproses..." : "Lanjut ke Pembayaran"}
          </button>
          </form>
        </div>{/* end outerLayout */}
      </main>
    </div>
  )
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f6efe6",
    paddingBottom: "40px",
  },

  main: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "40px 24px",
  },

  outerLayout: {
    display: "grid",
    gridTemplateColumns: "140px 1fr",
    gap: "24px",
    alignItems: "start",
  },

  backColumn: {
    position: "sticky",
    top: "24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },

  backBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "10px 16px",
    borderRadius: "14px",
    border: "1.5px solid #f0d4b5",
    backgroundColor: "#ffffff",
    color: "#c06000",
    fontWeight: 700,
    fontSize: "0.92rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontFamily: "Inter, system-ui, sans-serif",
    whiteSpace: "nowrap",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },

  backBtnHover: {
    backgroundColor: "#fff4e6",
    borderColor: "#f58600",
    color: "#f58600",
    boxShadow: "0 4px 14px rgba(245,134,0,0.18)",
    transform: "translateX(-2px)",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    maxWidth: "600px",
    margin: "0 auto",
  },

  summaryBox: {
    backgroundColor: "#ffffff",
    padding: "18px",
    borderRadius: "10px",
    border: "1px solid #f0d4b5",
  },

  sectionTitle: {
    margin: 0,
    marginBottom: "10px",
    fontSize: "1.3rem",
    fontWeight: "700",
    color: "#2d1c11",
  },

  divider: {
    width: "100%",
    height: "1px",
    backgroundColor: "#e2c5a7",
    margin: "10px 0",
  },

  itemRow: {
    display: "grid",
    gridTemplateColumns: "1fr 80px 160px",
    alignItems: "center",
    padding: "8px 0",
    gap: "10px",
    color: "#4b3526",
    fontSize: "1rem",
  },

  qty: {
    textAlign: "center",
  },

  price: {
    textAlign: "right",
    fontWeight: "600",
  },

  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "var(--text-primary)",
  },

  customerInfoSection: {
    backgroundColor: "#ffffff",
    padding: "22px",
    borderRadius: "16px",
    border: "1px solid #f0d4b5",
    display: "grid",
    gap: "20px",
  },

  dualInputRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "18px",
    width: "100%",
  },

  inputGroup: {
    marginBottom: "20px",
  },

  inputLabel: {
    display: "block",
    marginBottom: "8px",
    fontSize: "0.95rem",
    color: "#6a4d3a",
    fontWeight: "600",
  },

  inputField: {
    width: "100%",
    padding: "14px 16px",
    border: "1px solid #e2c5a7",
    borderRadius: "12px",
    fontSize: "1rem",
    backgroundColor: "#fefefe",
    color: "#3f2d1f",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  },

  textareaField: {
    width: "100%",
    padding: "14px 16px",
    border: "1px solid #e2c5a7",
    borderRadius: "12px",
    fontSize: "1rem",
    backgroundColor: "#fefefe",
    color: "#3f2d1f",
    outline: "none",
    minHeight: "140px",
    resize: "vertical",
    boxSizing: "border-box",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  },

  notesSection: {
    backgroundColor: "#ffffff",
    padding: "18px",
    borderRadius: "10px",
    border: "1px solid #f0d4b5",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  notesLabel: {
    display: "block",
    marginBottom: "8px",
    fontSize: "0.95rem",
    color: "#6a4d3a",
    fontWeight: "600",
  },

  notesTextarea: {
    width: "100%",
    minHeight: "60px",
    border: "1px solid #f0d4b5",
    backgroundColor: "#ffffff",
    padding: "16px",
    resize: "none",
    fontSize: "1rem",
    borderRadius: "10px",
    boxSizing: "border-box",
    outline: "none",
    color: "#4a3425",
  },

  shippingSection: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  shippingGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "18px",
  },

  shippingCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    borderRadius: "12px",
    border: "2px solid #f0d4b5",
    backgroundColor: "#fefefe",
    cursor: "pointer",
    transition: "all 0.3s ease",
    textAlign: "center",
  },

  shippingCardSelected: {
    border: "2px solid #f58600",
    backgroundColor: "#fff8f0",
    boxShadow: "0 4px 12px rgba(245, 134, 0, 0.2)",
  },

  shippingIcon: {
    fontSize: "2rem",
    marginBottom: "8px",
  },

  shippingTitle: {
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#2d1c11",
    marginBottom: "4px",
  },

  shippingDesc: {
    fontSize: "0.9rem",
    color: "#6a4d3a",
  },

  submitBtn: {
    width: "100%",
    padding: "16px",
    backgroundColor: "#f58600",
    color: "#ffffff",
    height: "52px",
    border: "none",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 8px 16px rgba(245,124,0,0.25)",
  },

  hiddenFields: {
    display: "none",
  },
}

/* ===== RESPONSIVE: di mobile tombol Kembali pindah ke atas form ===== */
if (!document.getElementById("checkout-back-responsive")) {
  const s = document.createElement("style")
  s.id = "checkout-back-responsive"
  s.innerHTML = `
    @media (max-width: 640px) {
      /* Ubah grid jadi 1 kolom (tombol di atas, form di bawah) */
      .checkout-outer-layout {
        grid-template-columns: 1fr !important;
        gap: 12px !important;
      }
      /* Tombol tidak perlu sticky di mobile */
      .checkout-back-col {
        position: static !important;
      }
      /* Kurangi padding main di mobile */
      .checkout-main {
        padding: 20px 16px !important;
      }
    }
  `
  document.head.appendChild(s)
}