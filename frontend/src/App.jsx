import { useState, useEffect, useCallback } from "react"
import Header from "./components/Header"
import SearchBar from "./components/SearchBar"
import ItemForm from "./components/ItemForm"
import ItemList from "./components/ItemList"
import { fetchItems, createItem, updateItem, deleteItem, checkHealth } from "./services/api"

function App() {
  // ==================== STATE ====================
  const [items, setItems] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  // ==================== STATE SORTING ====================
  const [sortBy, setSortBy] = useState("latest")

  // ==================== LOAD DATA ====================
  const loadItems = useCallback(async (search = "") => {
    setLoading(true)
    try {
      const data = await fetchItems(search)
      setItems(data.items)
      setTotalItems(data.total)
    } catch (err) {
      console.error("Error loading items:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  // ==================== ON MOUNT ====================
  useEffect(() => {
    checkHealth().then(setIsConnected)
    loadItems()
  }, [loadItems])

  // ==================== HANDLERS ====================

  const handleSubmit = async (itemData, editId) => {
    if (editId) {
      await updateItem(editId, itemData)
      setEditingItem(null)
    } else {
      await createItem(itemData)
    }
    loadItems(searchQuery)
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id) => {
    const item = items.find((i) => i.id === id)
    if (!window.confirm(`Yakin ingin menghapus "${item?.name}"?`)) return

    try {
      await deleteItem(id)
      loadItems(searchQuery)
    } catch (err) {
      alert("Gagal menghapus: " + err.message)
    }
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    loadItems(query)
  }

  const handleCancelEdit = () => {
    setEditingItem(null)
  }

  // ==================== SORTING FUNCTION ====================
  const sortedItems = [...items].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name)
    }

    if (sortBy === "price") {
      return a.price - b.price
    }

    if (sortBy === "latest") {
      return b.id - a.id
    }

    return 0
  })

  // ==================== RENDER ====================
  return (
    <div style={styles.app}>
      <div style={styles.container}>
        <Header totalItems={totalItems} isConnected={isConnected} />

        <ItemForm
          onSubmit={handleSubmit}
          editingItem={editingItem}
          onCancelEdit={handleCancelEdit}
        />

        <SearchBar onSearch={handleSearch} />

        {/* DROPDOWN SORTING */}
        <div style={styles.sortContainer}>
          <label style={styles.sortLabel}>Urutkan berdasarkan:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={styles.sortSelect}
          >
            <option value="name">Nama</option>
            <option value="price">Harga</option>
            <option value="latest">Terbaru</option>
          </select>
        </div>

        <ItemList
          items={sortedItems}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>
    </div>
  )
}

const styles = {
  app: {
    minHeight: "100vh",
    backgroundColor: "#f0f2f5",
    padding: "2rem",
    fontFamily: "'Segoe UI', Arial, sans-serif",
  },
  container: {
    maxWidth: "900px",
    margin: "0 auto",
  },

  sortContainer: {
    margin: "1rem 0",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  sortLabel: {
    fontWeight: "500",
  },

  sortSelect: {
    padding: "6px 10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
}

export default App