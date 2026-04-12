import { useState, useEffect, useCallback } from "react"
import { fetchAllCustomers } from "../services/api"
import { toast } from "react-toastify"

// ── debounce hook ──────────────────────────────────────────
function useDebounce(value, delay) {
  const [deb, setDeb] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDeb(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return deb
}

// ═══════════════════════════════════════════════════════════
export default function AdminCustomers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState("")
  const debouncedSearch = useDebounce(searchInput, 500)

  // ── load customers ───────────────────────────────────────
  const loadCustomers = useCallback(async (search = "") => {
    setLoading(true)
    try {
      const data = await fetchAllCustomers(search, 0, 100)
      setCustomers(data.users ?? [])
    } catch {
      toast.error("Gagal memuat data pelanggan")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadCustomers(debouncedSearch)
  }, [debouncedSearch, loadCustomers])

  // ════════════════════════════════════════════════════════
  return (
    <div style={s.root}>
      <header style={s.header}>
        <h1 style={s.pageTitle}>Data Pelanggan</h1>
      </header>

      {/* ── SEARCH BAR ──────────────────────────────────── */}
      <div style={s.searchRow}>
        <input
          style={s.searchInput}
          type="text"
          placeholder="Cari nama / email...."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button style={s.searchBtn} onClick={() => loadCustomers(searchInput)}>Cari</button>
      </div>

      {/* ── TABLE ───────────────────────────────────────── */}
      <div style={s.tableCard}>
        <div style={s.tableHead}>
          <span style={{ ...s.th, width: "60px", textAlign: "center" }}>PROFIL</span>
          <span style={{ ...s.th, width: "60px", textAlign: "center" }}>ID</span>
          <span style={{ ...s.th, flex: 1.2 }}>NAMA LENGKAP</span>
          <span style={{ ...s.th, flex: 1.8 }}>EMAIL</span>
          <span style={{ ...s.th, width: "160px" }}>NO. HP</span>
          <span style={{ ...s.th, flex: 3 }}>ALAMAT</span>
        </div>

        {loading ? (
          <div style={s.centerBox}>
            <div style={s.spinner} />
            <p style={s.mutedText}>Memuat data pelanggan...</p>
          </div>
        ) : customers.length === 0 ? (
          <div style={s.centerBox}>
            <p style={s.mutedText}>
              {debouncedSearch 
                ? `Tidak ditemukan pelanggan dengan kata kunci "${debouncedSearch}"`
                : "Belum ada pelanggan yang terdaftar."}
            </p>
          </div>
        ) : (
          customers.map((c, idx) => (
            <div
              key={c.id}
              style={{ ...s.tableRow, backgroundColor: idx % 2 === 0 ? "#FFFFFF" : "#FFFAF5" }}
            >
              {/* profil */}
              <div style={{ width: "60px", display: "flex", justifyContent: "center" }}>
                <div style={s.avatar}>{c.name?.charAt(0).toUpperCase()}</div>
              </div>

              {/* ID */}
              <span style={{ ...s.tableCell, width: "60px", textAlign: "center", color: "#F57C00", fontWeight: 800 }}>
                {String(c.id).padStart(3, "0")}
              </span>

              {/* Nama */}
              <span style={{ ...s.tableCell, flex: 1.2, fontWeight: 700 }}>{c.name}</span>

              {/* Email */}
              <span style={{ ...s.tableCell, flex: 1.8 }}>{c.email}</span>

              {/* No HP */}
              <span style={{ ...s.tableCell, width: "160px" }}>{c.phone || "-"}</span>

              {/* Alamat */}
              <span style={{ ...s.tableCell, flex: 3, whiteSpace: "normal", lineHeight: "1.4" }}>
                {c.address || "-"}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

const s = {
  root: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    width: "100%",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pageTitle: {
    margin: 0,
    fontSize: "1.9rem",
    fontWeight: 800,
    color: "#2E1F14",
  },
  searchRow: {
    display: "flex",
    gap: "12px",
    width: "100%",
  },
  searchInput: {
    flex: 1,
    padding: "12px 18px",
    borderRadius: "14px",
    border: "1.5px solid #F3D2B3",
    backgroundColor: "#FFFFFF",
    fontSize: "1rem",
    color: "#2E1F14",
    outline: "none",
    fontFamily: "inherit",
  },
  searchBtn: {
    padding: "12px 28px",
    borderRadius: "14px",
    border: "none",
    backgroundColor: "#F57C00",
    color: "#FFFFFF",
    fontWeight: 700,
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  tableCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "18px",
    border: "1px solid #F3D2B3",
    overflow: "hidden",
  },
  tableHead: {
    display: "flex",
    alignItems: "center",
    padding: "14px 24px",
    backgroundColor: "#FFF4E6",
    borderBottom: "1px solid #F3D2B3",
    gap: "16px",
  },
  th: {
    fontWeight: 700,
    fontSize: "0.78rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#70503C",
  },
  tableRow: {
    display: "flex",
    alignItems: "center",
    padding: "14px 24px",
    gap: "16px",
    borderBottom: "1px solid #F3D2B3",
    transition: "background-color 0.15s",
  },
  avatar: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    backgroundColor: "#FFE7D0",
    border: "1px solid #F3D2B3",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.2rem",
    color: "#F57C00",
  },
  userName: {
    fontWeight: 700,
    fontSize: "0.95rem",
    color: "#2E1F14",
  },
  tableCell: {
    fontSize: "0.92rem",
    fontWeight: 600,
    color: "#2E1F14",
    wordBreak: "break-all",
  },
  centerBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px 24px",
    gap: "12px",
  },
  spinner: {
    width: "36px",
    height: "36px",
    border: "3px solid #F3D2B3",
    borderTop: "3px solid #F57C00",
    borderRadius: "50%",
    animation: "spin 0.9s linear infinite",
  },
  mutedText: {
    margin: 0,
    color: "#70503C",
    fontSize: "0.95rem",
    textAlign: "center",
  },
}

