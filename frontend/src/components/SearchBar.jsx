import { useState } from "react"

function SearchBar({ onSearch, sortBy, sortOrder, onSort }) {
    const [query, setQuery] = useState("")
    const [minPrice, setMinPrice] = useState("")
    const [maxPrice, setMaxPrice] = useState("")
    const [showFilters, setShowFilters] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        onSearch(query, minPrice || null, maxPrice || null)
    }

    const handleClear = () => {
        setQuery("")
        setMinPrice("")
        setMaxPrice("")
        onSearch("", null, null)
    }

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.searchRow}>
                <input
                    type="text"
                    placeholder="Cari item berdasarkan nama atau deskripsi..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={styles.input}
                />
                <button type="submit" style={styles.btnSearch}>
                    🔍 Cari
                </button>
                <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    style={styles.btnFilter}
                >
                    {showFilters ? "▲ Tutup Filter" : "▼ Filter Harga"}
                </button>
                {(query || minPrice || maxPrice) && (
                    <button type="button" onClick={handleClear} style={styles.btnClear}>
                        ✕ Clear
                    </button>
                )}
            </div>

            {showFilters && (
                <div style={styles.filterRow}>
                    <div style={styles.filterField}>
                        <label style={styles.filterLabel}>Harga Min (Rp):</label>
                        <input
                            type="number"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            placeholder="0"
                            style={styles.filterInput}
                        />
                    </div>
                    <div style={styles.filterField}>
                        <label style={styles.filterLabel}>Harga Max (Rp):</label>
                        <input
                            type="number"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            placeholder="999999999"
                            style={styles.filterInput}
                        />
                    </div>
                    <button type="submit" style={styles.btnApplyFilter}>
                        ✓ Terapkan
                    </button>
                </div>
            )}

            <div style={styles.sortRow}>
                <div style={styles.sortField}>
                    <label style={styles.sortLabel}>📊 Urutkan Berdasarkan:</label>
                    <select
                        value={sortBy}
                        onChange={(e) => onSort(e.target.value, sortOrder)}
                        style={styles.sortSelect}
                    >
                        <option value="date">Tanggal</option>
                        <option value="name">Nama (A-Z)</option>
                    </select>
                </div>
                <div style={styles.sortField}>
                    <label style={styles.sortLabel}>↕️ Urutan:</label>
                    <select
                        value={sortOrder}
                        onChange={(e) => onSort(sortBy, e.target.value)}
                        style={styles.sortSelect}
                    >
                        <option value="desc">{sortBy === "date" ? "Terbaru" : "Z-A"}</option>
                        <option value="asc">{sortBy === "date" ? "Terlama" : "A-Z"}</option>
                    </select>
                </div>
            </div>
        </form>
    )
}

const styles = {
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        marginBottom: "1.5rem",
    },
    searchRow: {
        display: "flex",
        gap: "0.5rem",
    },
    input: {
        flex: 1,
        padding: "0.75rem 1rem",
        fontSize: "1rem",
        border: "2px solid #ddd",
        borderRadius: "8px",
        outline: "none",
    },
    btnSearch: {
        padding: "0.75rem 1.25rem",
        backgroundColor: "#2E75B6",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "0.9rem",
    },
    btnFilter: {
        padding: "0.75rem 1rem",
        backgroundColor: "#F79646",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "0.9rem",
    },
    btnClear: {
        padding: "0.75rem 1rem",
        backgroundColor: "#f0f0f0",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "0.9rem",
    },
    filterRow: {
        display: "flex",
        gap: "0.75rem",
        flexWrap: "wrap",
        padding: "0.75rem",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        border: "1px solid #e0e0e0",
    },
    filterField: {
        display: "flex",
        flexDirection: "column",
        gap: "0.25rem",
        flex: 1,
        minWidth: "150px",
    },
    filterLabel: {
        fontSize: "0.8rem",
        fontWeight: "bold",
        color: "#555",
    },
    filterInput: {
        padding: "0.6rem 0.8rem",
        fontSize: "0.9rem",
        border: "2px solid #ddd",
        borderRadius: "6px",
        outline: "none",
    },
    btnApplyFilter: {
        alignSelf: "flex-end",
        padding: "0.6rem 1rem",
        backgroundColor: "#548235",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "0.9rem",
        fontWeight: "bold",
        marginTop: "auto",
    },
    sortRow: {
        display: "flex",
        gap: "1rem",
        padding: "0.75rem",
        backgroundColor: "#f0f7ff",
        borderRadius: "8px",
        border: "1px solid #d1e0f0",
    },
    sortField: {
        display: "flex",
        flexDirection: "column",
        gap: "0.25rem",
        flex: 1,
        minWidth: "180px",
    },
    sortLabel: {
        fontSize: "0.8rem",
        fontWeight: "bold",
        color: "#1F4E79",
    },
    sortSelect: {
        padding: "0.6rem 0.8rem",
        fontSize: "0.9rem",
        border: "2px solid #2E75B6",
        borderRadius: "6px",
        backgroundColor: "white",
        color: "#333",
        cursor: "pointer",
        outline: "none",
    },
}

export default SearchBar