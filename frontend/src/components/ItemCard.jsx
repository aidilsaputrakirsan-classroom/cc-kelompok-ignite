import { useNavigate } from "react-router-dom"
import { API_URL } from "../services/api"

function ItemCard({ item, onEdit, onDelete, isAdmin = false }) {
    const navigate = useNavigate()
    
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

    return (
        <div style={styles.card}>
            {item.image_url ? (
                <div style={styles.imageWrapper}>
                    <img 
                        src={getFullImageUrl(item.image_url)} 
                        alt={item.name} 
                        style={styles.image} 
                        onError={(e) => { 
                            e.target.style.display = "none"
                            if (e.target.nextSibling) e.target.nextSibling.style.display = "flex"
                        }} 
                    />
                    <div style={{ ...styles.imagePlaceholder, display: "none", margin: 0, height: "100%" }}>
                        <span style={styles.placeholderIcon}>🍽️</span>
                    </div>
                </div>
            ) : (
                <div style={styles.imagePlaceholder}>
                    <span style={styles.placeholderIcon}>🍽️</span>
                </div>
            )}

            <div style={styles.cardHeader}>
                <div>
                    <h3 style={styles.name}>{item.name}</h3>
                    {item.category && <p style={styles.categoryText}>{item.category}</p>}
                </div>
                <span style={styles.price}>{formatRupiah(item.price)}</span>
            </div>

            {item.description && (
                <p style={styles.description}>{item.description}</p>
            )}

            <div style={styles.meta}>
                <span style={styles.quantity}>Stok: {item.stock}</span>
            </div>

            <div style={styles.actions}>
                {isAdmin ? (
                    <>
                        <button onClick={() => onEdit(item)} style={styles.btnEdit}>
                            Edit
                        </button>
                        <button onClick={() => onDelete(item.id)} style={styles.btnDelete}>
                            Hapus
                        </button>
                    </>
                ) : (
                    <>
                        <button onClick={() => navigate(`/product/${item.id}`)} style={styles.btnDetail}>
                            Lihat Detail
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

const styles = {
    card: {
        backgroundColor: "var(--surface)",
        padding: "1.5rem",
        borderRadius: "22px",
        border: "1px solid var(--brand-border-light)",
        boxShadow: "var(--card-shadow)",
        transition: "transform 0.2s, box-shadow 0.2s",
        display: "flex",
        flexDirection: "column",
    },
    imageWrapper: {
        width: "100%",
        height: "180px",
        borderRadius: "14px",
        overflow: "hidden",
        marginBottom: "1.2rem",
    },
    image: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
    },
    imagePlaceholder: {
        width: "100%",
        height: "180px",
        borderRadius: "14px",
        backgroundColor: "var(--surface-placeholder)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "1.2rem",
        border: "1px dashed var(--brand-border-light)",
    },
    placeholderIcon: {
        fontSize: "3rem",
    },
    cardHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "12px",
        marginBottom: "0.75rem",
    },
    name: {
        margin: 0,
        fontSize: "1.25rem",
        color: "var(--text-primary)",
    },
    price: {
        fontWeight: "700",
        color: "var(--brand-hover)",
        fontSize: "1.1rem",
        whiteSpace: "nowrap",
    },
    categoryText: {
        margin: "0.5rem 0 0 0",
        fontSize: "0.85rem",
        color: "var(--text-muted)",
    },
    description: {
        color: "var(--text-secondary)",
        fontSize: "0.95rem",
        margin: "0 0 1rem 0",
        lineHeight: 1.6,
    },
    meta: {
        display: "flex",
        gap: "1rem",
        fontSize: "0.9rem",
        color: "var(--text-secondary)",
        marginBottom: "1rem",
    },
    quantity: {
        fontWeight: 600,
    },
    actions: {
        display: "flex",
        gap: "0.75rem",
    },
    btnEdit: {
        flex: 1,
        padding: "0.85rem 1rem",
        backgroundColor: "var(--brand-light)",
        color: "var(--brand-hover)",
        border: "none",
        borderRadius: "14px",
        cursor: "pointer",
        fontSize: "0.95rem",
        fontWeight: 700,
    },
    btnDelete: {
        flex: 1,
        padding: "0.85rem 1rem",
        backgroundColor: "var(--danger-bg)",
        color: "var(--danger-text)",
        border: "none",
        borderRadius: "14px",
        cursor: "pointer",
        fontSize: "0.95rem",
        fontWeight: 700,
    },
    btnDetail: {
        flex: 1,
        padding: "0.85rem 1rem",
        backgroundColor: "var(--brand)",
        color: "#FFFFFF",
        border: "none",
        borderRadius: "14px",
        cursor: "pointer",
        fontSize: "0.9rem",
        fontWeight: 700,
        transition: "all 0.2s",
    },
    btnAddCart: {
        flex: 1,
        padding: "0.85rem 1rem",
        backgroundColor: "var(--brand)",
        color: "#FFFFFF",
        border: "none",
        borderRadius: "14px",
        cursor: "pointer",
        fontSize: "0.9rem",
        fontWeight: 700,
    },
}

export default ItemCard
