import { useState, useEffect, useCallback } from "react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Header from "./components/Header"
import SearchBar from "./components/SearchBar"
import ItemForm from "./components/ItemForm"
import ItemList from "./components/ItemList"
import LoginPage from "./components/LoginPage"
import {
  fetchItems, createItem, updateItem, deleteItem,
  checkHealth, login, register, setToken, clearToken,
} from "./services/api"

function App() {
  // ==================== AUTH STATE ====================
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // ==================== APP STATE ====================
  const [items, setItems] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({ minPrice: null, maxPrice: null })

  // ==================== LOAD DATA ====================
  const loadItems = useCallback(async (search = "", minPrice = null, maxPrice = null) => {
    setLoading(true)
    try {
      const data = await fetchItems(search, 0, 20, minPrice, maxPrice)
      setItems(data.items)
      setTotalItems(data.total)
    } catch (err) {
      if (err.message === "UNAUTHORIZED") {
        handleLogout()
      }
      console.error("Error loading items:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkHealth().then(setIsConnected)
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      loadItems(searchQuery, filters.minPrice, filters.maxPrice)
    }
  }, [isAuthenticated, loadItems, searchQuery, filters])

  // ==================== AUTH HANDLERS ====================

  const handleLogin = async (email, password) => {
    try {
      const data = await login(email, password)
      setUser(data.user)
      setIsAuthenticated(true)
    } catch (err) {
      throw err
    }
  }

  const handleRegister = async (userData) => {
    try {
      await register(userData)
      await handleLogin(userData.email, userData.password)
    } catch (err) {
      throw err
    }
  }

  const handleLogout = () => {
    clearToken()
    setUser(null)
    setIsAuthenticated(false)
    setItems([])
    setTotalItems(0)
    setEditingItem(null)
    setSearchQuery("")
    setFilters({ minPrice: null, maxPrice: null })
  }

  // ==================== ITEM HANDLERS ====================

  const handleSubmit = async (itemData, editId) => {
    try {
      if (editId) {
        await updateItem(editId, itemData)
        setEditingItem(null)
      } else {
        await createItem(itemData)
      }
      loadItems(searchQuery, filters.minPrice, filters.maxPrice)
    } catch (err) {
      if (err.message === "UNAUTHORIZED") {
        handleLogout()
      } else {
        const errorMsg = err instanceof Error ? err.message : String(err)
        throw new Error(errorMsg)
      }
    }
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
      toast.success("✅ Item berhasil dihapus!", { position: "top-center" })
      loadItems(searchQuery, filters.minPrice, filters.maxPrice)
    } catch (err) {
      if (err.message === "UNAUTHORIZED") {
        handleLogout()
      } else {
        const errorMsg = err instanceof Error ? err.message : String(err)
        toast.error(`❌ Gagal menghapus: ${errorMsg}`, { position: "top-center" })
      }
    }
  }

  const handleSearch = (query, minPrice = null, maxPrice = null) => {
    setSearchQuery(query)
    setFilters({ minPrice, maxPrice })
  }

  // ==================== RENDER ====================

  // Jika belum login, tampilkan login page
  if (!isAuthenticated) {
    return (
      <>
        <ToastContainer position="top-center" autoClose={3000} />
        <LoginPage onLogin={handleLogin} onRegister={handleRegister} />
      </>
    )
  }

  // Jika sudah login, tampilkan main app
  return (
    <div style={styles.app}>
      <ToastContainer position="top-center" autoClose={3000} />
      <div style={styles.container}>
        <Header
          totalItems={totalItems}
          isConnected={isConnected}
          user={user}
          onLogout={handleLogout}
        />
        <ItemForm
          onSubmit={handleSubmit}
          editingItem={editingItem}
          onCancelEdit={() => setEditingItem(null)}
        />
        <SearchBar onSearch={handleSearch} />
        <ItemList
          items={items}
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
  container: { maxWidth: "900px", margin: "0 auto" },
}

export default App
