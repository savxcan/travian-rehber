"use client"

import { useState } from "react"

type Attack = {
  id: number
  attacker: string
  target: string
  troop: string
  type: "real" | "fake" | "siege"
  distance: number
  duration: number
  arrival: string
  departure: string
}

type Props = {
  attacks: Attack[]
  onSync: (arrival: string) => void
  onDelete: (id: number) => void
}

export default function AttackTable({ attacks, onSync, onDelete }: Props) {
  const [syncTime, setSyncTime] = useState("")

  return (
    <div className="card">
      <h3>📋 Saldırı Listesi</h3>

      {/* 🔥 SYNC PANEL */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <input
          type="datetime-local"
          value={syncTime}
          onChange={(e) => setSyncTime(e.target.value)}
        />

        <button
          className="btn"
          onClick={() => {
            if (!syncTime) return alert("Varış zamanı seç")
            onSync(syncTime)
          }}
        >
          Senkronla
        </button>
      </div>

      {/* 🔥 BOŞ DURUM */}
      {attacks.length === 0 ? (
        <p style={{ opacity: 0.6 }}>Henüz saldırı eklenmedi</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
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
              <th></th>
            </tr>
          </thead>

          <tbody>
            {attacks.map((a, i) => (
              <tr
                key={a.id}
                style={{
                  textAlign: "center",
                  background:
                    a.type === "real"
                      ? "rgba(46, 204, 113, 0.08)"
                      : a.type === "fake"
                      ? "rgba(241, 196, 15, 0.08)"
                      : "rgba(231, 76, 60, 0.08)"
                }}
              >
                <td>{i + 1}</td>

                {/* 🔥 TİP GÖRSEL */}
                <td>
                  {a.type === "real" && "🟢"}
                  {a.type === "fake" && "🟡"}
                  {a.type === "siege" && "🔴"}
                </td>

                <td>{a.attacker}</td>
                <td>{a.target}</td>
                <td>{a.troop}</td>
                <td>{a.distance.toFixed(2)}</td>
                <td>{a.duration.toFixed(2)}h</td>
                <td>{a.arrival}</td>
                <td>{a.departure}</td>

                <td>
                  <button
                    className="btn-danger"
                    onClick={() => onDelete(a.id)}
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}