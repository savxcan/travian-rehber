"use client"

import { useState } from "react"

type Attack = {
  id: number
  attacker: string
  target: string
  distance: number
  duration: number
  arrival: string
  departure: string
}

export default function AttackTable() {
  const [attacks, setAttacks] = useState<Attack[]>([])
  const [arrivalInput, setArrivalInput] = useState("")

  const addAttack = () => {
    if (!arrivalInput) {
      alert("Varış zamanı gir")
      return
    }

    // TEST verisi (şimdilik)
    const distance = 30
    const duration = 5 // saat

    const arrivalDate = new Date(arrivalInput)
    const departureDate = new Date(arrivalDate.getTime() - duration * 3600 * 1000)

    const newAttack: Attack = {
      id: Date.now(),
      attacker: "Köy A",
      target: "Köy B",
      distance,
      duration,
      arrival: arrivalDate.toLocaleString(),
      departure: departureDate.toLocaleString()
    }

    setAttacks(prev => [...prev, newAttack])
  }

  return (
    <div style={{marginTop: "40px"}}>
      <h3>📋 Saldırı Listesi</h3>

      {/* INPUT */}
      <div style={{marginBottom: "10px"}}>
        <input
          type="datetime-local"
          value={arrivalInput}
          onChange={e => setArrivalInput(e.target.value)}
        />

        <button className="btn" onClick={addAttack} style={{marginLeft: "10px"}}>
          Saldırı Ekle
        </button>
      </div>

      {/* TABLE */}
      <table style={{width: "100%", marginTop: "10px"}}>
        <thead>
          <tr>
            <th>#</th>
            <th>Saldıran</th>
            <th>Hedef</th>
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
              <td>{a.attacker}</td>
              <td>{a.target}</td>
              <td>{a.distance.toFixed(2)}</td>
              <td>{a.duration.toFixed(2)}h</td>
              <td>{a.arrival}</td>
              <td>{a.departure}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}