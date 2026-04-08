const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

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
        throw new Error("UNAUTHORIZED")
    }

    if (!response.ok) {
        try {
            const error = await response.json()
            const errorMsg = error.detail || error.message || JSON.stringify(error)
            throw new Error(errorMsg)
        } catch {
            const text = await response.text()
            throw new Error(text || `Request gagal (${response.status})`)
        }
    }

    if (response.status === 204) return null

    return response.json()
}

// ==================== AUTH API ====================

export async function register(userData) {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
    })

    return handleResponse(response)
}

export async function login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    })

    const data = await handleResponse(response)

    // 🔥 simpan token
    setToken(data.access_token)

    return data
}

export async function getMe() {
    const response = await fetch(`${API_URL}/auth/me`, {
        headers: authHeaders(),
    })

    return handleResponse(response)
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