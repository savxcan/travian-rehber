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
  const [turnuva, setTurnuva] = useState(0)

  const attacker = villages.find(v => v.id === attackerId)
  const target = villages.find(v => v.id === targetId)

  // 📏 MESAFE
  const calculateDistance = () => {
    if (!attacker || !target) return 0
    const dx = attacker.x - target.x
    const dy = attacker.y - target.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  // ⏱️ SÜRE (TRAVIAN FORMÜLÜ)
  const calculateTime = () => {
    const distance = calculateDistance()
    if (!distance || !speed) return 0

    let hours = 0

    if (distance <= 20) {
      hours = distance / speed
    } else {
      const base = 20 / speed
      const bonusSpeed = speed * (1 + turnuva * 0.1)
      const extra = (distance - 20) / bonusSpeed
      hours = base + extra
    }

    return hours
  }

  // ⏱️ SAAT → HMS FORMAT
  const formatTime = (hours: number) => {
    const totalSeconds = Math.floor(hours * 3600)

    const h = Math.floor(totalSeconds / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)
    const s = totalSeconds % 60

    return `${h}s ${m}d ${s}sn`
  }

  const distance = calculateDistance()
  const time = calculateTime()

  return (
    <div style={{ marginTop: "30px" }}>
      <h3>⚔️ Saldırı Oluştur</h3>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        
        {/* SALDIRAN */}
        <select
          value={attackerId ?? ""}
          onChange={e => setAttackerId(Number(e.target.value))}
        >
          <option value="">-- Saldıran Seç --</option>
          {villages
            .filter(v => v.type === "saldiran")
            .map(v => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.x}|{v.y})
              </option>
            ))}
        </select>

        {/* HEDEF */}
        <select
          value={targetId ?? ""}
          onChange={e => setTargetId(Number(e.target.value))}
        >
          <option value="">-- Hedef Seç --</option>
          {villages
            .filter(v => v.type === "hedef")
            .map(v => (
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
          placeholder="Asker Hızı"
        />

        {/* TURNUVA */}
        <input
          type="number"
          value={turnuva}
          onChange={e => setTurnuva(Number(e.target.value))}
          placeholder="Turnuva Seviyesi"
        />
      </div>

      {/* SONUÇ */}
      <div style={{ marginTop: "15px" }}>
        <p>📏 Mesafe: {distance.toFixed(2)}</p>

        <p>⏱️ Süre (saat): {time.toFixed(2)}</p>

        <p>🕒 Süre (detaylı): {formatTime(time)}</p>
      </div>
    </div>
  )
}