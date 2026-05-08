import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import Header from "../components/Header"
import { fetchItemDetail, API_URL, addToCart } from "../services/api"
import { toast } from "react-toastify"

export default function ProductDetailPage({ user, onLogout }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cartCount, setCartCount] = useState(0)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true)
      try {
        const data = await fetchItemDetail(id)
        setProduct(data)
      } catch (err) {
        toast.error("Gagal memuat detail produk")
        navigate("/shop")
      } finally {
        setLoading(false)
      }
    }
    loadProduct()
  }, [id, navigate])

  const formatRupiah = (num) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num)
  }

  const getFullImageUrl = (url) => {
    if (!url) return null
    if (url.startsWith("http") || url.startsWith("blob:") || url.startsWith("data:")) return url
    return `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`
  }

  const handleUpdateQty = (delta) => {
    const newQty = quantity + delta
    if (newQty < 1) return
    if (product && newQty > product.stock) {
      toast.warn("Mencapai batas stok yang tersedia")
      return
    }
    setQuantity(newQty)
  }

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, quantity)
      toast.success(`${product.name} (${quantity}) ditambahkan ke keranjang!`)
      setCartCount(prev => prev + 1)
    } catch (err) {
      toast.error("Gagal menambahkan ke keranjang")
    }
  }

  const handleDirectOrder = () => {
    navigate("/checkout", { 
      state: { 
        selectedItems: [{ ...product, quantity, product_id: product.id }] 
      } 
    })
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <Header user={user} onLogout={onLogout} totalItems={cartCount} onCartClick={() => navigate("/cart")} />
        <div style={styles.spinnerWrapper}>
          <div style={styles.spinner}></div>
          <p>Memuat detail produk...</p>
        </div>
      </div>
    )
  }

  if (!product) return null

  return (
    <div style={styles.page}>
      <Header 
        user={user} 
        onLogout={onLogout} 
        totalItems={cartCount} 
        onCartClick={() => navigate("/cart")} 
      />
      
      <main style={styles.main}>
        <div style={styles.navigationSection}>
          <button onClick={() => navigate("/shop")} style={styles.backButton}>
            <span style={styles.backArrow}>←</span> Kembali ke Katalog
          </button>
        </div>

        <div style={styles.cardContainer}>
          <div style={styles.detailCard}>
            <div style={styles.contentGrid}>
              {/* Left Column: Image */}
              <div style={styles.imageSection}>
                {product.image_url ? (
                  <div style={styles.imageWrapper}>
                    <img 
                      src={getFullImageUrl(product.image_url)} 
                      alt={product.name} 
                      style={styles.image} 
                    />
                  </div>
                ) : (
                  <div style={styles.imagePlaceholder}>
                    <span style={styles.placeholderIcon}>🍽️</span>
                  </div>
                )}
              </div>

              {/* Right Column: Info */}
              <div style={styles.infoSection}>
                <h1 style={styles.productName}>{product.name}</h1>
                <p style={styles.price}>{formatRupiah(product.price)}</p>
                
                <div style={styles.metaContainer}>
                  <div style={styles.metaItem}>
                    <span style={styles.metaLabel}>Kategori</span>
                    <span style={styles.metaValue}>{product.category || "Snack"}</span>
                  </div>
                  <div style={styles.metaDivider}></div>
                  <div style={styles.metaItem}>
                    <span style={styles.metaLabel}>Stok Tersedia</span>
                    <span style={styles.metaValue}>{product.stock} pcs</span>
                  </div>
                </div>

                <div style={styles.ratingBox}>
                  <div style={styles.stars}>
                    {"★★★★☆".split("").map((s, i) => (
                      <span key={i} style={s === "★" ? styles.starActive : styles.starInactive}>{s}</span>
                    ))}
                  </div>
                  <span style={styles.reviewText}>25 Ulasan</span>
                </div>

                <div style={styles.descriptionBox}>
                   <h3 style={styles.sectionTitle}>Deskripsi</h3>
                   <p style={styles.descriptionText}>
                      {product.description || "Belum ada deskripsi untuk produk ini."}
                   </p>
                </div>

                {/* Quantity Selector */}
                <div style={styles.quantitySection}>
                  <span style={styles.qtyLabel}>Pilih Jumlah:</span>
                  <div style={styles.qtyControls}>
                    <button style={styles.qtyBtn} onClick={() => handleUpdateQty(-1)}>-</button>
                    <span style={styles.qtyDisplay}>{quantity}</span>
                    <button style={styles.qtyBtn} onClick={() => handleUpdateQty(1)}>+</button>
                  </div>
                </div>

                <div style={styles.actionButtons}>
                  <button onClick={handleDirectOrder} style={styles.btnOrder}>
                    Pesan Sekarang
                  </button>
                  <button onClick={handleAddToCart} style={styles.btnAddCart}>
                    + Keranjang
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "var(--bg-page)",
    paddingBottom: "80px",
  },
  main: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "40px 24px",
  },
  navigationSection: {
    maxWidth: "1100px",
    margin: "0 auto 24px auto",
  },
  backButton: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "var(--surface)",
    color: "var(--brand)",
    border: "1.5px solid var(--brand)",
    borderRadius: "12px",
    padding: "10px 18px",
    fontSize: "0.95rem",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
  },
  backArrow: {
    fontSize: "1.2rem",
    lineHeight: 1,
  },
  cardContainer: {
    display: "flex",
    justifyContent: "center",
  },
  detailCard: {
    backgroundColor: "var(--surface)",
    borderRadius: "32px",
    padding: "48px",
    boxShadow: "var(--card-shadow)",
    border: "1px solid var(--border-card)",
    width: "100%",
  },
  contentGrid: {
    display: "grid",
    gridTemplateColumns: "400px 1fr",
    gap: "60px",
  },
  imageSection: {
    display: "flex",
    justifyContent: "center",
  },
  imageWrapper: {
    width: "100%",
    aspectRatio: "1 / 1",
    borderRadius: "20px",
    overflow: "hidden",
    border: "1px solid var(--border-card)",
    boxShadow: "0 10px 20px rgba(0,0,0,0.06)",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  imagePlaceholder: {
    width: "100%",
    aspectRatio: "1 / 1",
    borderRadius: "20px",
    backgroundColor: "var(--surface-placeholder)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px dashed var(--border-card)",
  },
  placeholderIcon: {
    fontSize: "4rem",
  },
  infoSection: {
    display: "flex",
    flexDirection: "column",
  },
  productName: {
    margin: "0 0 10px 0",
    fontSize: "1.8rem",
    color: "var(--text-primary)",
    lineHeight: 1.2,
    fontWeight: 800,
  },
  price: {
    fontSize: "1.6rem",
    fontWeight: 800,
    color: "var(--brand)",
    margin: "0 0 20px 0",
  },
  metaContainer: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    padding: "16px",
    backgroundColor: "var(--surface-input)",
    borderRadius: "16px",
    border: "1px solid var(--brand-border)",
    marginBottom: "20px",
  },
  metaItem: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  metaDivider: {
    width: "1.5px",
    height: "30px",
    backgroundColor: "var(--brand-border)",
  },
  metaLabel: {
    fontSize: "0.8rem",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    fontWeight: 600,
  },
  metaValue: {
    fontSize: "0.95rem",
    fontWeight: 700,
    color: "var(--text-dark)",
  },
  ratingBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "28px",
  },
  stars: {
    display: "flex",
    gap: "2px",
    fontSize: "1rem",
  },
  starActive: {
    color: "var(--brand)",
  },
  starInactive: {
    color: "var(--divider)",
  },
  reviewText: {
    fontSize: "0.9rem",
    color: "var(--text-secondary)",
    fontWeight: 500,
  },
  descriptionBox: {
    marginBottom: "32px",
  },
  sectionTitle: {
    fontSize: "1.05rem",
    color: "var(--text-primary)",
    margin: "0 0 8px 0",
    fontWeight: 700,
  },
  descriptionText: {
    color: "var(--text-secondary)",
    lineHeight: 1.7,
    fontSize: "0.92rem",
    margin: 0,
  },
  quantitySection: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "32px",
    padding: "16px",
    backgroundColor: "var(--qty-bg)",
    borderRadius: "16px",
    border: "1px solid var(--border-card)",
  },
  qtyLabel: {
    fontSize: "0.95rem",
    fontWeight: 700,
    color: "var(--text-primary)",
  },
  qtyControls: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  qtyBtn: {
    width: "32px",
    height: "32px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "var(--brand)",
    color: "white",
    fontSize: "1.1rem",
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.1s",
  },
  qtyDisplay: {
    fontSize: "1.1rem",
    fontWeight: 800,
    color: "var(--brand)",
    minWidth: "24px",
    textAlign: "center",
  },
  actionButtons: {
    display: "flex",
    gap: "12px",
  },
  btnOrder: {
    flex: 2,
    padding: "16px",
    backgroundColor: "var(--brand)",
    color: "white",
    border: "none",
    borderRadius: "16px",
    fontSize: "1rem",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: "0 8px 16px rgba(245,124,0,0.25)",
  },
  btnAddCart: {
    flex: 1,
    padding: "16px",
    backgroundColor: "var(--surface)",
    color: "var(--brand)",
    border: "2px solid var(--brand)",
    borderRadius: "16px",
    fontSize: "1rem",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  loadingContainer: {
    minHeight: "100vh",
    backgroundColor: "var(--bg-page)",
  },
  spinnerWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "100px",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid rgba(245,124,0,0.15)",
    borderTop: "4px solid var(--brand)",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "16px",
  },
}
