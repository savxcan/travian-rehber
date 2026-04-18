"use client"

import { useState } from "react"

type Village = {
  id: number
  name: string
  x: number
  y: number
  type: "saldiran" | "hedef"
}

export default function AttackForm({ villages }: { villages: Village[] }) {
  const [attackerId, setAttackerId] = useState<number | null>(null)
  const [targetId, setTargetId] = useState<number | null>(null)
  const [speed, setSpeed] = useState(6)

  const attacker = villages.find(v => v.id === attackerId)
  const target = villages.find(v => v.id === targetId)

  const calculateDistance = () => {
    if (!attacker || !target) return 0
    const dx = attacker.x - target.x
    const dy = attacker.y - target.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  const calculateTime = () => {
    const distance = calculateDistance()
    if (!distance || !speed) return 0
    return distance / speed
  }

  return (
    <div style={{marginTop: "30px"}}>
      <h3>⚔️ Saldırı Oluştur</h3>

      <div style={{display: "flex", gap: "10px", flexWrap: "wrap"}}>
        
        {/* SALDIRAN */}
        <select onChange={e => setAttackerId(Number(e.target.value))}>
          <option>-- Saldıran Seç --</option>
          {villages.filter(v => v.type === "saldiran").map(v => (
            <option key={v.id} value={v.id}>
              {v.name} ({v.x}|{v.y})
            </option>
          ))}
        </select>

        {/* HEDEF */}
        <select onChange={e => setTargetId(Number(e.target.value))}>
          <option>-- Hedef Seç --</option>
          {villages.filter(v => v.type === "hedef").map(v => (
            <option key={v.id} value={v.id}>
              {v.name} ({v.x}|{v.y})
            </option>
          ))}
        </select>

        {/* HIZ */}
        <input
          type="number"
          value={speed}
          onChange={e => setSpeed(Number(e.target.value))}
          placeholder="Hız"
        />
      </div>

      {/* SONUÇ */}
      <div style={{marginTop: "15px"}}>
        <p>📏 Mesafe: {calculateDistance().toFixed(2)}</p>
        <p>⏱️ Süre (saat): {calculateTime().toFixed(2)}</p>
      </div>
    </div>
  )
}