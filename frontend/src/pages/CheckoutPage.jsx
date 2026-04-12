import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Header from "../components/Header"
import { createOrder, API_URL } from "../services/api"
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
  })

  useEffect(() => {
    if (selectedItems.length === 0) {
      toast.warn("Tidak ada produk untuk di-checkout")
      navigate("/cart")
    }
  }, [selectedItems, navigate])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const formatRupiah = (num) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num)
  }

  const calculateTotal = () => {
    return selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validasi form data
    if (!formData.receipt_name.trim()) {
      toast.error("Nama penerima harus diisi", { id: "checkout" })
      return
    }
    if (!formData.recipient_phone.trim()) {
      toast.error("Nomor telepon harus diisi", { id: "checkout" })
      return
    }
    if (!formData.shipping_address.trim()) {
      toast.error("Alamat pengiriman harus diisi", { id: "checkout" })
      return
    }
    if (selectedItems.length === 0) {
      toast.error("Tidak ada produk untuk dipesan", { id: "checkout" })
      return
    }

    try {
      const orderData = {
        ...formData,
        items: selectedItems.map(item => ({
          product_id: item.product_id || item.id,
          quantity: item.quantity
        }))
      }

      console.log("Submitting order:", orderData)
      toast.loading("Memproses pesanan...", { id: "checkout" })

      // Submit order ke backend
      const result = await createOrder(orderData)
      console.log("Order created successfully:", result)

      toast.success("Pesanan berhasil dibuat!", { id: "checkout" })

      // Redirect ke orders page untuk lihat detail pesanan
      setTimeout(() => {
        navigate("/orders", { state: { orderId: result?.id } })
      }, 1000)
    } catch (err) {
      console.error("Checkout error:", err)
      const errorMsg = err?.message || err?.detail || "Gagal membuat pesanan"
      toast.error(errorMsg, { id: "checkout" })
    }
  }

  return (
    <div style={styles.page}>
      <Header user={user} onLogout={onLogout} />
      <main style={styles.main}>
        <h1 style={styles.title}>Konfirmasi Pesanan</h1>

        <div style={styles.container}>
          <form onSubmit={handleSubmit} style={styles.formSection}>
            <h2 style={styles.sectionTitle}>Informasi Pengiriman</h2>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Nama Penerima</label>
              <input
                name="receipt_name"
                value={formData.receipt_name}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="Nama Lengkap"
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Nomor Telepon</label>
              <input
                name="recipient_phone"
                value={formData.recipient_phone}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="Contoh: 08123456789"
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Alamat Lengkap</label>
              <textarea
                name="shipping_address"
                value={formData.shipping_address}
                onChange={handleChange}
                required
                style={styles.textarea}
                placeholder="Alamat Pengiriman..."
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Catatan (Opsional)</label>
              <input
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                style={styles.input}
                placeholder="Contoh: Titip di satpam"
              />
            </div>
          </form>

          <aside style={styles.summarySection}>
            <div style={styles.summaryCard}>
              <h2 style={styles.sectionTitle}>Ringkasan</h2>
              <div style={styles.itemList}>
                {selectedItems.map((item, idx) => (
                  <div key={idx} style={styles.itemRow}>
                    <span>{item.name} x {item.quantity}</span>
                    <span>{formatRupiah(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div style={styles.divider}></div>
              <div style={styles.totalRow}>
                <span style={styles.totalLabel}>Total Bayar</span>
                <span style={styles.totalPrice}>{formatRupiah(calculateTotal())}</span>
              </div>
              <button onClick={handleSubmit} style={styles.submitBtn}>
                Konfirmasi & Pesan
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#FFF4E6",
    paddingBottom: "80px",
  },
  main: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "40px 24px",
  },
  title: {
    fontSize: "2rem",
    color: "#2E1F14",
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
    backgroundColor: "#FFFFFF",
    padding: "32px",
    borderRadius: "24px",
    border: "1px solid #F3D2B3",
    boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
  },
  sectionTitle: {
    fontSize: "1.3rem",
    margin: "0 0 20px 0",
    color: "#2E1F14",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    color: "#8A5D3B",
    fontWeight: 600,
    fontSize: "0.9rem",
  },
  input: {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #E0E0E0",
    fontSize: "1rem",
    backgroundColor: "#FAFAFA",
  },
  textarea: {
    width: "100%",
    minHeight: "100px",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #E0E0E0",
    fontSize: "1rem",
    backgroundColor: "#FAFAFA",
    resize: "vertical",
  },
  summarySection: {
    position: "sticky",
    top: "100px",
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    padding: "24px",
    borderRadius: "24px",
    border: "1px solid #F57C00",
    boxShadow: "0 15px 40px rgba(245, 124, 0, 0.08)",
  },
  itemList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "20px",
  },
  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.95rem",
    color: "#70503C",
  },
  divider: {
    height: "1px",
    backgroundColor: "#F3D2B3",
    margin: "0 0 16px 0",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  totalLabel: {
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "#2E1F14",
  },
  totalPrice: {
    fontSize: "1.4rem",
    fontWeight: 800,
    color: "#F57C00",
  },
  submitBtn: {
    width: "100%",
    padding: "16px",
    backgroundColor: "#F57C00",
    color: "white",
    border: "none",
    borderRadius: "14px",
    fontSize: "1.1rem",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 8px 16px rgba(245,124,0,0.2)",
  },
}
