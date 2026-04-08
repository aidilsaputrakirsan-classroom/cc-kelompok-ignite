import { useState } from "react"
import { toast } from "react-toastify"

function ItemForm({ onSuccess }) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "makanan",
        slug: "",
        price: "",
        stock: "0",
        image_url: "",
        is_active: true,
    })
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        // Validasi
        if (!formData.name.trim()) {
            setError("Nama produk wajib diisi")
            return
        }
        if (!formData.price || parseFloat(formData.price) <= 0) {
            setError("Harga harus lebih dari 0")
            return
        }

        const productData = {
            name: formData.name.trim(),
            description: formData.description.trim() || null,
            category: formData.category,
            slug: formData.slug.trim() || null,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock) || 0,
            image_url: formData.image_url.trim() || null,
            is_active: formData.is_active,
        }

        setLoading(true)
        try {
            // This will be handled by the parent component
            console.log("Product data to submit:", productData)
            
            // Reset form setelah berhasil
            setFormData({
                name: "",
                description: "",
                category: "makanan",
                slug: "",
                price: "",
                stock: "0",
                image_url: "",
                is_active: true,
            })
            
            toast.success("✅ Produk berhasil ditambahkan!", { position: "top-center" })
            onSuccess?.()
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : String(err)
            setError(errorMsg)
            toast.error(`❌ ${errorMsg}`, { position: "top-center" })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={styles.container}>
            <h3 style={styles.title}>➕ Tambah Produk Baru</h3>

            {error && <div style={styles.error}>{error}</div>}

            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.grid}>
                    <div style={styles.field}>
                        <label style={styles.label}>Nama Produk *</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Contoh: Amplang Balikpapan"
                            style={styles.input}
                            disabled={loading}
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Harga (Rp) *</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="Contoh: 25000"
                            min="0"
                            step="100"
                            style={styles.input}
                            disabled={loading}
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Kategori</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            style={styles.input}
                            disabled={loading}
                        >
                            <option value="makanan">Makanan</option>
                            <option value="minuman">Minuman</option>
                            <option value="snack">Snack</option>
                            <option value="lainnya">Lainnya</option>
                        </select>
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>Stok</label>
                        <input
                            type="number"
                            name="stock"
                            value={formData.stock}
                            onChange={handleChange}
                            min="0"
                            style={styles.input}
                            disabled={loading}
                        />
                    </div>
                </div>

                <div style={styles.field}>
                    <label style={styles.label}>Deskripsi</label>
                    <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Opsional"
                        style={styles.input}
                        disabled={loading}
                    />
                </div>

                <div style={styles.grid}>
                    <div style={styles.field}>
                        <label style={styles.label}>Slug (URL-friendly name)</label>
                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            placeholder="Contoh: amplang-balikpapan"
                            style={styles.input}
                            disabled={loading}
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>URL Gambar</label>
                        <input
                            type="url"
                            name="image_url"
                            value={formData.image_url}
                            onChange={handleChange}
                            placeholder="https://example.com/image.jpg"
                            style={styles.input}
                            disabled={loading}
                        />
                    </div>
                </div>

                <div style={styles.checkboxField}>
                    <input
                        type="checkbox"
                        id="is_active"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleChange}
                        style={styles.checkbox}
                        disabled={loading}
                    />
                    <label htmlFor="is_active" style={styles.checkboxLabel}>Aktif</label>
                </div>

                <button
                    type="submit"
                    style={{ ...styles.btnSubmit, opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer" }}
                    disabled={loading}
                >
                    {loading ? "⏳ Menyimpan..." : "✅ Tambah Produk"}
                </button>
            </form>
        </div>
    )
}

const styles = {
    container: {
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        marginBottom: "20px",
    },
    title: {
        margin: "0 0 20px 0",
        color: "#333",
        fontSize: "18px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "15px",
    },
    field: {
        display: "flex",
        flexDirection: "column",
        gap: "5px",
    },
    label: {
        fontSize: "14px",
        fontWeight: "bold",
        color: "#555",
    },
    input: {
        padding: "8px 12px",
        border: "1px solid #ddd",
        borderRadius: "4px",
        fontSize: "14px",
        outline: "none",
        fontFamily: "inherit",
    },
    checkboxField: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },
    checkbox: {
        width: "18px",
        height: "18px",
        cursor: "pointer",
    },
    checkboxLabel: {
        fontSize: "14px",
        fontWeight: "bold",
        color: "#555",
        cursor: "pointer",
    },
    error: {
        backgroundColor: "#FBE5D6",
        color: "#C00000",
        padding: "10px 12px",
        borderRadius: "4px",
        marginBottom: "10px",
        fontSize: "14px",
        border: "1px solid #C00000",
    },
    btnSubmit: {
        padding: "10px 20px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "bold",
        marginTop: "10px",
    },
}

export default ItemForm
