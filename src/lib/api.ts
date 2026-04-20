const API_URL = "http://localhost:5000"

// 🔧 GENEL REQUEST HELPER
async function request(path: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined"
    ? localStorage.getItem("token")
    : null

  const headers: any = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || "API hatası")
  }

  return data
}

// 🔐 LOGIN
export async function apiLogin(email: string, password: string) {
  const data = await request("/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  })

  localStorage.setItem("token", data.token)
  localStorage.setItem("user", JSON.stringify(data.user))

  return data.user
}

// 📝 REGISTER
export async function apiRegister(
  email: string,
  password: string,
  server: string,
  nickname: string
) {
  const data = await request("/register", {
    method: "POST",
    body: JSON.stringify({ email, password, server, nickname })
  })

  localStorage.setItem("token", data.token)
  localStorage.setItem("user", JSON.stringify(data.user))

  return data.user
}

// 🔒 CURRENT USER (TOKEN TEST)
export async function apiMe() {
  return await request("/me")
}

// 🚪 LOGOUT
export function apiLogout() {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
}

// 👥 ADMIN - TÜM KULLANICILAR
export async function apiGetUsers() {
  return await request("/admin/users")
}

// 🔄 ADMIN - ROLE GÜNCELLE
export async function apiUpdateRole(userId: number, role: string) {
  return await request("/admin/role", {
    method: "POST",
    body: JSON.stringify({ userId, role })
  })
}