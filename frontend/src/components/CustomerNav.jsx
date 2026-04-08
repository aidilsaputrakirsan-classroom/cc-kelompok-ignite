import { NavLink } from "react-router-dom"

function CustomerNav() {
  const links = [
    { path: "/home", label: "Beranda" },
    { path: "/shop", label: "Shop" },
    { path: "/cart", label: "🛒", title: "Keranjang" },
    { path: "/orders", label: "Pesanan" },
    { path: "/testimoni", label: "Testimoni" },
    { path: "/profile", label: "Profil" },
  ]

  return (
    <nav style={styles.nav}>
      {links.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          title={link.title ?? link.label}
          style={({ isActive }) => ({
            ...styles.link,
            ...(isActive ? styles.activeLink : {}),
          })}
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  )
}

const styles = {
  nav: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginBottom: "24px",
  },
  link: {
    padding: "12px 18px",
    borderRadius: "999px",
    textDecoration: "none",
    color: "#5A4228",
    backgroundColor: "#FFF2E2",
    fontWeight: 600,
    transition: "background-color 0.2s ease",
  },
  activeLink: {
    backgroundColor: "#F57C00",
    color: "white",
  },
}

export default CustomerNav
