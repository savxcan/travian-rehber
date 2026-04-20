"use client"

import { useState } from "react"
import { apiLogin, apiRegister } from "../lib/api"

export default function Auth({ onLogin }: { onLogin: (user: any) => void }) {
  const [isLogin, setIsLogin] = useState(true)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [server, setServer] = useState("tr1")
  const [nickname, setNickname] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!email || !password) {
      return alert("Email ve şifre zorunlu")
    }

    if (!isLogin && (!server || !nickname)) {
      return alert("Server ve isim zorunlu")
    }

    try {
      setLoading(true)

      let user

      if (isLogin) {
        user = await apiLogin(email, password)
      } else {
        await apiRegister(email, password, server, nickname)
        user = await apiLogin(email, password)
      }

      // 🔥 SESSION
      localStorage.setItem("user", JSON.stringify(user))

      onLogin(user)
    } catch (err: any) {
      alert(err.message || "Hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="card"
      style={{ maxWidth: "420px", margin: "120px auto", textAlign: "center" }}
    >
      <h2 style={{ marginBottom: "15px" }}>
        {isLogin ? "🔐 Giriş Yap" : "📝 Kayıt Ol"}
      </h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ marginBottom: "10px" }}
      />

      <input
        type="password"
        placeholder="Şifre"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ marginBottom: "10px" }}
      />

      {!isLogin && (
        <>
          <select
            value={server}
            onChange={(e) => setServer(e.target.value)}
            style={{ marginBottom: "10px" }}
          >
            <option value="tr1">TR1</option>
            <option value="tr2">TR2</option>
            <option value="tr3">TR3</option>
          </select>

          <input
            placeholder="Avatar Adı"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            style={{ marginBottom: "10px" }}
          />
        </>
      )}

      <button
        className="btn"
        onClick={handleSubmit}
        disabled={loading}
        style={{ width: "100%" }}
      >
        {loading ? "Bekle..." : isLogin ? "Giriş Yap" : "Kayıt Ol"}
      </button>

      <p
        style={{ marginTop: "12px", cursor: "pointer", opacity: 0.7 }}
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin
          ? "Hesabın yok mu? Kayıt ol"
          : "Zaten hesabın var mı? Giriş yap"}
      </p>
    </div>
  )
}