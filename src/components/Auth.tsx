"use client"

import { useState } from "react"
import { login, register } from "../lib/auth"

export default function Auth({ onLogin }: { onLogin: () => void }) {
  const [isLogin, setIsLogin] = useState(true)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [server, setServer] = useState("tr1")
  const [nickname, setNickname] = useState("")

  const [loading, setLoading] = useState(false)

  const handleSubmit = () => {
    if (!email || !password) {
      return alert("Email ve şifre zorunlu")
    }

    if (!isLogin && (!server || !nickname)) {
      return alert("Server ve avatar adı zorunlu")
    }

    try {
      setLoading(true)

      if (isLogin) {
        login(email, password)
      } else {
        register({
          email,
          password,
          server,
          nickname
        })

        // kayıt sonrası direkt login
        login(email, password)
      }

      onLogin()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="card"
      style={{
        maxWidth: "420px",
        margin: "120px auto",
        textAlign: "center"
      }}
    >
      <h2 style={{ marginBottom: "15px" }}>
        {isLogin ? "🔐 Giriş Yap" : "📝 Kayıt Ol"}
      </h2>

      {/* EMAIL */}
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ marginBottom: "10px" }}
      />

      {/* PASSWORD */}
      <input
        type="password"
        placeholder="Şifre"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ marginBottom: "10px" }}
      />

      {/* REGISTER EXTRA */}
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

      {/* BUTTON */}
      <button
        className="btn"
        onClick={handleSubmit}
        disabled={loading}
        style={{ width: "100%" }}
      >
        {loading
          ? "Bekle..."
          : isLogin
          ? "Giriş Yap"
          : "Kayıt Ol"}
      </button>

      {/* SWITCH */}
      <p
        style={{
          marginTop: "12px",
          cursor: "pointer",
          opacity: 0.7
        }}
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin
          ? "Hesabın yok mu? Kayıt ol"
          : "Zaten hesabın var mı? Giriş yap"}
      </p>
    </div>
  )
}