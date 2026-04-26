"use client"

import { useState } from "react"

type Attack = {
  id: number
  troop: string
  type: "real" | "fake" | "siege"
  wave: number
  departure: string
}

export default function TimelineView({
  attacks,
  onUpdate
}: {
  attacks: Attack[]
  onUpdate: (updated: Attack[]) => void
}) {

  const [dragId, setDragId] = useState<number | null>(null)

  // 🔒 Departure dolu olanları al
  const valid = attacks.filter(a => a.departure)

  if (!valid.length) {
    return (
      <div style={{ marginTop: 20, opacity: 0.6 }}>
        Timeline için önce hesaplama yap
      </div>
    )
  }

  // 🧠 Zaman aralığı hesapla
  const times = valid.map(a => new Date(a.departure).getTime())
  const min = Math.min(...times)
  const max = Math.max(...times)
  const range = max - min || 1

  // 📍 Pozisyon hesapla (%)
  const getLeft = (time: number) => {
    return ((time - min) / range) * 100
  }

  // 🎨 Tip renkleri
  const getColor = (type: string) => {
    if (type === "real") return "#ff4d4f"
    if (type === "fake") return "#faad14"
    if (type === "siege") return "#722ed1"
    return "#999"
  }

  // 🖱️ DROP
  const handleDrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragId === null) return

    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    const newTime = min + percent * range

    const updated = attacks.map(a =>
      a.id === dragId
        ? { ...a, departure: new Date(newTime).toLocaleString() }
        : a
    )

    onUpdate(updated)
    setDragId(null)
  }

  return (
    <div style={{
      marginTop: 30,
      padding: 20,
      border: "1px solid #333",
      borderRadius: 10
    }}>
      <h3>📊 Timeline (Drag & Drop)</h3>

      <div
        onMouseUp={handleDrop}
        style={{
          position: "relative",
          height: 100,
          marginTop: 20,
          borderTop: "2px solid #444"
        }}
      >

        {attacks.map(a => {
          if (!a.departure) return null

          const t = new Date(a.departure).getTime()
          const left = getLeft(t)

          return (
            <div
              key={a.id}
              draggable
              onDragStart={() => setDragId(a.id)}
              style={{
                position: "absolute",
                left: `${left}%`,
                transform: "translateX(-50%)",
                textAlign: "center",
                cursor: "grab"
              }}
            >
              {/* DOT */}
              <div style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: getColor(a.type),
                margin: "0 auto"
              }} />

              {/* LABEL */}
              <div style={{
                fontSize: 11,
                marginTop: 5
              }}>
                W{a.wave || 1} - {a.troop}
              </div>

              {/* TIME */}
              <div style={{
                fontSize: 10,
                opacity: 0.6
              }}>
                {new Date(a.departure).toLocaleTimeString()}
              </div>
            </div>
          )
        })}

      </div>
    </div>
  )
}