import { useState, useEffect, useCallback } from "react"
import ItemCard from "./ItemCard"
import { fetchItems, ServiceUnavailableError } from "../services/api"

function ItemList({ isAdmin = false, searchQuery = "", minPrice = null, maxPrice = null, category = null, sortOption = "default", onCartUpdate }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [is503, setIs503] = useState(false)

  const loadProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    setIs503(false)
    try {
      const data = await fetchItems(searchQuery, 0, 100, minPrice, maxPrice, category)
      let products = data.products || []
      if (!isAdmin) {
        products = products.filter(p => p.is_active)
      }

      if (sortOption === "cheapest") {
        products.sort((a, b) => a.price - b.price)
      } else if (sortOption === "expensive") {
        products.sort((a, b) => b.price - a.price)
      } else if (sortOption === "best") {
        products.sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0))
      }

      setItems(products)
    } catch (err) {
      console.error("Error loading products:", err)
      if (err instanceof ServiceUnavailableError) {
        setIs503(true)
        setError("Layanan sedang tidak tersedia. Silakan coba beberapa saat lagi.")
      } else {
        setError("Gagal memuat produk. Silakan coba lagi.")
      }
    } finally {
      setLoading(false)
    }
  }, [isAdmin, searchQuery, minPrice, maxPrice, category, sortOption])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  if (loading) {
    return <p style={styles.message}>Memuat produk...</p>
  }

  if (error) {
    return (
      <div style={styles.errorBox}>
        {is503 && <span style={styles.errorIcon}>⚠️</span>}
        <p style={styles.errorText}>{error}</p>
        <button
          id="retry-load-products"
          style={styles.retryButton}
          onClick={loadProducts}
        >
          🔄 Coba Lagi
        </button>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div style={styles.empty}>
        <p style={styles.emptyText}>Tidak ada produk.</p>
        <p style={styles.emptyHint}>
          {isAdmin ? "Gunakan form di atas untuk menambahkan produk pertama." : "Silakan coba kata kunci atau rentang harga lain."}
        </p>
      </div>
    )
  }

  return (
    <div style={styles.grid}>
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          isAdmin={isAdmin}
        />
      ))}
    </div>
  )
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "24px",
  },
  message: {
    textAlign: "center",
    color: "#70503C",
    padding: "40px 20px",
    fontSize: "1rem",
  },
  errorBox: {
    textAlign: "center",
    color: "#A12A25",
    backgroundColor: "#F9D7D0",
    padding: "28px 20px",
    borderRadius: "12px",
    border: "1px solid #E7B3A3",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
  },
  errorIcon: {
    fontSize: "1.8rem",
  },
  errorText: {
    margin: 0,
    fontSize: "1rem",
    fontWeight: 600,
    color: "#A12A25",
  },
  retryButton: {
    marginTop: "4px",
    padding: "10px 24px",
    backgroundColor: "#F57C00",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontWeight: 700,
    fontSize: "0.95rem",
    cursor: "pointer",
  },
  empty: {
    textAlign: "center",
    padding: "60px 20px",
    backgroundColor: "#FFF7F0",
    borderRadius: "18px",
    border: "1px solid #F3D2B3",
  },
  emptyText: {
    fontSize: "1.15rem",
    color: "#4F370E",
    margin: "0 0 10px 0",
    fontWeight: 700,
  },
  emptyHint: {
    fontSize: "0.95rem",
    color: "#70503C",
    margin: 0,
  },
}

export default ItemList
