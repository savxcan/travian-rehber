"use client"

import { useState } from "react"

type Village = {
  id: number
  name: string
  x: number
  y: number
  type: "saldiran" | "hedef"
}

export default function AttackForm({
  villages,
  onAddAttack
}: {
  villages: Village[]
  onAddAttack: (attack: any) => void
}) {
  const [attackerId, setAttackerId] = useState<number | null>(null)
  const [targetId, setTargetId] = useState<number | null>(null)
  const [speed, setSpeed] = useState(6)
  const [turnuva, setTurnuva] = useState(0)

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

    if (distance <= 20) {
      return distance / speed
    } else {
      const base = 20 / speed
      const bonusSpeed = speed * (1 + turnuva * 0.1)
      const extra = (distance - 20) / bonusSpeed
      return base + extra
    }
  }

  const addAttack = () => {
    if (!attacker || !target) {
      alert("Köy seç")
      return
    }

    const distance = calculateDistance()
    const duration = calculateTime()

    const arrivalDate = new Date()
    const departureDate = new Date(arrivalDate.getTime() - duration * 3600 * 1000)

    onAddAttack({
      id: Date.now(),
      attacker: attacker.name,
      target: target.name,
      distance,
      duration,
      arrival: arrivalDate.toLocaleString(),
      departure: departureDate.toLocaleString()
    })
  }

  return (
    <div style={{ marginTop: "30px" }}>
      <h3>⚔️ Saldırı Oluştur</h3>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <select value={attackerId ?? ""} onChange={e => setAttackerId(Number(e.target.value))}>
          <option value="">-- Saldıran --</option>
          {villages.filter(v => v.type === "saldiran").map(v => (
            <option key={v.id} value={v.id}>
              {v.name} ({v.x}|{v.y})
            </option>
          ))}
        </select>

        <select value={targetId ?? ""} onChange={e => setTargetId(Number(e.target.value))}>
          <option value="">-- Hedef --</option>
          {villages.filter(v => v.type === "hedef").map(v => (
            <option key={v.id} value={v.id}>
              {v.name} ({v.x}|{v.y})
            </option>
          ))}
        </select>

        <input type="number" value={speed} onChange={e => setSpeed(Number(e.target.value))} />
        <input type="number" value={turnuva} onChange={e => setTurnuva(Number(e.target.value))} />
      </div>

      <button className="btn" onClick={addAttack} style={{ marginTop: "10px" }}>
        Saldırıyı Ekle
      </button>

      <div style={{ marginTop: "10px" }}>
        <p>Mesafe: {calculateDistance().toFixed(2)}</p>
        <p>Süre: {calculateTime().toFixed(2)} saat</p>
      </div>
    </div>
  )
}