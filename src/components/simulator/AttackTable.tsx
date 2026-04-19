"use client"

import { useState } from "react"

export default function AttackTable({ attacks, onSync }: any) {
  const [globalArrival, setGlobalArrival] = useState("")

  return (
    <div style={{ marginTop: "40px" }}>
      <h3>📋 Saldırı Listesi</h3>

      {/* 🔥 SENKRON PANEL */}
      <div style={{ marginBottom: "10px" }}>
        <input
          type="datetime-local"
          value={globalArrival}
          onChange={e => setGlobalArrival(e.target.value)}
        />

        <button
          className="btn"
          onClick={() => onSync(globalArrival)}
          style={{ marginLeft: "10px" }}
        >
          Senkronla
        </button>
      </div>

      {/* TABLO */}
      <table style={{ width: "100%", tableLayout: "fixed" }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Saldıran</th>
            <th>Hedef</th>
            <th>Asker</th>
            <th>Mesafe</th>
            <th>Süre</th>
            <th>Varış</th>
            <th>Çıkış</th>
          </tr>
        </thead>

        <tbody>
          {attacks.map((a: any, i: number) => (
            <tr key={a.id}>
              <td>{i + 1}</td>
              <td>{a.attacker}</td>
              <td>{a.target}</td>
              <td>{a.troop}</td>
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