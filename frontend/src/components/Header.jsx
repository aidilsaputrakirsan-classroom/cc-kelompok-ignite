import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useState } from "react"

function Header({ user, onLogout, totalItems = 0, onCartClick }) {
    const [hoveredLink, setHoveredLink] = useState(null)
    const navigate = useNavigate()

    const handleProfileClick = () => {
        navigate("/profile")
    }

    const handleCartClick = () => {
        if (onCartClick) {
            onCartClick()
        } else {
            navigate("/cart")
        }
    }

    return (
        <header style={styles.header}>
            <h1 style={styles.title}>ATHSNAC</h1>
            <nav style={styles.navLinks}>
                <Link
                    to="/home"
                    style={{
                        ...styles.navLink,
                        ...(hoveredLink === 'home' ? styles.navLinkHover : {}),
                    }}
                    onMouseEnter={() => setHoveredLink('home')}
                    onMouseLeave={() => setHoveredLink(null)}
                >
                    Home
                </Link>
                <Link
                    to="/about"
                    style={{
                        ...styles.navLink,
                        ...(hoveredLink === 'about' ? styles.navLinkHover : {}),
                    }}
                    onMouseEnter={() => setHoveredLink('about')}
                    onMouseLeave={() => setHoveredLink(null)}
                >
                    About
                </Link>
                <Link
                    to="/shop"
                    style={{
                        ...styles.navLink,
                        ...(hoveredLink === 'produk' ? styles.navLinkHover : {}),
                    }}
                    onMouseEnter={() => setHoveredLink('produk')}
                    onMouseLeave={() => setHoveredLink(null)}
                >
                    Produk
                </Link>
            </nav>
            <div style={styles.actionGroup}>
                {user && (
                  <button onClick={handleCartClick} style={styles.cartButton} title="Keranjang Belanja">
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" style={styles.cartIcon}>
                      <path d="M7 6h10l-1.8 8H8.8L7 6zm12.5-2H5.4L4.2 2H1v2h2.2l2.7 10.2A2 2 0 0 0 7.8 16h8.4a2 2 0 0 0 2-1.8L19.8 4H21V2zm-4.5 16a1.5 1.5 0 1 1 .001-3.001A1.5 1.5 0 0 1 17 18zm-8 0a1.5 1.5 0 1 1 .001-3.001A1.5 1.5 0 0 1 9 18z" />
                      <path d="M18 21a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0-4.5v1.5h1.5V18H18v1.5h-1.5V18H15v-1.5h1.5V15h1.5v1.5H18z" fill="white" />
                    </svg>
                    {totalItems > 0 && <span style={styles.cartCount}>{totalItems}</span>}
                  </button>
                )}
                {user ? (
                    <button onClick={handleProfileClick} style={styles.profileIconButton} title="Profil Pelanggan">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style={styles.profileIcon}>
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                    </button>
                ) : (
                    <Link to="/login" style={styles.actionLink}>Masuk</Link>
                )}
            </div>
        </header>
    )
}

const styles = {
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "16px",
        padding: "1rem 1.5rem",
        backgroundColor: "#F57C00",
        color: "white",
        borderRadius: "18px",
        marginBottom: "1.5rem",
        position: "sticky",
        top: 0,
        zIndex: 100,
    },
    title: {
        margin: 0,
        fontSize: "1.4rem",
        fontWeight: 800,
        letterSpacing: "0.08em",
    },
    navLinks: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        gap: "1rem",
        backgroundColor: "rgba(255,255,255,0.16)",
        padding: "0 0.85rem",
        borderRadius: "999px",
        boxShadow: "0 10px 24px rgba(0, 0, 0, 0.08)",
    },
    navLink: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        textDecoration: "none",
        fontSize: "0.95rem",
        fontWeight: 700,
        minWidth: "56px",
        height: "56px",
        padding: "0 1rem",
        borderRadius: "18px",
        transition: "transform 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease",
    },
    navLinkHover: {
        backgroundColor: "rgba(255,255,255,0.28)",
        transform: "translateY(-2px)",
        boxShadow: "0 8px 16px rgba(0,0,0,0.12)",
    },
    actionGroup: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
    },
    cartButton: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        width: "56px",
        height: "56px",
        borderRadius: "18px",
        border: "1px solid rgba(255,255,255,0.35)",
        backgroundColor: "rgba(255,255,255,0.18)",
        color: "white",
        cursor: "pointer",
        transition: "transform 0.15s ease, background-color 0.15s ease",
    },
    cartIcon: {
        display: "block",
        width: "28px",
        height: "28px",
    },
    cartCount: {
        position: "absolute",
        top: "4px",
        right: "4px",
        minWidth: "18px",
        height: "18px",
        borderRadius: "999px",
        backgroundColor: "#FF4848",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "0.75rem",
        fontWeight: 700,
        padding: "0 5px",
    },
    actionButton: {
        padding: "0.75rem 1.3rem",
        backgroundColor: "rgba(255,255,255,0.2)",
        color: "white",
        borderRadius: "14px",
        border: "none",
        cursor: "pointer",
        fontWeight: 700,
        transition: "background-color 0.2s ease",
    },
    profileIconButton: {
        width: "56px",
        height: "56px",
        borderRadius: "50%",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255,255,255,0.18)",
        border: "1px solid rgba(255,255,255,0.35)",
        cursor: "pointer",
        color: "white",
        transition: "transform 0.15s ease, background-color 0.15s ease",
        padding: 0,
    },
    profileIcon: {
        width: "24px",
        height: "24px",
    },
    actionLink: {
        display: "inline-block",
        padding: "0.75rem 1.3rem",
        backgroundColor: "rgba(255,255,255,0.2)",
        color: "white",
        borderRadius: "14px",
        textDecoration: "none",
        fontWeight: 700,
        transition: "background-color 0.2s ease",
    },
}

export default Header
