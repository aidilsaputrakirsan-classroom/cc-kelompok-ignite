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
                        <svg
                            viewBox="0 0 24 24"
                            width="64"
                            height="64"
                            fill="currentColor"
                            style={styles.cartIcon}
                        >
                            <path d="M7 4H3v2h2l3.6 7.59-1.35 2.44C6.52 17.37 7.48 19 9 19h9v-2H9.42c-.14 0-.25-.11-.25-.25l.03-.12L10.1 15h6.45c.75 0 1.41-.41 1.75-1.03L21 8H7.42L6.27 6H7V4z"/>
                            <circle cx="10" cy="21" r="1.5"/>
                            <circle cx="18" cy="21" r="1.5"/>
                        </svg>

                        {totalItems > 0 && (
                            <span style={styles.cartCount}>{totalItems}</span>
                        )}
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
    },
    // ✅ SUDAH DIBESARKAN
    cartIcon: {
        width: "64px",
        height: "64px",
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
    },
}

export default Header