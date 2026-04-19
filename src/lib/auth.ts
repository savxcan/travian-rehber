export type User = {
  email: string
  password: string
  server: string
  nickname: string
}

const USERS_KEY = "travian_users"
const SESSION_KEY = "travian_session"

// 🔥 REGISTER
export function register(user: User) {
  const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]")

  const exists = users.find(u => u.email === user.email)
  if (exists) {
    throw new Error("Bu email zaten kayıtlı")
  }

  users.push(user)
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

// 🔥 LOGIN
export function login(email: string, password: string) {
  const users: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || "[]")

  const user = users.find(
    u => u.email === email && u.password === password
  )

  if (!user) {
    throw new Error("Email veya şifre yanlış")
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(user))
}

// 🔥 GET USER
export function getUser(): User | null {
  try {
    const data = localStorage.getItem(SESSION_KEY)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

// 🔥 LOGOUT
export function logout() {
  localStorage.removeItem(SESSION_KEY)
}