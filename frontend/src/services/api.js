export const API_URL = import.meta.env.VITE_API_URL || "http://localhost"

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

export async function fetchItemDetail(id) {
    const response = await fetch(`${API_URL}/products/${id}`, {
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

// ==================== CART API ====================

export async function fetchCart() {
    const response = await fetch(`${API_URL}/cart`, {
        headers: authHeaders(),
    })
    return handleResponse(response)
}

export async function addToCart(productId, quantity = 1) {
    const response = await fetch(`${API_URL}/cart/items`, {
        method: "POST",
        headers: {
            ...authHeaders(),
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ product_id: productId, quantity }),
    })
    return handleResponse(response)
}

export async function updateCartItem(itemId, quantity) {
    const response = await fetch(`${API_URL}/cart/items/${itemId}`, {
        method: "PUT",
        headers: {
            ...authHeaders(),
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
    })
    return handleResponse(response)
}

export async function removeFromCart(itemId) {
    const response = await fetch(`${API_URL}/cart/items/${itemId}`, {
        method: "DELETE",
        headers: authHeaders(),
    })
    return handleResponse(response)
}

// ==================== ORDERS API ====================

export async function createOrder(orderData) {
    const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
            ...authHeaders(),
            "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
    })
    return handleResponse(response)
}

export async function fetchMyOrders(skip = 0, limit = 20) {
    const params = new URLSearchParams({ skip, limit })
    const response = await fetch(`${API_URL}/orders?${params}`, {
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

export async function getOrderDetail(orderId) {
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
        headers: authHeaders(),
    })
    return handleResponse(response)
}

export async function getOrderItems(orderId) {
    const response = await fetch(`${API_URL}/orders/${orderId}/items`, {
        headers: authHeaders(),
    })
    return handleResponse(response)
}

export async function confirmOrder(orderId) {
    const response = await fetch(`${API_URL}/orders/${orderId}/confirm`, {
        method: "PUT",
        headers: authHeaders(),
    })
    return handleResponse(response)
}

export async function completePayment(orderId) {
    const response = await fetch(`${API_URL}/orders/${orderId}/complete-payment`, {
        method: "PUT",
        headers: authHeaders(),
    })
    return handleResponse(response)
}

export async function createPayment(paymentData) {
    const response = await fetch(`${API_URL}/payments`, {
        method: "POST",
        headers: {
            ...authHeaders(),
            "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
    })
    return handleResponse(response)
}

export async function getPaymentsByOrder(orderId) {
    const params = new URLSearchParams({ order_id: orderId })
    const response = await fetch(`${API_URL}/payments?${params}`, {
        headers: authHeaders(),
    })
    return handleResponse(response)
}

export async function createTestimonial(testimonialData) {
    const response = await fetch(`${API_URL}/testimonials`, {
        method: "POST",
        headers: {
            ...authHeaders(),
            "Content-Type": "application/json",
        },
        body: JSON.stringify(testimonialData),
    })
    return handleResponse(response)
}

export async function getMyTestimonials() {
    const response = await fetch(`${API_URL}/testimonials/my-testimonials`, {
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