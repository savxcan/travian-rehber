"use client"

import { useState } from "react"

type Village = {
  id: number
  name: string
  x: number
  y: number
  type: "saldiran" | "hedef"
}

type Attack = {
  id: number
  attacker: string
  target: string
  troop: string
  type: "real" | "fake" | "siege"
  distance: number
  duration: number
  wave: number
  arrival: string
  departure: string
}

export default function AttackForm({
  villages,
  onAddAttack
}: {
  villages: Village[]
  onAddAttack: (attack: Attack) => void
}) {

  // 🔥 TROOPS
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

  // 🔧 STATE
  const [tribe, setTribe] = useState<"roma" | "cermen" | "galya">("roma")
  const [troopIndex, setTroopIndex] = useState(0)
  const [attackerId, setAttackerId] = useState<number | null>(null)
  const [targetId, setTargetId] = useState<number | null>(null)
  const [attackType, setAttackType] = useState<"real" | "fake" | "siege">("real")
  const [wave, setWave] = useState(1)

  const attacker = villages.find(v => v.id === attackerId)
  const target = villages.find(v => v.id === targetId)
  const troop = troops[tribe][troopIndex]

  // 📏 MESAFE
  const calcDistance = () => {
    if (!attacker || !target) return 0
    const dx = attacker.x - target.x
    const dy = attacker.y - target.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  // ➕ EKLE
  const handleAdd = () => {
    if (!attacker || !target) return alert("Köy seç")

    const distance = calcDistance()
    const duration = distance / troop.speed

    const newAttack: Attack = {
      id: Date.now(),
      attacker: attacker.name,
      target: target.name,
      troop: troop.name,
      type: attackType,
      distance,
      duration,
      wave,
      arrival: "",
      departure: ""
    }

    onAddAttack(newAttack)
  }

  return (
    <div style={{ marginBottom: 20 }}>
      <h3>➕ Saldırı Ekle</h3>

      {/* ATTACKER */}
      <select onChange={e => setAttackerId(Number(e.target.value))}>
        <option>Attacker seç</option>
        {villages
          .filter(v => v.type === "saldiran")
          .map(v => (
            <option key={v.id} value={v.id}>
              {v.name} ({v.x}|{v.y})
            </option>
          ))}
      </select>

      {/* TARGET */}
      <select onChange={e => setTargetId(Number(e.target.value))}>
        <option>Target seç</option>
        {villages
          .filter(v => v.type === "hedef")
          .map(v => (
            <option key={v.id} value={v.id}>
              {v.name} ({v.x}|{v.y})
            </option>
          ))}
      </select>

      {/* TRIBE */}
      <select onChange={e => setTribe(e.target.value as any)}>
        <option value="roma">Roma</option>
        <option value="cermen">Cermen</option>
        <option value="galya">Galya</option>
      </select>

      {/* TROOP */}
      <select onChange={e => setTroopIndex(Number(e.target.value))}>
        {troops[tribe].map((t, i) => (
          <option key={i} value={i}>
            {t.name} ({t.speed})
          </option>
        ))}
      </select>

      {/* TYPE */}
      <select onChange={e => setAttackType(e.target.value as any)}>
        <option value="real">Real</option>
        <option value="fake">Fake</option>
        <option value="siege">Siege</option>
      </select>

      {/* WAVE */}
      <input
        type="number"
        value={wave}
        onChange={e => setWave(Number(e.target.value))}
        placeholder="Wave"
      />

      <button onClick={handleAdd}>Ekle</button>
    </div>
  )
}