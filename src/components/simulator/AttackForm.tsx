"use client"

import { useState } from "react"

type Village = {
  id: number
  name: string
  x: number
  y: number
  type: "saldiran" | "hedef"
}

// 🔥 TÜM ASKER HIZLARI (DOĞRU SEKTÖR)
const troops = {
  roma: [
    { name: "Lejyoner", speed: 6 },
    { name: "Pretoryan", speed: 5 },
    { name: "Emperyan", speed: 7 },
    { name: "Equites Legati", speed: 16 },
    { name: "Equites Imperatoris", speed: 14 },
    { name: "Equites Caesaris", speed: 10 },
    { name: "Koç Başı", speed: 4 },
    { name: "Mancınık", speed: 3 }
  ],

  cermen: [
    { name: "Tokmak", speed: 7 },
    { name: "Mızrakçı", speed: 7 },
    { name: "Balta", speed: 6 },
    { name: "Casus", speed: 9 },
    { name: "Paladin", speed: 10 },
    { name: "Toyton", speed: 9 },
    { name: "Koç Başı", speed: 4 },
    { name: "Mancınık", speed: 3 }
  ],

  galya: [
    { name: "Falanks", speed: 7 },
    { name: "Kılıçlı", speed: 6 },
    { name: "Casus", speed: 17 },
    { name: "Şimşek", speed: 19 },
    { name: "Druyid", speed: 16 },
    { name: "Heduan", speed: 13 },
    { name: "Koç Başı", speed: 4 },
    { name: "Mancınık", speed: 3 }
  ]
}

export default function AttackForm({
  villages,
  onAddAttack
}: any) {

  const [attackerId, setAttackerId] = useState<number | null>(null)
  const [targetId, setTargetId] = useState<number | null>(null)
  const [tribe, setTribe] = useState<"roma" | "cermen" | "galya">("roma")
  const [troopIndex, setTroopIndex] = useState(0)
  const [turnuva, setTurnuva] = useState(0)
  const [arrivalTime, setArrivalTime] = useState("")

  const attacker = villages.find((v: any) => v.id === attackerId)
  const target = villages.find((v: any) => v.id === targetId)

  const selectedTroop = troops[tribe][troopIndex]
  const speed = selectedTroop.speed

  const calculateDistance = () => {
    if (!attacker || !target) return 0
    const dx = attacker.x - target.x
    const dy = attacker.y - target.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  const calculateTime = () => {
    const distance = calculateDistance()

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
  if (!attacker || !target) return alert("Köy seç")
  if (!arrivalTime) return alert("Varış zamanı gir")

  const distance = calculateDistance()
  const duration = calculateTime()

  const arrivalDate = new Date(arrivalTime)

  const departureDate = new Date(
    arrivalDate.getTime() - duration * 3600 * 1000
  )

  onAddAttack({
    id: Date.now(),
    attacker: attacker.name,
    target: target.name,
    troop: selectedTroop.name,
    speed,
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

        {/* KÖYLER */}
        <select onChange={e => setAttackerId(Number(e.target.value))}>
          <option>-- Saldıran --</option>
          {villages.filter((v: any) => v.type === "saldiran").map((v: any) => (
            <option key={v.id} value={v.id}>{v.name}</option>
          ))}
        </select>

        <select onChange={e => setTargetId(Number(e.target.value))}>
          <option>-- Hedef --</option>
          {villages.filter((v: any) => v.type === "hedef").map((v: any) => (
            <option key={v.id} value={v.id}>{v.name}</option>
          ))}
        </select>

        {/* KABİLE */}
        <select onChange={e => setTribe(e.target.value as any)}>
          <option value="roma">Roma</option>
          <option value="cermen">Cermen</option>
          <option value="galya">Galya</option>
        </select>

        {/* ASKER */}
        <select onChange={e => setTroopIndex(Number(e.target.value))}>
          {troops[tribe].map((t, i) => (
            <option key={i} value={i}>
              {t.name} ({t.speed})
            </option>
          ))}
        </select>

        {/* TURNUVA */}
        <input
          type="number"
          value={turnuva}
          onChange={e => setTurnuva(Number(e.target.value))}
          placeholder="Turnuva"
        />
		<input
          type="datetime-local"
          value={arrivalTime}
          onChange={e => setArrivalTime(e.target.value)}
        />
      </div>

      <button className="btn" onClick={addAttack} style={{ marginTop: "10px" }}>
        Saldırıyı Ekle
      </button>

      <div style={{ marginTop: "10px" }}>
        <p>Hız: {speed}</p>
        <p>Mesafe: {calculateDistance().toFixed(2)}</p>
        <p>Süre: {calculateTime().toFixed(2)} saat</p>
      </div>
    </div>
  )
}