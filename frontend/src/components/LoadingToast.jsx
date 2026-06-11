import { toast } from "react-toastify"

/**
 * Menampilkan toast loading dengan tombol X (close manual).
 *
 * ✅ Logika yang benar:
 *  - Tombol X HANYA menutup loading state (toast.dismiss)
 *  - Notifikasi sukses/gagal tetap muncul dari toast.update() setelah API selesai
 *  - Jika user klik X lalu API berhasil: toast baru dengan ID yang sama akan muncul
 *
 * @param {string} toastId        - ID unik untuk toast (dipakai juga saat update)
 * @param {string} loadingMessage - Pesan yang tampil saat loading
 * @returns {string} toastId yang sama, untuk dipakai di toast.update()
 */
export function showLoadingWithClose(toastId, loadingMessage) {
  const LoadingContent = ({ closeToast }) => (
 * Ketika tombol X ditekan, loading ditutup dan ditampilkan notifikasi sukses sesuai aksi.
 *
 * @param {string} toastId        - ID unik untuk toast (dipakai juga saat update)
 * @param {string} loadingMessage - Pesan yang tampil saat loading
 * @param {string} successMessage - Pesan sukses yang tampil saat pengguna klik X
 * @returns {string} toastId yang sama, untuk dipakai di toast.update()
 */
export function showLoadingWithClose(toastId, loadingMessage, successMessage) {
  const handleClose = () => {
    toast.update(toastId, {
      render: successMessage,
      type: "success",
      isLoading: false,
      autoClose: 3000,
      closeButton: true,
    })
  }

  const LoadingContent = () => (
    <div style={contentStyles.wrapper}>
      <span style={contentStyles.message}>{loadingMessage}</span>
      <button
        onClick={(e) => {
          e.stopPropagation()
          // Hanya dismiss loading — notifikasi sukses/gagal dari toast.update() tetap muncul
          toast.dismiss(toastId)
        }}
        style={contentStyles.closeBtn}
        title="Tutup loading"
          handleClose()
        }}
        style={contentStyles.closeBtn}
        title="Tutup loading dan tampilkan sukses"
        aria-label="Tutup loading"
      >
        ✕
      </button>
    </div>
  )

  toast.loading(<LoadingContent />, {
    id: toastId,
    autoClose: false,
    closeButton: false,
    draggable: false,
  })

  return toastId
}

const contentStyles = {
  wrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    width: "100%",
    minWidth: 0,
  },
  message: {
    flex: 1,
    fontSize: "0.95rem",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  closeBtn: {
    background: "rgba(0,0,0,0.12)",
    border: "none",
    borderRadius: "50%",
    width: "22px",
    height: "22px",
    minWidth: "22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "0.75rem",
    fontWeight: "700",
    color: "#555",
    padding: 0,
    lineHeight: 1,
    flexShrink: 0,
    transition: "background 0.2s ease",
  },
}