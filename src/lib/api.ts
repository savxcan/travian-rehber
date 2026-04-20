const API_URL = "http://localhost:5000"

export async function apiLogin(email: string, password: string) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })

  const data = await res.json()

  if (!res.ok) throw new Error(data.error)

  // 🔥 TOKEN KAYDET
  localStorage.setItem("token", data.token)
  localStorage.setItem("user", JSON.stringify(data.user))

  return data.user
}

export async function apiRegister(
  email: string,
  password: string,
  server: string,
  nickname: string
) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, server, nickname })
  })

  const data = await res.json()

  if (!res.ok) throw new Error(data.error)

  // 🔥 TOKEN KAYDET
  localStorage.setItem("token", data.token)
  localStorage.setItem("user", JSON.stringify(data.user))

  return data.user
}

// 🔒 AUTH GET
export async function apiMe() {
  const token = localStorage.getItem("token")

  const res = await fetch(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const data = await res.json()

  if (!res.ok) throw new Error(data.error)

  return data
}