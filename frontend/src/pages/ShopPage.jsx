import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "../components/Header"
import SearchBar from "../components/SearchBar"
import ItemList from "../components/ItemList"

export default function ShopPage({ user, onLogout }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({ minPrice: null, maxPrice: null })
  const [category, setCategory] = useState(null)
  const [sortOption, setSortOption] = useState("default")
  const [activeFilter, setActiveFilter] = useState("semua")
  const [cartCount, setCartCount] = useState(0)
  const navigate = useNavigate()

  const handleLogout = () => {
    onLogout?.()
    navigate("/login", { replace: true })
  }

  const handleSearch = (query, minPrice, maxPrice) => {
    setSearchQuery(query)
    setFilters({ minPrice, maxPrice })
  }

  const handleFilter = (filterKey) => {
    setActiveFilter(filterKey)
    setFilters({ minPrice: null, maxPrice: null })

    switch (filterKey) {
      case "snack":
        setCategory("snack")
        setSortOption("default")
        break
      case "best":
        setCategory(null)
        setSortOption("best")
        break
      case "murah":
        setCategory(null)
        setSortOption("cheapest")
        break
      case "mahal":
        setCategory(null)
        setSortOption("expensive")
        break
      default:
        setCategory(null)
        setSortOption("default")
        break
    }
  }

  return (
    <div style={styles.page}>
      <Header
        user={user}
        onLogout={handleLogout}
        totalItems={cartCount}
        onCartClick={() => navigate("/cart")}
      />
      <main style={styles.main}>
        <div style={styles.contentHeader}>
          <div>
            <h1 style={styles.title}>Temukan Menu Favorit</h1>
            <p style={styles.subtitle}>Cari produk khas Balikpapan berdasarkan nama, kategori, dan harga.</p>
          </div>
          <SearchBar onSearch={handleSearch} activeFilter={activeFilter} onFilterChange={handleFilter} />
        </div>

        <ItemList
          isAdmin={false}
          searchQuery={searchQuery}
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          category={category}
          sortOption={sortOption}
          onCartUpdate={setCartCount}
        />
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
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "24px",
  },
  contentHeader: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "24px",
    marginBottom: "24px",
  },
  title: {
    margin: 0,
    fontSize: "2.2rem",
    color: "#2E1F14",
  },
  subtitle: {
    margin: "10px 0 0",
    color: "#70503C",
    fontSize: "1rem",
  },
}
