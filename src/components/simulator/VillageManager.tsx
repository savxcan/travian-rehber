"use client"

import { useEffect, useState } from "react"

type Village = {
  id: number
  name: string
  x: number
  y: number
  type: "saldiran" | "hedef"
}

const STORAGE_KEY = "travian_villages"

export default function VillageManager({ onChange }: { onChange?: (v: Village[]) => void }) {
  const [villages, setVillages] = useState<Village[]>([])
  const [name, setName] = useState("")
  const [x, setX] = useState("")
  const [y, setY] = useState("")
  const [type, setType] = useState<"saldiran" | "hedef">("saldiran")

  // 🔥 LOAD (sayfa açıldığında)
  useEffect(() => {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      const parsed = JSON.parse(data)
      setVillages(parsed)
      onChange && onChange(parsed) // dışarıya veri gönder
    }
  }, [])

  // 🔥 SAVE + dışarı gönder
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(villages))
    onChange && onChange(villages)
  }, [villages])

  const addVillage = () => {
    if (!name || !x || !y) {
      alert("Tüm alanları doldur")
      return
    }

    const newVillage: Village = {
      id: Date.now(),
      name,
      x: parseInt(x),
      y: parseInt(y),
      type
    }

    setVillages(prev => [...prev, newVillage])

    // form temizle
    setName("")
    setX("")
    setY("")
  }

  const deleteVillage = (id: number) => {
    setVillages(prev => prev.filter(v => v.id !== id))
  }

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>🏘️ Köy Yönetimi</h3>

      {/* FORM */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginTop: "10px"
        }}
      >
        <input
          placeholder="İsim"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <input
          placeholder="X"
          value={x}
          onChange={e => setX(e.target.value)}
        />

        <input
          placeholder="Y"
          value={y}
          onChange={e => setY(e.target.value)}
        />

        <select
          value={type}
          onChange={e => setType(e.target.value as "saldiran" | "hedef")}
        >
          <option value="saldiran">Saldıran</option>
          <option value="hedef">Hedef</option>
        </select>

        <button className="btn" onClick={addVillage}>
          Ekle
        </button>
      </div>

      {/* LİSTE */}
      <div style={{ marginTop: "20px" }}>
        {villages.length === 0 && (
          <p style={{ color: "#888" }}>Henüz köy eklenmedi</p>
        )}

        {villages.map(v => (
          <div
            key={v.id}
            style={{
              background: "#111827",
              padding: "10px",
              borderRadius: "10px",
              marginBottom: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <span>
              {v.name} ({v.x}|{v.y}) - {v.type}
            </span>

            <button
              onClick={() => deleteVillage(v.id)}
              style={{
                background: "#c0392b",
                border: "none",
                color: "white",
                padding: "5px 10px",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              Sil
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}