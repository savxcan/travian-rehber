"use client"

import { useEffect, useState } from "react"
import { apiGetUsers, apiUpdateRole, apiCreateGuide } from "../../lib/api"

export default function AdminPage() {

  const [users, setUsers] = useState<any[]>([])

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("genel")

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    try {
      const data = await apiGetUsers()
      setUsers(data)
    } catch (err: any) {
      alert(err.message)
    }
  }

  const changeRole = async (id: number, role: string) => {
    try {
      await apiUpdateRole(id, role)
      load()
    } catch (err: any) {
      alert(err.message)
    }
  }

  const createGuide = async () => {
    if (!title || !content) {
      return alert("Boş bırakma")
    }

    try {
      await apiCreateGuide(title, content, category)
      alert("Eklendi")
      setTitle("")
      setContent("")
    } catch (err: any) {
      alert(err.message)
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>👑 Admin Panel</h2>

      {/* USERS */}
      <h3>Kullanıcılar</h3>

      {users.map(u => (
        <div key={u.id} style={{ marginBottom: 10 }}>
          {u.email} - {u.role}

          <button onClick={() => changeRole(u.id, "ADMIN")}>
            Admin
          </button>

          <button onClick={() => changeRole(u.id, "EDITOR")}>
            Editor
          </button>

          <button onClick={() => changeRole(u.id, "USER")}>
            User
          </button>
        </div>
      ))}

      <hr style={{ margin: "30px 0" }} />

      {/* GUIDE */}
      <h3>📚 Rehber Ekle</h3>

      <input
        placeholder="Başlık"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="İçerik"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="genel">Genel</option>
        <option value="roma">Roma</option>
        <option value="cermen">Cermen</option>
        <option value="galya">Galya</option>
      </select>

      <button onClick={createGuide}>Ekle</button>
    </div>
  )
}