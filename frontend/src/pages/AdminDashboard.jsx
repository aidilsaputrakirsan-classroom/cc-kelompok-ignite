import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { clearToken } from "../services/api"
import { toast } from "react-toastify"
import Header from "../components/Header"
import ItemForm from "../components/ItemForm"
import ItemList from "../components/ItemList"

export default function AdminDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("products")
  const [refreshKey, setRefreshKey] = useState(0)
  const navigate = useNavigate()

  const handleLogout = () => {
    clearToken()
    onLogout?.()
    toast.info("Anda telah logout", { position: "top-center" })
    navigate("/login", { replace: true })
  }

  const handleProductUpdated = () => {
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <Header user={user} onLogout={handleLogout} />

      {/* Main Content */}
      <div style={styles.content}>
        <div style={styles.sideNav}>
          <h3 style={styles.sideNavTitle}>Admin Menu</h3>
          
          <button 
            style={{
              ...styles.navButton,
              ...(activeTab === "products" ? styles.navButtonActive : {})
            }}
            onClick={() => setActiveTab("products")}
          >
            📦 Kelola Produk
          </button>

          <button 
            style={{
              ...styles.navButton,
              ...(activeTab === "analytics" ? styles.navButtonActive : {})
            }}
            onClick={() => setActiveTab("analytics")}
          >
            📊 Analitik
          </button>

          <button 
            style={{
              ...styles.navButton,
              ...(activeTab === "orders" ? styles.navButtonActive : {})
            }}
            onClick={() => setActiveTab("orders")}
          >
            📋 Pesanan
          </button>

          <button 
            style={{
              ...styles.navButton,
              ...(activeTab === "profile" ? styles.navButtonActive : {})
            }}
            onClick={() => setActiveTab("profile")}
          >
            👤 Profil
          </button>

          <button 
            style={styles.logoutButton}
            onClick={handleLogout}
          >
            🚪 Logout
          </button>
        </div>

        <div style={styles.mainArea}>
          {/* Tab: Products */}
          {activeTab === "products" && (
            <div>
              <h2 style={styles.tabTitle}>Kelola Produk</h2>
              
              <div style={styles.tabContent}>
                <div style={styles.formSection}>
                  <h3 style={styles.sectionTitle}>Tambah/Edit Produk</h3>
                  <ItemForm onSuccess={handleProductUpdated} />
                </div>

                <div style={styles.listSection}>
                  <h3 style={styles.sectionTitle}>Daftar Produk</h3>
                  <ItemList key={refreshKey} isAdmin={true} />
                </div>
              </div>
            </div>
          )}

          {/* Tab: Analytics */}
          {activeTab === "analytics" && (
            <div>
              <h2 style={styles.tabTitle}>Analitik</h2>
              <div style={styles.emptyState}>
                <p>📊 Fitur analitik akan segera tersedia</p>
              </div>
            </div>
          )}

          {/* Tab: Orders */}
          {activeTab === "orders" && (
            <div>
              <h2 style={styles.tabTitle}>Pesanan</h2>
              <div style={styles.emptyState}>
                <p>📋 Daftar pesanan akan ditampilkan di sini</p>
              </div>
            </div>
          )}

          {/* Tab: Profile */}
          {activeTab === "profile" && (
            <div>
              <h2 style={styles.tabTitle}>Profil Admin</h2>
              <div style={styles.profileCard}>
                <div style={styles.profileItem}>
                  <span style={styles.label}>Nama:</span>
                  <span>{user?.name || "-"}</span>
                </div>
                <div style={styles.profileItem}>
                  <span style={styles.label}>Email:</span>
                  <span>{user?.email || "-"}</span>
                </div>
                <div style={styles.profileItem}>
                  <span style={styles.label}>Role:</span>
                  <span style={styles.badge}>🔐 {user?.role?.toUpperCase() || "-"}</span>
                </div>
                <div style={styles.profileItem}>
                  <span style={styles.label}>Nomor Telepon:</span>
                  <span>{user?.phone || "-"}</span>
                </div>
                <div style={styles.profileItem}>
                  <span style={styles.label}>Alamat:</span>
                  <span>{user?.address || "-"}</span>
                </div>
                <div style={styles.profileItem}>
                  <span style={styles.label}>Terdaftar Sejak:</span>
                  <span>{user?.created_at ? new Date(user.created_at).toLocaleDateString("id-ID") : "-"}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f5f5f5",
  },
  content: {
    display: "flex",
    flex: 1,
    gap: "20px",
    padding: "20px",
    maxWidth: "1400px",
    margin: "0 auto",
    width: "100%",
  },
  sideNav: {
    width: "200px",
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "20px",
    height: "fit-content",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  sideNavTitle: {
    margin: "0 0 20px 0",
    fontSize: "16px",
    fontWeight: "bold",
    color: "#333",
  },
  navButton: {
    display: "block",
    width: "100%",
    padding: "12px 16px",
    marginBottom: "8px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#f0f0f0",
    color: "#333",
    cursor: "pointer",
    fontSize: "14px",
    textAlign: "left",
    transition: "all 0.3s",
  },
  navButtonActive: {
    backgroundColor: "#4CAF50",
    color: "white",
    fontWeight: "bold",
  },
  logoutButton: {
    display: "block",
    width: "100%",
    padding: "12px 16px",
    marginTop: "20px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#f44336",
    color: "white",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    transition: "all 0.3s",
  },
  mainArea: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "30px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  tabTitle: {
    margin: "0 0 20px 0",
    color: "#333",
    fontSize: "24px",
  },
  tabContent: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "30px",
  },
  sectionTitle: {
    margin: "0 0 15px 0",
    color: "#555",
    fontSize: "18px",
    borderBottom: "2px solid #4CAF50",
    paddingBottom: "10px",
  },
  formSection: {
    backgroundColor: "#fafafa",
    padding: "20px",
    borderRadius: "8px",
  },
  listSection: {
    backgroundColor: "#fafafa",
    padding: "20px",
    borderRadius: "8px",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#999",
    fontSize: "16px",
  },
  profileCard: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    backgroundColor: "#fafafa",
    padding: "25px",
    borderRadius: "8px",
    maxWidth: "500px",
  },
  profileItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: "12px",
    borderBottom: "1px solid #e0e0e0",
  },
  label: {
    fontWeight: "bold",
    color: "#555",
    minWidth: "120px",
  },
  badge: {
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
  },
}
