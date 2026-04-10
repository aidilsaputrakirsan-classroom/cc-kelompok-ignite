export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

// ==================== TOKEN MANAGEMENT ====================

export function setToken(token) {
    localStorage.setItem("token", token)
}

export function getToken() {
    return localStorage.getItem("token")
}

export function clearToken() {
    localStorage.removeItem("token")
}

function authHeaders() {
    const headers = {}
    const token = getToken()

    if (token) {
        headers["Authorization"] = `Bearer ${token}`
    }

    return headers
}

// ==================== HELPER ====================

async function handleResponse(response) {
    if (response.status === 401) {
        clearToken()
    }

    if (!response.ok) {
        const textData = await response.text()
        try {
            const error = JSON.parse(textData)
            let errorMsg = ""
            
            if (typeof error.detail === "string") {
                errorMsg = error.detail
            } else if (Array.isArray(error.detail)) {
                errorMsg = error.detail[0]?.msg || JSON.stringify(error.detail)
            } else if (error.message) {
                errorMsg = error.message
            } else {
                errorMsg = typeof error.detail === "object" ? JSON.stringify(error.detail) : (error.detail || JSON.stringify(error))
            }
            
            throw new Error(errorMsg)
        } catch (e) {
            if (e instanceof Error && e.message !== "Unexpected token 'u', \"un...\" is not valid JSON") {
                throw e
            }
            throw new Error(textData || `Request gagal (${response.status})`)
        }
    }

    if (response.status === 204) return null

    return response.json()
}

// ==================== AUTH API ====================

export async function register(userData) {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        })

        return handleResponse(response)
    } catch (err) {
        if (err instanceof TypeError) {
            throw new Error(
                "Gagal terhubung ke backend. Pastikan backend aktif dan alamat API sudah benar."
            )
        }
        throw err
    }
}

export async function login(email, password) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        })

        const data = await handleResponse(response)

        // 🔥 simpan token
        setToken(data.access_token)

        return data
    } catch (err) {
        if (err instanceof TypeError) {
            throw new Error(
                "Gagal terhubung ke backend. Pastikan backend aktif dan alamat API sudah benar."
            )
        }
        throw err
    }
}

export async function getMe() {
    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: authHeaders(),
        })

        return handleResponse(response)
    } catch (err) {
        if (err instanceof TypeError) {
            throw new Error(
                "Gagal terhubung ke backend. Pastikan backend aktif dan alamat API sudah benar."
            )
        }
        throw err
    }
}

// ==================== PRODUCTS API ====================

export async function fetchItems(
    search = "",
    skip = 0,
    limit = 20,
    minPrice = null,
    maxPrice = null,
    category = null
) {
    const params = new URLSearchParams()

    if (search) params.append("search", search)
    if (minPrice !== null) params.append("min_price", minPrice)
    if (maxPrice !== null) params.append("max_price", maxPrice)
    if (category) params.append("category", category)

    params.append("skip", skip)
    params.append("limit", limit)

    const response = await fetch(`${API_URL}/products?${params}`, {
        headers: authHeaders(),
    })

    return handleResponse(response)
}

export async function createItem(itemData) {
    const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
            ...authHeaders(),
            "Content-Type": "application/json",
        },
        body: JSON.stringify(itemData),
    })

    return handleResponse(response)
}

export async function updateItem(id, itemData) {
    const response = await fetch(`${API_URL}/products/${id}`, {
        method: "PUT",
        headers: {
            ...authHeaders(),
            "Content-Type": "application/json",
        },
        body: JSON.stringify(itemData),
    })

    return handleResponse(response)
}

export async function deleteItem(id) {
    const response = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
    })

    return handleResponse(response)
}

// ==================== ADMIN STATS API ====================

export async function fetchProductStats() {
    const response = await fetch(`${API_URL}/products/stats`, {
        headers: authHeaders(),
    })
    return handleResponse(response)
}

export async function fetchAllOrders(skip = 0, limit = 100) {
    const params = new URLSearchParams({ skip, limit })
    const response = await fetch(`${API_URL}/orders/admin/all?${params}`, {
        headers: authHeaders(),
    })
    return handleResponse(response)
}

export async function updateOrderStatus(orderId, status) {
    const response = await fetch(`${API_URL}/orders/${orderId}?status=${status}`, {
        method: "PUT",
        headers: authHeaders(),
    })
    return handleResponse(response)
}

export async function deleteOrder(orderId) {
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
        method: "DELETE",
        headers: authHeaders(),
    })
    return handleResponse(response)
}

export async function fetchAllPayments(skip = 0, limit = 100) {
    const params = new URLSearchParams({ skip, limit })
    const response = await fetch(`${API_URL}/payments?${params}`, {
        headers: authHeaders(),
    })
    return handleResponse(response)
}

export async function fetchAllCustomers(search = "", skip = 0, limit = 100) {
    const params = new URLSearchParams()
    if (search) params.append("search", search)
    params.append("skip", skip)
    params.append("limit", limit)

    const response = await fetch(`${API_URL}/users?${params}`, {
        headers: authHeaders(),
    })
    return handleResponse(response)
}

export async function fetchAllTestimonials(skip = 0, limit = 100) {
    const params = new URLSearchParams({ skip, limit })
    const response = await fetch(`${API_URL}/admin/testimonials?${params}`, {
        headers: authHeaders(),
    })
    return handleResponse(response)
}

export async function toggleTestimonialVisibility(testimonialId) {
    const response = await fetch(`${API_URL}/testimonials/${testimonialId}/toggle-visibility`, {
        method: "PUT",
        headers: authHeaders(),
    })
    return handleResponse(response)
}

export async function deleteTestimonial(testimonialId) {
    const response = await fetch(`${API_URL}/testimonials/${testimonialId}`, {
        method: "DELETE",
        headers: authHeaders(),
    })
    return response.status === 204 ? true : handleResponse(response)
}

export async function updatePaymentStatus(paymentId, status) {
    const response = await fetch(`${API_URL}/payments/${paymentId}?payment_status=${status}`, {
        method: "PUT",
        headers: authHeaders(),
    })
    return handleResponse(response)
}

// ==================== HEALTH CHECK ====================

export async function checkHealth() {
    try {
        const response = await fetch(`${API_URL}/health`)
        const data = await response.json()
        return data.status === "healthy"
    } catch {
        return false
    }
}

// ==================== FILE UPLOAD ====================

export async function uploadImage(file) {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(`${API_URL}/upload-image`, {
        method: "POST",
        body: formData,
    })

    return handleResponse(response)
}