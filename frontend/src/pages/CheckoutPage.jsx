import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Header from "../components/Header"
import { createOrder } from "../services/api"
import { toast } from "react-toastify"

export default function CheckoutPage({ user, onLogout }) {
  const location = useLocation()
  const navigate = useNavigate()

  const selectedItems = location.state?.selectedItems || []

  const [formData, setFormData] = useState({
    receipt_name: user?.name || "",
    recipient_phone: user?.phone || "",
    shipping_address: user?.address || "",
    notes: "",
    shipping_method: "pickup",
  })

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

    try {
      const orderData = {
        ...formData,
        items: selectedItems.map((item) => ({
          product_id: item.product_id || item.id,
          quantity: item.quantity,
        })),
      }

      toast.loading("Memproses pesanan...", {
        id: "checkout",
      })

      const result = await createOrder(orderData)

      toast.success("Pesanan berhasil dibuat!", {
        id: "checkout",
      })

      setTimeout(() => {
        navigate("/orders", {
          state: {
            orderId: result?.id,
          },
        })
      }, 1000)
    } catch (err) {
      console.error(err)

      toast.error(
        err?.message ||
          err?.detail ||
          "Gagal membuat pesanan",
        {
          id: "checkout",
        }
      )
    }
  }

  return (
    <div style={styles.page}>
      <Header user={user} onLogout={onLogout} />

      <main style={styles.main}>
        <form onSubmit={handleSubmit} style={styles.form}>

          {/* CUSTOMER INFO */}
          <section style={styles.customerInfoSection}>
            <h2 style={styles.sectionTitle}>
              Informasi Penerima
            </h2>

            <div style={styles.divider}></div>

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
            style={styles.submitBtn}
          >
            Lanjut ke Pembayaran
          </button>
        </form>
      </main>
    </div>
  )
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "var(--bg-page)",
    paddingBottom: "80px",
    backgroundColor: "#f6efe6",
    paddingBottom: "40px",
  },

  main: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "40px 24px",
  },
  title: {
    fontSize: "2rem",
    color: "var(--text-primary)",
    marginBottom: "32px",
    fontWeight: 800,
  },
  container: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1fr",
    gap: "32px",
    alignItems: "start",
  },
  formSection: {
    backgroundColor: "var(--surface)",
    padding: "32px",
    borderRadius: "24px",
    border: "1px solid var(--border-card)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
  },
  sectionTitle: {
    fontSize: "1.3rem",
    margin: "0 0 20px 0",
    color: "var(--text-primary)",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    color: "var(--text-muted)",
    fontWeight: 600,
    fontSize: "0.9rem",
  },
  input: {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid var(--border-input)",
    fontSize: "1rem",
    backgroundColor: "var(--surface-input)",
    color: "var(--text-dark)",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    minHeight: "100px",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid var(--border-input)",
    fontSize: "1rem",
    backgroundColor: "var(--surface-input)",
    color: "var(--text-dark)",
    resize: "vertical",
    boxSizing: "border-box",
  },
  summarySection: {
    position: "sticky",
    top: "100px",
  },
  summaryCard: {
    backgroundColor: "var(--surface)",
    padding: "24px",
    borderRadius: "24px",
    border: "1px solid #F57C00",
    boxShadow: "0 15px 40px rgba(245, 124, 0, 0.08)",
    width: "100%",
    padding: "24px",
    boxSizing: "border-box",
    border: "1px solid var(--brand)",
    boxShadow: "var(--summary-shadow)",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    maxWidth: "600px",
    margin: "0 auto",
  },
  itemRow: { 
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.95rem",
    color: "#70503C",
  },

  /* STORE HEADER */
  storeBox: {
    backgroundColor: "#ffffff",
    padding: "26px",
    borderRadius: "10px",
    border: "1px solid #f0d4b5",
  },

  storeTitle: {
    margin: 0,
    fontSize: "2rem",
    fontWeight: "800",
    color: "#f58600",
    letterSpacing: "1px",
  },

  /* INFO BOX */
  infoBox: {
    backgroundColor: "#ffffff",
    padding: "22px 26px",
    borderRadius: "10px",
    border: "1px solid #f0d4b5",
  },

  infoText: {
    margin: "5px 0",
    color: "#4a3425",
    fontSize: "1rem",
    lineHeight: "1.5",
    color: "var(--text-secondary)",
  },

  /* SUMMARY */
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
    backgroundColor: "var(--divider)",
    margin: "0 0 16px 0",
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
  totalPrice: {
    fontSize: "1.4rem",
    fontWeight: 800,
    color: "#F57C00",
    fontWeight: "700",
    color: "#2b1a11",
    paddingTop: "6px",
  },

  /* CUSTOMER INFO */
  customerInfoSection: {
    backgroundColor: "#ffffff",
    padding: "18px",
    borderRadius: "10px",
    border: "1px solid #f0d4b5",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "16px",
    color: "var(--brand)",
  },

  inputLabel: {
    fontSize: "1rem",
    color: "#6a4d3a",
    fontWeight: "600",
  },

  inputField: {
    padding: "12px",
    border: "1px solid #e2c5a7",
    borderRadius: "8px",
    fontSize: "1rem",
    backgroundColor: "#fefefe",
    outline: "none",
  },

  textareaField: {
    padding: "12px",
    border: "1px solid #e2c5a7",
    borderRadius: "8px",
    fontSize: "1rem",
    backgroundColor: "#fefefe",
    outline: "none",
    minHeight: "80px",
    resize: "vertical",
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

  /* SHIPPING */
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

  /* BUTTON */
  submitBtn: {
    width: "100%",
    padding: "16px",
    backgroundColor: "var(--brand)",
    color: "white",
    height: "52px",
    border: "none",
    borderRadius: "10px",
    backgroundColor: "#f58600",
    color: "#ffffff",
    fontSize: "1rem",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 8px 16px rgba(245,124,0,0.25)",
  },

  hiddenFields: {
    display: "none",
  },
}