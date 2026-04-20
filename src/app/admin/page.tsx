"use client"

import { useEffect, useState } from "react"
import { apiGetUsers, apiUpdateRole } from "../../lib/api"
import { useRouter } from "next/navigation"

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/auth")
      return
    }

    load()
  }, [])

  const load = async () => {
    const data = await apiGetUsers()
    setUsers(data)
  }

  const changeRole = async (id: number, role: string) => {
    await apiUpdateRole(id, role)
    load()
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>👑 Admin Panel</h2>

      <table style={{ width: "100%", marginTop: 20 }}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Nick</th>
            <th>Server</th>
            <th>Rol</th>
            <th>İşlem</th>
          </tr>
        </thead>

        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.email}</td>
              <td>{u.nickname}</td>
              <td>{u.server}</td>
              <td>{u.role}</td>
              <td>
                <button onClick={() => changeRole(u.id, "ADMIN")}>
                  Admin
                </button>
                <button onClick={() => changeRole(u.id, "EDITOR")}>
                  Editor
                </button>
                <button onClick={() => changeRole(u.id, "USER")}>
                  User
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}