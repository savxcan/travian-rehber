"use client"

import React, { useEffect, useMemo, useState } from "react"

const STORAGE_KEY = "travian_full_villages_v2"

// ================= TYPES =================
type Village = {
  id: number
  name: string
  x: number
  y: number
  type: "saldiran" | "hedef"
}

type Attack = {
  id: number
  attackerId: number
  targetId: number
  attackerName: string
  targetName: string
  troop: string
  speed: number
  distance: number
  duration: number // saat
  type: "real" | "fake" | "siege"
  wave: number
  arrival: string
  departure: string
}

// ================= MAIN =================
export default function SimulatorLayout() {

  const [villages, setVillages] = useState<Village[]>([])
  const [attacks, setAttacks] = useState<Attack[]>([])
  const [arrivalInput, setArrivalInput] = useState("")
  const [offsetMin, setOffsetMin] = useState(1)

  // LOAD
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed && typeof parsed === "object") {
          if (Array.isArray(parsed.villages)) setVillages(parsed.villages)
          if (Array.isArray(parsed.attacks)) setAttacks(parsed.attacks)
        }
      }
    } catch (e) {
      console.error("LOAD ERROR", e)
    }
  }, [])

  // SAVE
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ villages, attacks }))
    } catch (e) {
      console.error("SAVE ERROR", e)
    }
  }, [villages, attacks])

  // HELPERS
  const getVillage = (id: number) => villages.find(v => v.id === id)

  const calcDistance = (a: Village, b: Village) => {
    const dx = a.x - b.x
    const dy = a.y - b.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  // ADD ATTACK
  const addAttack = (payload: {
    attackerId: number
    targetId: number
    troop: string
    speed: number
    type: Attack["type"]
    wave: number
  }) => {

    const attacker = getVillage(payload.attackerId)
    const target = getVillage(payload.targetId)

    if (!attacker || !target) {
      alert("Attacker ve Target seç")
      return
    }

    const distance = calcDistance(attacker, target)
    const duration = distance / (payload.speed || 1)

    const newAttack: Attack = {
      id: Date.now(),
      attackerId: attacker.id,
      targetId: target.id,
      attackerName: attacker.name,
      targetName: target.name,
      troop: payload.troop || "Troop",
      speed: payload.speed || 1,
      distance,
      duration,
      type: payload.type,
      wave: payload.wave || 1,
      arrival: "",
      departure: ""
    }

    setAttacks(prev => [...prev, newAttack])
  }

  // DELETE ATTACK
  const deleteAttack = (id: number) => {
    setAttacks(prev => prev.filter(a => a.id !== id))
  }

  // SYNC ALL (tek varış)
  const syncAll = (arrivalStr: string) => {
    if (!arrivalStr) return
    const base = new Date(arrivalStr)

    setAttacks(prev =>
      prev.map(a => ({
        ...a,
        arrival: base.toLocaleString(),
        departure: new Date(
          base.getTime() - a.duration * 3600 * 1000
        ).toLocaleString()
      }))
    )
  }

  // TIMELINE (WAVE ENGINE)
  const runTimeline = () => {

    if (!arrivalInput) return alert("Varış zamanı seç")
    if (!attacks.length) return alert("Saldırı yok")

    const base = new Date(arrivalInput)

    // group by wave
    const grouped: Record<number, Attack[]> = {}

    attacks.forEach(a => {
      const w = a.wave || 1
      if (!grouped[w]) grouped[w] = []
      grouped[w].push(a)
    })

    const waves = Object.keys(grouped).map(Number).sort((a, b) => a - b)

    const result: Attack[] = []

    waves.forEach((w, wi) => {

      const sorted = [...grouped[w]].sort((a, b) => b.duration - a.duration)

      sorted.forEach((a, i) => {

        const intra = i * offsetMin * 60 * 1000
        const inter = wi * 1000

        const dep = new Date(
          base.getTime()
          - a.duration * 3600 * 1000
          - intra
          - inter
        )

        result.push({
          ...a,
          arrival: base.toLocaleString(),
          departure: dep.toLocaleString()
        })
      })
    })

    setAttacks(result)
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>⚔️ Travian Planner (Village + Wave FULL)</h2>

      <VillageManager villages={villages} setVillages={setVillages} />

      <AttackForm villages={villages} onAdd={addAttack} />

      <div style={{ marginTop: 20 }}>
        <input type="datetime-local" onChange={e => setArrivalInput(e.target.value)} />
        <input type="number" value={offsetMin} onChange={e => setOffsetMin(Number(e.target.value))} />
        <button onClick={runTimeline}>Timeline</button>
      </div>

      <AttackTable attacks={attacks} onDelete={deleteAttack} onSync={syncAll} />

      <TimelineView attacks={attacks} onUpdate={setAttacks} />
    </div>
  )
}

