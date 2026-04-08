import { useState } from "react"

function SearchBar({ onSearch, activeFilter, onFilterChange }) {
    const [query, setQuery] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        onSearch(query, null, null)
    }

    const handleClear = () => {
        setQuery("")
        onSearch("", null, null)
    }

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.searchRow}>
                <input
                    type="text"
                    placeholder="Cari Produk...."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={styles.input}
                />
                <button type="submit" style={styles.btnSearch}>
                    Cari
                </button>
                <select
                    value={activeFilter}
                    onChange={(event) => onFilterChange(event.target.value)}
                    style={styles.filterSelect}
                >
                    <option value="semua">Filter</option>
                    <option value="snack">Snack</option>
                    <option value="best">Best Seller</option>
                    <option value="murah">Paling Murah</option>
                    <option value="mahal">Paling Mahal</option>
                </select>
                {query && (
                    <button type="button" onClick={handleClear} style={styles.btnClear}>
                        Hapus
                    </button>
                )}
            </div>
        </form>
    )
}

const styles = {
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        width: "100%",
    },
    searchRow: {
        display: "flex",
        gap: "0.75rem",
        flexWrap: "wrap",
    },
    input: {
        flex: 1,
        minWidth: "220px",
        padding: "0.85rem 1rem",
        fontSize: "1rem",
        border: "1px solid #E7C4A8",
        borderRadius: "12px",
        outline: "none",
        backgroundColor: "#FFF9F4",
        color: "#4F370E",
    },
    btnSearch: {
        padding: "0.85rem 1.25rem",
        backgroundColor: "#F57C00",
        color: "white",
        border: "none",
        borderRadius: "12px",
        cursor: "pointer",
        fontSize: "0.95rem",
        fontWeight: 700,
    },
    btnClear: {
        padding: "0.85rem 1rem",
        backgroundColor: "#F3E1D0",
        color: "#4F370E",
        border: "1px solid #E7C4A8",
        borderRadius: "12px",
        cursor: "pointer",
        fontSize: "0.95rem",
    },
    filterSelect: {
        padding: "0.85rem 0.9rem",
        border: "1px solid #E7C4A8",
        borderRadius: "12px",
        outline: "none",
        backgroundColor: "#FFF9F4",
        color: "#4F370E",
        cursor: "pointer",
        fontSize: "0.95rem",
        minWidth: "140px",
    },
    filterRow: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: "0.75rem",
        padding: "1rem",
        backgroundColor: "#FFF7F0",
        borderRadius: "16px",
        border: "1px solid #F3D2B3",
    },
    filterField: {
        display: "flex",
        flexDirection: "column",
        gap: "0.35rem",
    },
    filterLabel: {
        fontSize: "0.85rem",
        fontWeight: 700,
        color: "#8A5D3B",
    },
    filterInput: {
        padding: "0.85rem 0.9rem",
        fontSize: "0.95rem",
        border: "1px solid #E7C4A8",
        borderRadius: "12px",
        outline: "none",
        backgroundColor: "#FFF9F4",
    },
    btnApplyFilter: {
        alignSelf: "flex-end",
        padding: "0.85rem 1rem",
        backgroundColor: "#D95B12",
        color: "white",
        border: "none",
        borderRadius: "12px",
        cursor: "pointer",
        fontSize: "0.95rem",
        fontWeight: 700,
        marginTop: "auto",
    },
}

export default SearchBar
