import { useNavigate, Link } from "react-router-dom"

function LoginChoicePage() {
  const navigate = useNavigate()

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.titleBlock}>
          <h1 style={styles.brand}>ATHSNAC</h1>
          <p style={styles.heading}>Masuk ke Akun</p>
          <p style={styles.subheading}>Pilih tipe akun untuk melanjutkan</p>
        </div>

        <div style={styles.choiceContainer}>
          <button
            type="button"
            style={styles.choiceButton}
            onClick={() => navigate("/login/customer")}
          >
            <div style={styles.choiceTitle}>Pelanggan</div>
            <div style={styles.choiceDesc}>Masuk untuk berbelanja</div>
          </button>

          <button
            type="button"
            style={styles.choiceButton}
            onClick={() => navigate("/login/admin")}
          >
            <div style={styles.choiceTitle}>Admin</div>
            <div style={styles.choiceDesc}>Masuk dashboard</div>
          </button>
        </div>

        <div style={styles.bottomText}>
          Belum punya akun? <Link to="/register" style={styles.linkButton}>Daftar</Link>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAFAFA",
    padding: "2rem",
  },
  card: {
    width: "100%",
    maxWidth: "500px",
    backgroundColor: "#FFFFFF",
    borderRadius: "24px",
    padding: "3rem 2.5rem",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
  },
  brand: {
    margin: 0,
    color: "#F57C00",
    fontSize: "2.5rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    fontWeight: 700,
  },
  heading: {
    margin: "16px 0 4px",
    fontSize: "1.5rem",
    color: "#222222",
  },
  subheading: {
    margin: "0 0 2rem",
    color: "#666666",
    lineHeight: 1.5,
    fontSize: "0.95rem",
  },
  titleBlock: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  choiceContainer: {
    display: "grid",
    gap: "1rem",
    marginBottom: "2rem",
  },
  choiceButton: {
    padding: "1.5rem",
    borderRadius: "16px",
    border: "1px solid #E8E8E8",
    backgroundColor: "#F9F9F9",
    cursor: "pointer",
    transition: "all 0.3s ease",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  choiceTitle: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#F57C00",
  },
  choiceDesc: {
    fontSize: "0.85rem",
    color: "#888888",
  },
  bottomText: {
    fontSize: "0.9rem",
    color: "#666666",
    textAlign: "center",
  },
  linkButton: {
    background: "none",
    border: "none",
    color: "#F57C00",
    fontSize: "0.9rem",
    fontWeight: 600,
    cursor: "pointer",
    textDecoration: "none",
  },
}

export default LoginChoicePage
