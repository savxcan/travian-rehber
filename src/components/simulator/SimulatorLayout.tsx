"use client"

import React, { useState, useEffect } from "react"

const STORAGE_KEY = "travian_pro_v3"

// ================= TYPES =================
type Village = {
  id: number
  name: string
  x: number
  y: number
  type: "attacker" | "target"
}

type Attack = {
  id: number
  attacker: string
  target: string
  wave: number
  type: string
  duration: number
  distance: number
  departure: string
}

// ================= MAIN =================
export default function SimulatorLayout() {

  const [villages, setVillages] = useState<Village[]>([])
  const [attacks, setAttacks] = useState<Attack[]>([])
  const [arrival, setArrival] = useState("")
  const [offsetSec, setOffsetSec] = useState(1)
  const [tsLevel, setTsLevel] = useState(0)

  // LOAD
  useEffect(() => {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      const p = JSON.parse(data)
      setVillages(p.villages || [])
      setAttacks(p.attacks || [])
    }
  }, [])

  // SAVE
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ villages, attacks }))
  }, [villages, attacks])

  const distanceCalc = (a: Village, b: Village) =>
    Math.hypot(a.x - b.x, a.y - b.y)

  // 🔥 TURNOVA SPEED
  const getSpeed = (distance: number) => {
    let base = 6
    if (distance <= 20) return base
    return base * (1 + tsLevel * 0.2)
  }

  // ================= ADD VILLAGE =================
  const addVillage = (name: string, x: number, y: number, type: any) => {
    if (!name) return
    setVillages(prev => [...prev, {
      id: Date.now() + Math.random(),
      name, x, y, type
    }])
  }

  // ================= PRO WAR =================
  const generateProWar = (
    attackerId: number,
    mainTargetId: number,
    fakeTargets: number[]
  ) => {

    const attacker = villages.find(v => v.id === attackerId)
    const main = villages.find(v => v.id === mainTargetId)

    if (!attacker || !main) return alert("Seçim yap")

    const list: Attack[] = []

    const add = (target: Village, wave: number, type: string) => {
      const d = distanceCalc(attacker, target)
      const speed = getSpeed(d)

      list.push({
        id: Date.now() + Math.random(),
        attacker: attacker.name,
        target: target.name,
        wave,
        type,
        duration: d / speed,
        distance: d,
        departure: ""
      })
    }

    // ANA HEDEF
    add(main, 1, "Fake")
    add(main, 2, "Fake")
    add(main, 3, "Siege")
    add(main, 4, "Real")
    add(main, 5, "Catapult")
    add(main, 6, "Fake")
    add(main, 7, "Fake")

    // FAKE HEDEFLER
    fakeTargets.forEach(id => {
      const t = villages.find(v => v.id === id)
      if (!t) return
      add(t, 1, "Fake")
    })

    setAttacks(prev => [...prev, ...list])
  }

  // ================= PLAN =================
  const plan = () => {

    if (!arrival) return alert("Zaman seç")

    const base = new Date(arrival)

    const grouped: Record<string, Attack[]> = {}

    attacks.forEach(a => {
      if (!grouped[a.target]) grouped[a.target] = []
      grouped[a.target].push(a)
    })

    const result: Attack[] = []

    Object.keys(grouped).forEach(target => {

      const sorted = [...grouped[target]].sort(
        (a, b) => b.duration - a.duration
      )

      sorted.forEach((a, i) => {

        const offset = i * offsetSec * 1000

        const dep = new Date(
          base.getTime()
          - a.duration * 3600000
          - offset
        )

        result.push({
          ...a,
          departure: dep.toLocaleTimeString()
        })
      })
    })

    setAttacks(result)
  }

  return (
    <div style={{ padding: 20 }}>

      <h2>🔥 PRO WAR V3 (TS + Siege)</h2>

      <VillageForm onAdd={addVillage} />
      <ProPanel villages={villages} onRun={generateProWar} />

      {/* PLAN */}
      <div style={{ marginTop: 20 }}>
        <input type="datetime-local" onChange={e => setArrival(e.target.value)} />

        <input type="number" value={offsetSec} onChange={e => setOffsetSec(Number(e.target.value))} />
        <span> Offset</span>

        <input type="number" value={tsLevel} onChange={e => setTsLevel(Number(e.target.value))} />
        <span> TS</span>

        <button onClick={plan}>Planla</button>
      </div>

      {/* TABLE */}
      <table style={{ width: "100%", marginTop: 20 }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Tür</th>
            <th>Saldıran</th>
            <th>Hedef</th>
            <th>Turnuva</th>
            <th>Mesafe</th>
            <th>Süre</th>
            <th>Varış</th>
            <th>Çıkış</th>
          </tr>
        </thead>

        <tbody>
          {attacks.map((a, i) => (
            <tr key={a.id}>
              <td>{i + 1}</td>
              <td>{a.type}</td>
              <td>{a.attacker}</td>
              <td>{a.target}</td>
              <td>{tsLevel}</td>
              <td>{a.distance.toFixed(2)}</td>
              <td>{a.duration.toFixed(2)} h</td>
              <td>{arrival ? new Date(arrival).toLocaleTimeString() : "-"}</td>
              <td>{a.departure}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  )
}

// ================= PRO PANEL =================
function ProPanel({ villages, onRun }: any) {

  const attackers = villages.filter((v:any)=>v.type==="attacker")
  const targets = villages.filter((v:any)=>v.type==="target")

  const [attacker, setAttacker] = useState("")
  const [main, setMain] = useState("")
  const [fakes, setFakes] = useState<number[]>([])

  return (
    <div>
      <h3>Pro Savaş</h3>

      <select onChange={e => setAttacker(e.target.value)}>
        <option>Attacker</option>
        {attackers.map((v:any)=>(
          <option key={v.id} value={v.id}>{v.name}</option>
        ))}
      </select>

      <select onChange={e => setMain(e.target.value)}>
        <option>Ana hedef</option>
        {targets.map((v:any)=>(
          <option key={v.id} value={v.id}>{v.name}</option>
        ))}
      </select>

      {targets.map((v:any)=>(
        <label key={v.id}>
          <input type="checkbox"
            onChange={(e)=>{
              if(e.target.checked) setFakes([...fakes,v.id])
              else setFakes(fakes.filter(id=>id!==v.id))
            }}
          />
          {v.name}
        </label>
      ))}

      <button onClick={()=>onRun(Number(attacker), Number(main), fakes)}>
        🚀 PRO SALDIRI
      </button>
    </div>
  )
}

// ================= VILLAGE =================
function VillageForm({ onAdd }: any) {

  const [name,setName]=useState("")
  const [x,setX]=useState("")
  const [y,setY]=useState("")
  const [type,setType]=useState("attacker")

  return (
    <div>
      <h3>Köy</h3>

      <input placeholder="Ad" onChange={e=>setName(e.target.value)} />
      <input placeholder="X" onChange={e=>setX(e.target.value)} />
      <input placeholder="Y" onChange={e=>setY(e.target.value)} />

      <select onChange={e=>setType(e.target.value)}>
        <option value="attacker">🟥</option>
        <option value="target">🟦</option>
      </select>

      <button onClick={()=>{
        onAdd(name, Number(x), Number(y), type)
        setName(""); setX(""); setY("")
      }}>
        Ekle
      </button>
    </div>
  )
}