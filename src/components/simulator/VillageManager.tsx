"use client"

import { useState } from "react"

type Village = {
  id: number
  name: string
  x: number
  y: number
  type: "saldiran" | "hedef"
}

export default function VillageManager() {
  const [villages, setVillages] = useState<Village[]>([])
  const [name, setName] = useState("")
  const [x, setX] = useState("")
  const [y, setY] = useState("")
  const [type, setType] = useState<"saldiran" | "hedef">("saldiran")

  const addVillage = () => {
    if (!name || !x || !y) return alert("Alanları doldur")

    const newVillage: Village = {
      id: Date.now(),
      name,
      x: parseInt(x),
      y: parseInt(y),
      type
    }

    setVillages([...villages, newVillage])
    setName("")
    setX("")
    setY("")
  }

  const deleteVillage = (id: number) => {
    setVillages(villages.filter(v => v.id !== id))
  }

  return (
    <div style={{marginTop: "20px"}}>
      <h3>🏘️ Köy Yönetimi</h3>

      {/* FORM */}
      <div style={{
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
        marginTop: "10px"
      }}>
        <input placeholder="İsim" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="X" value={x} onChange={e => setX(e.target.value)} />
        <input placeholder="Y" value={y} onChange={e => setY(e.target.value)} />

        <select value={type} onChange={e => setType(e.target.value as any)}>
          <option value="saldiran">Saldıran</option>
          <option value="hedef">Hedef</option>
        </select>

        <button className="btn" onClick={addVillage}>Ekle</button>
      </div>

      {/* LİSTE */}
      <div style={{marginTop: "20px"}}>
        {villages.map(v => (
          <div key={v.id} style={{
            background: "#111827",
            padding: "10px",
            borderRadius: "10px",
            marginBottom: "10px",
            display: "flex",
            justifyContent: "space-between"
          }}>
            <span>
              {v.name} ({v.x}|{v.y}) - {v.type}
            </span>

            <button onClick={() => deleteVillage(v.id)}>❌</button>
          </div>
        ))}
      </div>
    </div>
  )
}