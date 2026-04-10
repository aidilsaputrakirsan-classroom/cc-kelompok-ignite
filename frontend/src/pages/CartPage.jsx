import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../components/Header"
import { fetchCart, updateCartItem, removeFromCart, fetchItemDetail, API_URL } from "../services/api"
import { toast } from "react-toastify"

export default function CartPage({ user, onLogout }) {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [checkedIds, setCheckedIds] = useState(new Set())
  const [productDetails, setProductDetails] = useState({})

  useEffect(() => {
    loadCartData()
  }, [])

  const loadCartData = async () => {
    setLoading(true)
    try {
      const cartData = await fetchCart()
      const items = cartData.items || []
      setCartItems(items)
      
      // Auto-check all items initially
      const initialChecked = new Set(items.map(item => item.id))
      setCheckedIds(initialChecked)

      // Fetch product details for each item to get names and images
      const details = { ...productDetails }
      const fetchPromises = items.map(async (item) => {
        if (!details[item.product_id]) {
          try {
            const prod = await fetchItemDetail(item.product_id)
            details[item.product_id] = prod
          } catch (e) {
            console.error(`Failed to fetch product ${item.product_id}`, e)
          }
        }
      })
      
      await Promise.all(fetchPromises)
      setProductDetails(details)
    } catch (err) {
      toast.error("Gagal memuat keranjang")
    } finally {
      setLoading(false)
    }
  }

  const handleToggleCheck = (id) => {
    const newChecked = new Set(checkedIds)
    if (newChecked.has(id)) {
      newChecked.delete(id)
    } else {
      newChecked.add(id)
    }
    setCheckedIds(newChecked)
  }

  const handleUpdateQty = async (itemId, currentQty, delta) => {
    const newQty = currentQty + delta
    if (newQty < 1) return

    try {
      await updateCartItem(itemId, newQty)
      setCartItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, quantity: newQty } : item
      ))
    } catch (err) {
      toast.error("Gagal update jumlah")
    }
  }

  const handleRemove = async (itemId) => {
    if (!window.confirm("Hapus item ini dari keranjang?")) return

    try {
      await removeFromCart(itemId)
      setCartItems(prev => prev.filter(item => item.id !== itemId))
      const newChecked = new Set(checkedIds)
      newChecked.delete(itemId)
      setCheckedIds(newChecked)
      toast.info("Item dihapus")
    } catch (err) {
      toast.error("Gagal menghapus item")
    }
  }

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

  // Calculate totals ONLY for checked items
  const checkedItems = cartItems.filter(item => checkedIds.has(item.id))
  const totalPrice = checkedItems.reduce((sum, item) => {
    const product = productDetails[item.product_id]
    const price = product ? product.price : item.price_at_time
    return sum + (price * item.quantity)
  }, 0)

  if (loading && cartItems.length === 0) {
    return (
      <div style={styles.page}>
        <Header user={user} onLogout={onLogout} totalItems={cartItems.length} onCartClick={() => {}} />
        <div style={styles.loadingWrapper}>
           <div style={styles.spinner}></div>
           <p>Memuat keranjang...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <Header 
        user={user} 
        onLogout={onLogout} 
        totalItems={cartItems.length} 
        onCartClick={() => {}} 
      />
      
      <main style={styles.main}>
        <h1 style={styles.pageTitle}>Keranjang Belanja</h1>
        
        <div style={styles.content}>
          {/* Left Column: Item List */}
          <div style={styles.itemsSection}>
            {cartItems.length === 0 ? (
              <div style={styles.emptyCard}>
                <p>Keranjang Anda kosong.</p>
                <button style={styles.shopBtn} onClick={() => navigate("/shop")}>Mulai Belanja</button>
              </div>
            ) : (
              cartItems.map((item) => {
                const product = productDetails[item.product_id] || {}
                const isChecked = checkedIds.has(item.id)
                
                return (
                  <div key={item.id} style={styles.itemCard}>
                    <input 
                      type="checkbox" 
                      checked={isChecked} 
                      onChange={() => handleToggleCheck(item.id)}
                      style={styles.checkbox}
                    />
                    
                    <div style={styles.itemImageWrapper}>
                      {product.image_url ? (
                        <img src={getFullImageUrl(product.image_url)} alt={product.name} style={styles.itemImage} />
                      ) : (
                        <div style={styles.imagePlaceholder}>🍽️</div>
                      )}
                    </div>

                    <div style={styles.itemInfo}>
                      <h3 style={styles.itemName}>{product.name || "Loading..."}</h3>
                      <p style={styles.itemPrice}>{formatRupiah(product.price || item.price_at_time)}</p>
                    </div>

                    <div style={styles.qtyControls}>
                      <button 
                        style={styles.qtyBtn} 
                        onClick={() => handleUpdateQty(item.id, item.quantity, -1)}
                        disabled={item.quantity <= 1}
                      >-</button>
                      <span style={styles.qtyValue}>{item.quantity}</span>
                      <button 
                        style={styles.qtyBtn} 
                        onClick={() => handleUpdateQty(item.id, item.quantity, 1)}
                      >+</button>
                    </div>

                    <button style={styles.deleteBtn} onClick={() => handleRemove(item.id)}>X</button>
                  </div>
                )
              })
            )}
          </div>

          {/* Right Column: Summary */}
          <div style={styles.summarySection}>
            <div style={styles.summaryCard}>
              <h2 style={styles.summaryTitle}>Ringkasan Pesanan</h2>
              
              <div style={styles.detailsList}>
                {checkedItems.length === 0 ? (
                  <p style={styles.noItems}>Belum ada item dipilih.</p>
                ) : (
                  checkedItems.map(item => {
                    const product = productDetails[item.product_id] || {}
                    const price = product.price || item.price_at_time
                    return (
                      <div key={item.id} style={styles.detailRow}>
                        <span style={styles.detailName}>{product.name} x {item.quantity}</span>
                        <span style={styles.detailPrice}>{formatRupiah(price * item.quantity)}</span>
                      </div>
                    )
                  })
                )}
              </div>

              <div style={styles.totalDivider}></div>
              
              <div style={styles.totalRow}>
                <span style={styles.totalLabel}>Total</span>
                <span style={styles.totalPriceText}>{formatRupiah(totalPrice)}</span>
              </div>

              <button 
                style={{
                  ...styles.checkoutBtn, 
                  backgroundColor: checkedItems.length > 0 ? "#F57C00" : "#CCCCCC",
                  cursor: checkedItems.length > 0 ? "pointer" : "not-allowed"
                }}
                disabled={checkedItems.length === 0}
                onClick={() => navigate("/checkout", { 
                  state: { 
                    selectedItems: checkedItems.map(item => ({
                      ...productDetails[item.product_id],
                      quantity: item.quantity,
                      product_id: item.product_id
                    }))
                  } 
                })}
              >
                Lanjut ke Checkout
              </button>
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
    backgroundColor: "#FFF4E6",
    paddingBottom: "80px",
  },
  main: {
    maxWidth: "950px",
    margin: "0 auto",
    padding: "40px 24px",
  },
  pageTitle: {
    fontSize: "2.2rem",
    color: "#2E1F14",
    marginBottom: "32px",
    fontWeight: 800,
  },
  content: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1fr",
    gap: "32px",
    alignItems: "start",
  },
  itemsSection: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  itemCard: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: "16px 24px",
    borderRadius: "24px",
    border: "1px solid #F3D2B3",
    boxShadow: "0 8px 16px rgba(245, 124, 0, 0.04)",
  },
  checkbox: {
    width: "22px",
    height: "22px",
    marginRight: "20px",
    cursor: "pointer",
    accentColor: "#F57C00",
  },
  itemImageWrapper: {
    width: "80px",
    height: "80px",
    borderRadius: "14px",
    overflow: "hidden",
    backgroundColor: "#FFF4E6",
    marginRight: "20px",
    flexShrink: 0,
  },
  itemImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2rem",
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    margin: 0,
    fontSize: "1.15rem",
    color: "#2E1F14",
    fontWeight: 700,
  },
  itemPrice: {
    margin: "4px 0 0",
    color: "#F57C00",
    fontWeight: 600,
  },
  qtyControls: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginRight: "40px",
    backgroundColor: "#FFF9F4",
    padding: "6px 12px",
    borderRadius: "12px",
  },
  qtyBtn: {
    width: "28px",
    height: "28px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#FFECCF",
    color: "#F57C00",
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyValue: {
    fontSize: "1rem",
    fontWeight: 700,
    minWidth: "20px",
    textAlign: "center",
  },
  deleteBtn: {
    border: "none",
    backgroundColor: "transparent",
    color: "#E53935",
    fontSize: "1.2rem",
    fontWeight: 700,
    cursor: "pointer",
    padding: "8px",
    opacity: 0.6,
    transition: "opacity 0.2s",
  },
  summarySection: {
    position: "sticky",
    top: "100px",
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    padding: "32px",
    borderRadius: "32px",
    border: "1px solid #F3D2B3",
    boxShadow: "0 20px 40px rgba(245, 124, 0, 0.08)",
  },
  summaryTitle: {
    margin: "0 0 24px 0",
    fontSize: "1.4rem",
    color: "#2E1F14",
  },
  detailsList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "24px",
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.95rem",
    color: "#70503C",
  },
  detailName: {
    flex: 1,
    paddingRight: "10px",
  },
  detailPrice: {
    fontWeight: 600,
  },
  totalDivider: {
    height: "1px",
    backgroundColor: "#F3D2B3",
    margin: "0 0 20px 0",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
  },
  totalLabel: {
    fontSize: "1.2rem",
    fontWeight: 700,
    color: "#2E1F14",
  },
  totalPriceText: {
    fontSize: "1.5rem",
    fontWeight: 800,
    color: "#F57C00",
  },
  checkoutBtn: {
    width: "100%",
    padding: "18px",
    color: "white",
    border: "none",
    borderRadius: "18px",
    fontSize: "1.1rem",
    fontWeight: 700,
    transition: "transform 0.2s, opacity 0.2s",
  },
  loadingWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "100px",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #F57C00",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "16px",
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    padding: "60px",
    borderRadius: "24px",
    textAlign: "center",
    border: "1px dashed #F3D2B3",
    color: "#70503C",
  },
  shopBtn: {
    marginTop: "20px",
    padding: "12px 24px",
    backgroundColor: "#F57C00",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontWeight: 700,
    cursor: "pointer",
  },
  noItems: {
    color: "#9E9E9E",
    fontStyle: "italic",
    textAlign: "center",
    margin: "20px 0",
  }
}
