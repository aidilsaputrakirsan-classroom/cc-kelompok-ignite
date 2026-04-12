import { useState, useEffect, useCallback } from "react"
import { fetchItems, createItem, updateItem, deleteItem, uploadImage, API_URL } from "../services/api"
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

// ── helpers ────────────────────────────────────────────────
const CATEGORIES = ["Snack", "Makanan", "Lainnya"]

const EMPTY_FORM = {
  name: "",
  category: "Makanan",
  price: "",
  stock: "",
  description: "",
  image_url: "",
  is_active: true,
}

function getFullImageUrl(url) {
  if (!url) return null
  if (url.startsWith("http")) return url
  return `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`
}

function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount ?? 0)
}

// ═══════════════════════════════════════════════════════════
export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  const [searchInput, setSearchInput] = useState("")
  const debouncedSearch = useDebounce(searchInput, 450)

  // modal
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  // delete confirm
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // ── load products ────────────────────────────────────────
  const loadProducts = useCallback(async (search = "") => {
    setLoading(true)
    try {
      const data = await fetchItems(search, 0, 100)
      setProducts(data.products ?? [])
      setTotal(data.total ?? 0)
    } catch {
      toast.error("Gagal memuat produk")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProducts(debouncedSearch)
  }, [debouncedSearch, loadProducts])

  // ── modal helpers ────────────────────────────────────────
  const openCreate = () => {
    setEditId(null)
    setForm(EMPTY_FORM)
    setImageFile(null)
    setPreviewUrl("")
    setErrors({})
    setModalOpen(true)
  }

  const openEdit = (p) => {
    setEditId(p.id)
    setForm({
      name: p.name ?? "",
      category: p.category ?? "Makanan",
      price: String(p.price ?? ""),
      stock: String(p.stock ?? ""),
      description: p.description ?? "",
      image_url: p.image_url ?? "",
      is_active: p.is_active ?? true,
    })
    setImageFile(null)
    setPreviewUrl(p.image_url ? getFullImageUrl(p.image_url) : "")
    setErrors({})
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditId(null)
    setForm(EMPTY_FORM)
    setImageFile(null)
    setPreviewUrl("")
    setErrors({})
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  // ── validate ─────────────────────────────────────────────
  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = "Nama produk wajib diisi"
    const price = parseFloat(form.price)
    if (!form.price || isNaN(price) || price <= 0) errs.price = "Harga harus lebih dari 0"
    const stock = parseInt(form.stock, 10)
    if (form.stock === "" || isNaN(stock) || stock < 0) errs.stock = "Stok tidak boleh negatif"
    return errs
  }

  // ── submit (create / update) ─────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setSubmitting(true)
    try {
      let finalImageUrl = form.image_url

      if (imageFile) {
        // Upload image to backend
        const res = await uploadImage(imageFile)
        finalImageUrl = res.url // e.g., "/uploads/filename.jpg"
      }

      const payload = {
        name: form.name.trim(),
        category: form.category,
        price: parseFloat(form.price),
        stock: parseInt(form.stock, 10),
        description: form.description.trim() || null,
        image_url: finalImageUrl || null,
        is_active: form.is_active,
      }

      if (editId) {
        await updateItem(editId, payload)
        toast.success("Produk berhasil diperbarui ✅")
      } else {
        await createItem(payload)
        toast.success("Produk berhasil ditambahkan ✅")
      }
      closeModal()
      loadProducts(debouncedSearch)
    } catch (err) {
      toast.error(err.message || "Terjadi kesalahan")
    } finally {
      setSubmitting(false)
    }
  }

  // ── delete ───────────────────────────────────────────────
  const confirmDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteItem(deleteTarget.id)
      toast.success(`Produk "${deleteTarget.name}" dihapus 🗑️`)
      setDeleteTarget(null)
      loadProducts(debouncedSearch)
    } catch (err) {
      toast.error(err.message || "Gagal menghapus produk")
    } finally {
      setDeleting(false)
    }
  }

  // ════════════════════════════════════════════════════════
  return (
    <div style={s.root}>

      {/* ── TOP BAR ─────────────────────────────────────── */}
      <div style={s.topBar}>
        <h1 style={s.pageTitle}>Manajemen Produk</h1>
        <button style={s.addBtn} onClick={openCreate}>+ Tambah Produk</button>
      </div>

      {/* ── SEARCH ──────────────────────────────────────── */}
      <div style={s.searchRow}>
        <input
          id="product-search"
          style={s.searchInput}
          type="text"
          placeholder="Cari produk..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button style={s.searchBtn} onClick={() => loadProducts(searchInput)}>Cari</button>
      </div>

      {/* ── TABLE ───────────────────────────────────────── */}
      <div style={s.tableCard}>
        {/* header */}
        <div style={s.tableHead}>
          <span style={{ ...s.th, width: "80px" }}>FOTO</span>
          <span style={{ ...s.th, flex: 1 }}>NAMA PRODUK</span>
          <span style={{ ...s.th, width: "120px", textAlign: "right" }}>HARGA</span>
          <span style={{ ...s.th, width: "80px", textAlign: "right" }}>STOK</span>
          <span style={{ ...s.th, width: "140px", textAlign: "center" }}>AKSI</span>
        </div>

        {/* rows */}
        {loading ? (
          <div style={s.centerBox}>
            <div style={s.spinner} />
            <p style={s.mutedText}>Memuat produk...</p>
          </div>
        ) : products.length === 0 ? (
          <div style={s.centerBox}>
            <p style={s.mutedText}>
              {debouncedSearch
                ? `Tidak ada produk dengan kata kunci "${debouncedSearch}".`
                : "Belum ada produk. Klik + Tambah Produk untuk mulai."}
            </p>
          </div>
        ) : (
          products.map((p, idx) => (
            <div
              key={p.id}
              style={{ ...s.tableRow, backgroundColor: idx % 2 === 0 ? "#FFFFFF" : "#FFFAF5" }}
            >
              {/* foto */}
              <div style={{ width: "80px" }}>
                {p.image_url ? (
                  <img
                    src={getFullImageUrl(p.image_url)}
                    alt={p.name}
                    style={s.productImg}
                    onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex" }}
                  />
                ) : null}
                <div
                  style={{
                    ...s.productImgPlaceholder,
                    display: p.image_url ? "none" : "flex",
                  }}
                >
                  🖼
                </div>
              </div>

              {/* nama & kategori */}
              <div style={{ flex: 1 }}>
                <p style={s.productName}>{p.name}</p>
                <p style={s.productCategory}>{p.category}</p>
                {!p.is_active && (
                  <span style={s.inactiveBadge}>Nonaktif</span>
                )}
              </div>

              {/* harga */}
              <div style={{ width: "120px", textAlign: "right" }}>
                <span style={s.priceText}>{formatRupiah(p.price)}</span>
              </div>

              {/* stok */}
              <div style={{ width: "80px", textAlign: "right" }}>
                <span style={{ ...s.priceText, color: p.stock === 0 ? "#D95B12" : "#2E1F14" }}>
                  {p.stock}
                </span>
              </div>

              {/* aksi */}
              <div style={{ width: "140px", display: "flex", gap: "8px", justifyContent: "center" }}>
                <button
                  id={`edit-product-${p.id}`}
                  style={s.editBtn}
                  onClick={() => openEdit(p)}
                >
                  Edit
                </button>
                <button
                  id={`delete-product-${p.id}`}
                  style={s.deleteBtn}
                  onClick={() => setDeleteTarget(p)}
                >
                  Hapus
                </button>
              </div>
            </div>
          ))
        )}

        {/* footer */}
        {!loading && products.length > 0 && (
          <div style={s.tableFooter}>
            {total} produk ditemukan
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════
          MODAL: CREATE / EDIT
      ══════════════════════════════════════════════════ */}
      {modalOpen && (
        <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div style={s.modal}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>{editId ? "Edit Produk" : "Tambah Produk Baru"}</h2>
              <button style={s.closeBtn} onClick={closeModal}>✕</button>
            </div>

            <form onSubmit={handleSubmit} style={s.form}>
              {/* nama */}
              <div style={s.fieldGroup}>
                <label style={s.label} htmlFor="f-name">Nama Produk <span style={s.required}>*</span></label>
                <input
                  id="f-name"
                  style={{ ...s.input, ...(errors.name ? s.inputError : {}) }}
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="cth: Amplang Ikan Balikpapan"
                />
                {errors.name && <span style={s.errTxt}>{errors.name}</span>}
              </div>

              {/* kategori */}
              <div style={s.fieldGroup}>
                <label style={s.label} htmlFor="f-cat">Kategori <span style={s.required}>*</span></label>
                <select
                  id="f-cat"
                  style={s.input}
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
              </div>

              {/* harga & stok */}
              <div style={s.row2col}>
                <div style={s.fieldGroup}>
                  <label style={s.label} htmlFor="f-price">Harga (Rp) <span style={s.required}>*</span></label>
                  <input
                    id="f-price"
                    style={{ ...s.input, ...(errors.price ? s.inputError : {}) }}
                    name="price"
                    type="number"
                    min="0"
                    step="500"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="35000"
                  />
                  {errors.price && <span style={s.errTxt}>{errors.price}</span>}
                </div>
                <div style={s.fieldGroup}>
                  <label style={s.label} htmlFor="f-stock">Stok <span style={s.required}>*</span></label>
                  <input
                    id="f-stock"
                    style={{ ...s.input, ...(errors.stock ? s.inputError : {}) }}
                    name="stock"
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="100"
                  />
                  {errors.stock && <span style={s.errTxt}>{errors.stock}</span>}
                </div>
              </div>

              {/* deskripsi */}
              <div style={s.fieldGroup}>
                <label style={s.label} htmlFor="f-desc">Deskripsi</label>
                <textarea
                  id="f-desc"
                  style={{ ...s.input, minHeight: "80px", resize: "vertical" }}
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Deskripsi produk (opsional)"
                />
              </div>

              {/* image upload logic */}
              <div style={s.fieldGroup}>
                <label style={s.label} htmlFor="f-img">Foto Produk</label>
                <input
                  id="f-img"
                  style={s.input}
                  name="imageFile"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "#70503C" }}>
                  *Format yang valid: JPG, PNG, WEBP.
                </p>
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="preview"
                    style={s.imgPreview}
                    onError={(e) => { e.target.style.display = "none" }}
                  />
                )}
              </div>

              {/* aktif */}
              <div style={s.checkRow}>
                <input
                  id="f-active"
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={handleChange}
                  style={{ accentColor: "#F57C00", width: "16px", height: "16px" }}
                />
                <label htmlFor="f-active" style={{ ...s.label, margin: 0, cursor: "pointer" }}>
                  Produk aktif (tampil di toko)
                </label>
              </div>

              {/* actions */}
              <div style={s.modalActions}>
                <button type="button" style={s.cancelBtn} onClick={closeModal}>Batal</button>
                <button type="submit" style={s.submitBtn} disabled={submitting}>
                  {submitting ? "Menyimpan..." : editId ? "Simpan Perubahan" : "Tambah Produk"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════
          MODAL: DELETE CONFIRM
      ══════════════════════════════════════════════════ */}
      {deleteTarget && (
        <div style={s.overlay}>
          <div style={{ ...s.modal, maxWidth: "420px" }}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>Hapus Produk</h2>
              <button style={s.closeBtn} onClick={() => setDeleteTarget(null)}>✕</button>
            </div>
            <div style={{ padding: "24px 28px" }}>
              <p style={{ margin: "0 0 8px", color: "#2E1F14", fontSize: "1rem" }}>
                Yakin ingin menghapus produk:
              </p>
              <p style={{ margin: "0 0 24px", fontWeight: 700, color: "#D95B12", fontSize: "1.05rem" }}>
                "{deleteTarget.name}"?
              </p>
              <p style={{ margin: "0 0 28px", color: "#70503C", fontSize: "0.9rem" }}>
                Tindakan ini tidak dapat dibatalkan.
              </p>
              <div style={s.modalActions}>
                <button style={s.cancelBtn} onClick={() => setDeleteTarget(null)}>Batal</button>
                <button
                  style={{ ...s.submitBtn, backgroundColor: "#D95B12" }}
                  onClick={confirmDelete}
                  disabled={deleting}
                >
                  {deleting ? "Menghapus..." : "Ya, Hapus"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════
// STYLES — warm orange/cream palette (matching AdminDashboard)
// ═══════════════════════════════════════════════════════════
const s = {
  root: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    width: "100%",
  },

  /* top bar */
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "12px",
  },
  pageTitle: {
    margin: 0,
    fontSize: "1.9rem",
    fontWeight: 800,
    color: "#2E1F14",
  },
  addBtn: {
    padding: "12px 24px",
    borderRadius: "14px",
    border: "none",
    backgroundColor: "#F57C00",
    color: "#FFFFFF",
    fontWeight: 700,
    fontSize: "0.95rem",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },

  /* search */
  searchRow: {
    display: "flex",
    gap: "12px",
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
  },

  /* table */
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
  tableFooter: {
    padding: "12px 24px",
    fontSize: "0.83rem",
    color: "#70503C",
    textAlign: "right",
    borderTop: "1px solid #F3D2B3",
  },

  /* product cell */
  productImg: {
    width: "52px",
    height: "52px",
    objectFit: "cover",
    borderRadius: "10px",
    border: "1px solid #F3D2B3",
  },
  productImgPlaceholder: {
    width: "52px",
    height: "52px",
    borderRadius: "10px",
    backgroundColor: "#FFF4E6",
    border: "1px solid #F3D2B3",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.4rem",
  },
  productName: {
    margin: "0 0 3px",
    fontWeight: 700,
    color: "#2E1F14",
    fontSize: "0.95rem",
  },
  productCategory: {
    margin: 0,
    color: "#70503C",
    fontSize: "0.82rem",
    textTransform: "capitalize",
  },
  inactiveBadge: {
    display: "inline-block",
    marginTop: "4px",
    padding: "2px 8px",
    borderRadius: "20px",
    backgroundColor: "#FFEBEE",
    color: "#B71C1C",
    fontSize: "0.72rem",
    fontWeight: 700,
  },
  priceText: {
    fontWeight: 700,
    color: "#2E1F14",
    fontSize: "0.92rem",
  },

  /* action buttons */
  editBtn: {
    padding: "6px 16px",
    borderRadius: "10px",
    border: "1.5px solid #F57C00",
    backgroundColor: "transparent",
    color: "#F57C00",
    fontWeight: 700,
    fontSize: "0.82rem",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  deleteBtn: {
    padding: "6px 16px",
    borderRadius: "10px",
    border: "1.5px solid #D95B12",
    backgroundColor: "transparent",
    color: "#D95B12",
    fontWeight: 700,
    fontSize: "0.82rem",
    cursor: "pointer",
    transition: "all 0.15s",
  },

  /* loading / empty */
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

  /* overlay + modal */
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(46,31,20,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "24px",
  },
  modal: {
    backgroundColor: "#FFFFFF",
    borderRadius: "22px",
    width: "100%",
    maxWidth: "560px",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
  },
  modalHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 28px",
    borderBottom: "1px solid #F3D2B3",
  },
  modalTitle: {
    margin: 0,
    fontSize: "1.2rem",
    fontWeight: 800,
    color: "#2E1F14",
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: "1.1rem",
    color: "#70503C",
    cursor: "pointer",
    padding: "4px 8px",
    borderRadius: "8px",
  },

  /* form */
  form: {
    padding: "24px 28px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  row2col: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  label: {
    fontSize: "0.87rem",
    fontWeight: 700,
    color: "#2E1F14",
  },
  required: {
    color: "#D95B12",
  },
  input: {
    padding: "10px 14px",
    borderRadius: "12px",
    border: "1.5px solid #F3D2B3",
    backgroundColor: "#FFFAF5",
    fontSize: "0.95rem",
    color: "#2E1F14",
    fontFamily: "inherit",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  },
  inputError: {
    borderColor: "#D95B12",
  },
  errTxt: {
    color: "#D95B12",
    fontSize: "0.8rem",
    fontWeight: 600,
  },
  checkRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  imgPreview: {
    marginTop: "8px",
    width: "80px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "12px",
    border: "1px solid #F3D2B3",
  },
  modalActions: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
    marginTop: "8px",
  },
  cancelBtn: {
    padding: "11px 24px",
    borderRadius: "12px",
    border: "1.5px solid #F3D2B3",
    backgroundColor: "transparent",
    color: "#70503C",
    fontWeight: 700,
    fontSize: "0.92rem",
    cursor: "pointer",
  },
  submitBtn: {
    padding: "11px 28px",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#F57C00",
    color: "#FFFFFF",
    fontWeight: 700,
    fontSize: "0.92rem",
    cursor: "pointer",
  },
}