// ================= VILLAGE MANAGER =================
function VillageManager({ villages, setVillages }: any) {

  const [name, setName] = useState("")
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const [type, setType] = useState<"saldiran" | "hedef">("saldiran")

  const addVillage = () => {
    if (!name) return alert("İsim gir")
    setVillages([
      ...villages,
      { id: Date.now(), name, x, y, type }
    ])
    setName("")
  }

  const deleteVillage = (id: number) => {
    setVillages(villages.filter((v: Village) => v.id !== id))
  }

  return (
    <div style={{ marginBottom: 20 }}>
      <h3>🏠 Köy Yönetimi</h3>

      <input placeholder="Ad" value={name} onChange={e => setName(e.target.value)} />
      <input type="number" placeholder="X" onChange={e => setX(Number(e.target.value))} />
      <input type="number" placeholder="Y" onChange={e => setY(Number(e.target.value))} />

      <select onChange={e => setType(e.target.value as any)}>
        <option value="saldiran">Saldıran</option>
        <option value="hedef">Hedef</option>
      </select>

      <button onClick={addVillage}>Ekle</button>

      <ul>
        {villages.map((v: Village) => (
          <li key={v.id}>
            {v.name} ({v.x}|{v.y}) [{v.type}]
            <button onClick={() => deleteVillage(v.id)}>X</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ================= ATTACK FORM =================
function AttackForm({ villages, onAdd }: any) {

  const [attackerId, setAttackerId] = useState<number | null>(null)
  const [targetId, setTargetId] = useState<number | null>(null)
  const [troop, setTroop] = useState("")
  const [speed, setSpeed] = useState(6)
  const [wave, setWave] = useState(1)
  const [type, setType] = useState<Attack["type"]>("real")

  return (
    <div style={{ marginBottom: 20 }}>
      <h3>⚔️ Saldırı</h3>

      <select onChange={e => setAttackerId(Number(e.target.value))}>
        <option value="">Attacker</option>
        {villages.filter((v: Village) => v.type === "saldiran").map(v => (
          <option key={v.id} value={v.id}>{v.name}</option>
        ))}
      </select>

      <select onChange={e => setTargetId(Number(e.target.value))}>
        <option value="">Target</option>
        {villages.filter((v: Village) => v.type === "hedef").map(v => (
          <option key={v.id} value={v.id}>{v.name}</option>
        ))}
      </select>

      <input placeholder="Asker" onChange={e => setTroop(e.target.value)} />
      <input type="number" placeholder="Speed" onChange={e => setSpeed(Number(e.target.value))} />
      <input type="number" value={wave} onChange={e => setWave(Number(e.target.value))} />

      <select onChange={e => setType(e.target.value as any)}>
        <option value="real">Real</option>
        <option value="fake">Fake</option>
        <option value="siege">Siege</option>
      </select>

      <button
        onClick={() =>
          onAdd({
            attackerId,
            targetId,
            troop,
            speed,
            wave,
            type
          })
        }
      >
        Ekle
      </button>
    </div>
  )
}

// ================= TABLE =================
function AttackTable({ attacks, onDelete, onSync }: any) {
  return (
    <div>
      <h3>📋 Liste</h3>

      <input type="datetime-local" onChange={e => onSync(e.target.value)} />

      <table>
        <thead>
          <tr>
            <th>Wave</th>
            <th>Asker</th>
            <th>Çıkış</th>
            <th>Varış</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {attacks.map((a: Attack) => (
            <tr key={a.id}>
              <td>{a.wave}</td>
              <td>{a.troop}</td>
              <td>{a.departure}</td>
              <td>{a.arrival}</td>
              <td><button onClick={() => onDelete(a.id)}>X</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ================= TIMELINE =================
function TimelineView({ attacks, onUpdate }: any) {

  const [dragId, setDragId] = useState<number | null>(null)

  const valid = attacks.filter((a: Attack) => a.departure)
  if (!valid.length) return null

  const times = valid.map(a => new Date(a.departure).getTime())
  const min = Math.min(...times)
  const max = Math.max(...times)
  const range = max - min || 1

  const getLeft = (t: number) => ((t - min) / range) * 100

  const handleDrop = (e: any) => {
    if (!dragId) return

    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    const newTime = min + percent * range

    onUpdate(
      attacks.map((a: Attack) =>
        a.id === dragId
          ? { ...a, departure: new Date(newTime).toLocaleString() }
          : a
      )
    )

    setDragId(null)
  }

  return (
    <div style={{ marginTop: 20 }}>
      <h3>📊 Timeline</h3>

      <div
        onMouseUp={handleDrop}
        style={{ position: "relative", height: 100, borderTop: "2px solid #444" }}
      >
        {valid.map(a => {
          const t = new Date(a.departure).getTime()
          return (
            <div
              key={a.id}
              draggable
              onDragStart={() => setDragId(a.id)}
              style={{
                position: "absolute",
                left: `${getLeft(t)}%`,
                transform: "translateX(-50%)"
              }}
            >
              ● W{a.wave}
            </div>
          )
        })}
      </div>
    </div>
  )
}