"use client"

import { useState } from "react"

type Village = {
  id: number
  name: string
  x: number
  y: number
  type: "saldiran" | "hedef"
}

export default function AttackForm({ villages, onAddAttack }: any) {

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

  const [tribe, setTribe] = useState<"roma"|"cermen"|"galya">("roma")
  const [troopIndex, setTroopIndex] = useState(0)
  const [attackerId, setAttackerId] = useState<number | null>(null)
  const [targetId, setTargetId] = useState<number | null>(null)
  const [attackType, setAttackType] = useState("real")
  const [turnuva, setTurnuva] = useState(0)
  const [arrivalTime, setArrivalTime] = useState("")

  const attacker = villages.find((v:Village)=>v.id===attackerId)
  const target = villages.find((v:Village)=>v.id===targetId)
  const troop = troops[tribe][troopIndex]

  const parseLocalDate = (value: string) => {
    const [d,t] = value.split("T")
    const [y,m,day] = d.split("-").map(Number)
    const [h,min] = t.split(":").map(Number)
    return new Date(y, m-1, day, h, min)
  }

  const getSpeed = () => {
    let s = troop.speed
    if (attackType === "siege") s = s / 2
    return s
  }

  const getDistance = () => {
    if (!attacker || !target) return 0
    return Math.sqrt((attacker.x-target.x)**2 + (attacker.y-target.y)**2)
  }

  const getTime = () => {
    const d = getDistance()
    const s = getSpeed()
    if (!d || !s) return 0

    if (d <= 20) return d / s
    const base = 20 / s
    const bonus = s * (1 + turnuva * 0.1)
    return base + (d-20)/bonus
  }

  const addAttack = () => {
    if (!attacker || !target) return alert("Köy seç")
    if (!arrivalTime) return alert("Varış gir")

    const duration = getTime()
    const arrival = parseLocalDate(arrivalTime)
    const departure = new Date(arrival.getTime() - duration*3600*1000)

    onAddAttack({
      id: Date.now(),
      attacker: attacker.name,
      target: target.name,
      troop: troop.name,
      type: attackType,
      distance: getDistance(),
      duration,
      arrival: arrival.toLocaleString(),
      departure: departure.toLocaleString()
    })
  }

  return (
    <div className="card">
      <h3>⚔️ Saldırı Oluştur</h3>

      <div className="tabs">
        {(["roma","cermen","galya"] as const).map(t=>(
          <div key={t} className={`tab ${tribe===t?"active":""}`} onClick={()=>setTribe(t)}>
            {t.toUpperCase()}
          </div>
        ))}
      </div>

      <div className="grid grid-2">
        <select onChange={e=>setAttackerId(Number(e.target.value))}>
          <option>Saldıran</option>
          {villages.filter((v:any)=>v.type==="saldiran").map((v:any)=>(
            <option key={v.id} value={v.id}>{v.name}</option>
          ))}
        </select>

        <select onChange={e=>setTargetId(Number(e.target.value))}>
          <option>Hedef</option>
          {villages.filter((v:any)=>v.type==="hedef").map((v:any)=>(
            <option key={v.id} value={v.id}>{v.name}</option>
          ))}
        </select>

        <select onChange={e=>setTroopIndex(Number(e.target.value))}>
          {troops[tribe].map((t,i)=>(
            <option key={i} value={i}>{t.name} ({t.speed})</option>
          ))}
        </select>

        <select onChange={e=>setAttackType(e.target.value)}>
          <option value="real">Gerçek</option>
          <option value="fake">Fake</option>
          <option value="siege">Kuşatma</option>
        </select>

        <input type="number" value={turnuva} onChange={e=>setTurnuva(Number(e.target.value))}/>
        <input type="datetime-local" value={arrivalTime} onChange={e=>setArrivalTime(e.target.value)}/>
      </div>

      <button className="btn" onClick={addAttack} style={{marginTop:"10px"}}>
        Saldırıyı Ekle
      </button>
    </div>
  )
}