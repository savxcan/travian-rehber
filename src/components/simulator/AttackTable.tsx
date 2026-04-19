"use client"

import { useState } from "react"

export default function AttackTable({ attacks, onSync }: any) {
  const [globalArrival, setGlobalArrival] = useState("")

  return (
    <div style={{ marginTop: "40px" }}>
      <h3>📋 Saldırı Listesi</h3>

      <div style={{ marginBottom: "10px" }}>
        <input
          type="datetime-local"
          value={globalArrival}
          onChange={e => setGlobalArrival(e.target.value)}
        />

        <button className="btn" onClick={() => onSync(globalArrival)}>
          Senkronla
        </button>
      </div>

      <table style={{ width: "100%", tableLayout: "fixed" }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Tip</th>
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
            <tr
              key={a.id}
              style={{
                background:
                  a.type === "real"
                    ? "rgba(46, 204, 113, 0.1)"
                    : a.type === "fake"
                    ? "rgba(241, 196, 15, 0.1)"
                    : "rgba(231, 76, 60, 0.1)"
              }}
            >
              <td>{i + 1}</td>

              <td>
                {a.type === "real" && "🟢 Gerçek"}
                {a.type === "fake" && "🟡 Fake"}
                {a.type === "siege" && "🔴 Kuşatma"}
              </td>

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