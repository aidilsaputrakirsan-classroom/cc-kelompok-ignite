import { useState, useEffect } from "react"
import ItemCard from "./ItemCard"
import { fetchItems } from "../services/api"

function ItemList({ isAdmin = false, searchQuery = "", minPrice = null, maxPrice = null, category = null, sortOption = "default" }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      setError(null)
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
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [isAdmin, searchQuery, minPrice, maxPrice, category, sortOption])

  if (loading) {
    return <p style={styles.message}>Memuat produk...</p>
  }

  if (error) {
    return <p style={styles.error}>Terjadi kesalahan: {error}</p>
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
  error: {
    textAlign: "center",
    color: "#A12A25",
    backgroundColor: "#F9D7D0",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #E7B3A3",
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
