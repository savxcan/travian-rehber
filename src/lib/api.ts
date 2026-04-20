const API = "http://localhost:5000"

async function request(path: string, options: any = {}) {
  const token = typeof window !== "undefined"
    ? localStorage.getItem("token")
    : null

  const res = await fetch(API + path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: "Bearer " + token } : {})
    }
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || "API hata")
  }

  return data
}

// 🔐 LOGIN
export async function apiLogin(email: string, password: string) {
  const d = await request("/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  })

  localStorage.setItem("token", d.token)
  localStorage.setItem("user", JSON.stringify(d.user))

  return d.user
}

// 📝 REGISTER
export async function apiRegister(e: string, p: string, s: string, n: string) {
  const d = await request("/register", {
    method: "POST",
    body: JSON.stringify({ email: e, password: p, server: s, nickname: n })
  })

  localStorage.setItem("token", d.token)
  localStorage.setItem("user", JSON.stringify(d.user))

  return d.user
}

// 👤 ME
export async function apiMe() {
  return request("/me")
}

// 👥 USERS
export async function apiGetUsers() {
  return request("/admin/users")
}

// 🔄 ROLE
export async function apiUpdateRole(id: number, role: string) {
  return request("/admin/role", {
    method: "POST",
    body: JSON.stringify({ userId: id, role })
  })
}

// 📚 CREATE GUIDE
export async function apiCreateGuide(t: string, c: string, cat: string) {
  return request("/admin/guide", {
    method: "POST",
    body: JSON.stringify({ title: t, content: c, category: cat })
  })
}

// 📚 GET GUIDES
export async function apiGetGuides() {
  return request("/guides")
}