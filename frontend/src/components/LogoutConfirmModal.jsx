import { useEffect } from "react"

/**
 * LogoutConfirmModal
 * Modal konfirmasi sebelum logout. Bisa digunakan di admin maupun pelanggan.
 *
 * Props:
 *   isOpen   {boolean}  - apakah modal ditampilkan
 *   onCancel {function} - callback saat pengguna memilih "Batal"
 *   onConfirm{function} - callback saat pengguna memilih "Logout"
 */
export default function LogoutConfirmModal({ isOpen, onCancel, onConfirm }) {
  // Tutup modal dengan tombol ESC
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onCancel()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onCancel])

  // Cegah scroll background saat modal terbuka
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  if (!isOpen) return null

  return (
    /* ===== BACKDROP ===== */
    <div
      style={styles.backdrop}
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-modal-title"
    >
      {/* ===== MODAL CARD ===== */}
      <div
        style={styles.modal}
        onClick={(e) => e.stopPropagation()} // cegah klik dalam modal menutup modal
      >
        {/* Icon */}
        <div style={styles.iconWrap}>
          <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#D95B12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </div>

        {/* Judul */}
        <h2 id="logout-modal-title" style={styles.title}>
          Konfirmasi Logout
        </h2>

        {/* Pesan */}
        <p style={styles.message}>
          Apakah Anda yakin ingin keluar dari akun?
        </p>

        {/* Tombol aksi */}
        <div style={styles.actions}>
          <button
            type="button"
            id="logout-modal-cancel"
            style={styles.cancelButton}
            onClick={onCancel}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#F3D2B3"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#FFE7D0"
            }}
          >
            Batal
          </button>
          <button
            type="button"
            id="logout-modal-confirm"
            style={styles.confirmButton}
            onClick={onConfirm}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#B84710"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#D95B12"
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: "16px",
    backdropFilter: "blur(2px)",
    animation: "fadeInBackdrop 0.18s ease",
  },
  modal: {
    backgroundColor: "#FFFFFF",
    borderRadius: "24px",
    padding: "36px 32px 28px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 24px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.10)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    animation: "slideUpModal 0.22s cubic-bezier(0.34,1.56,0.64,1)",
  },
  iconWrap: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    backgroundColor: "#FFF4E6",
    border: "2px solid #F3D2B3",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "4px",
  },
  title: {
    margin: 0,
    fontSize: "1.3rem",
    fontWeight: 800,
    color: "#2E1F14",
    textAlign: "center",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  message: {
    margin: 0,
    fontSize: "0.98rem",
    color: "#70503C",
    textAlign: "center",
    lineHeight: 1.6,
    fontFamily: "Inter, system-ui, sans-serif",
  },
  actions: {
    display: "flex",
    gap: "12px",
    width: "100%",
    marginTop: "8px",
  },
  cancelButton: {
    flex: 1,
    padding: "13px 20px",
    border: "1.5px solid #F3D2B3",
    borderRadius: "14px",
    backgroundColor: "#FFE7D0",
    color: "#5C4635",
    fontWeight: 700,
    fontSize: "0.95rem",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  confirmButton: {
    flex: 1,
    padding: "13px 20px",
    border: "none",
    borderRadius: "14px",
    backgroundColor: "#D95B12",
    color: "#FFFFFF",
    fontWeight: 700,
    fontSize: "0.95rem",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    fontFamily: "Inter, system-ui, sans-serif",
  },
}

// Inject animasi modal sekali saja
if (!document.getElementById("logout-modal-anim")) {
  const s = document.createElement("style")
  s.id = "logout-modal-anim"
  s.innerHTML = `
    @keyframes fadeInBackdrop {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes slideUpModal {
      from { opacity: 0; transform: translateY(24px) scale(0.96); }
      to   { opacity: 1; transform: translateY(0)    scale(1);    }
    }
  `
  document.head.appendChild(s)
}
