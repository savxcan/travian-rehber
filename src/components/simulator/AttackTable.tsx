"use client"

type Attack = {
  id: number
  attacker?: string
  target?: string
  troop: string
  type: "real" | "fake" | "siege"
  distance: number
  duration: number
  wave: number
  arrival: string
  departure: string
}

export default function AttackTable({
  attacks,
  onDelete,
  onSync
}: {
  attacks: Attack[]
  onDelete: (id: number) => void
  onSync: (arrival: string) => void
}) {

  // 🎨 TYPE COLOR
  const getTypeColor = (type: string) => {
    if (type === "real") return "#ff4d4f"
    if (type === "fake") return "#faad14"
    if (type === "siege") return "#722ed1"
    return "#999"
  }

  return (
    <div style={{ marginTop: 20 }}>

      <h3>📋 Saldırı Listesi</h3>

      {/* 🔄 SYNC */}
      <div style={{
        marginBottom: 15,
        display: "flex",
        gap: 10,
        alignItems: "center"
      }}>
        <input
          type="datetime-local"
          onChange={(e) => onSync(e.target.value)}
        />

        <span style={{ fontSize: 12, opacity: 0.6 }}>
          (Tüm saldırıları aynı varışa ayarlar)
        </span>
      </div>

      {/* 📊 TABLE */}
      <div style={{ overflowX: "auto" }}>
        <table style={{
          width: "100%",
          borderCollapse: "collapse"
        }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #333" }}>
              <th style={th}>Wave</th>
              <th style={th}>Tip</th>
              <th style={th}>Asker</th>
              <th style={th}>Çıkış</th>
              <th style={th}>Varış</th>
              <th style={th}>Süre</th>
              <th style={th}>Mesafe</th>
              <th style={th}></th>
            </tr>
          </thead>

          <tbody>
            {attacks.length === 0 && (
              <tr>
                <td colSpan={8} style={{
                  textAlign: "center",
                  padding: 20,
                  opacity: 0.6
                }}>
                  Henüz saldırı yok
                </td>
              </tr>
            )}

            {attacks.map((a) => (
              <tr
                key={a.id}
                style={{ borderBottom: "1px solid #222" }}
              >
                {/* WAVE */}
                <td style={td}>{a.wave || 1}</td>

                {/* TYPE */}
                <td style={td}>
                  <span style={{
                    background: getTypeColor(a.type),
                    padding: "3px 8px",
                    borderRadius: 6,
                    fontSize: 12
                  }}>
                    {a.type.toUpperCase()}
                  </span>
                </td>

                {/* TROOP */}
                <td style={td}>{a.troop}</td>

                {/* DEPARTURE */}
                <td style={td}>
                  {a.departure || "-"}
                </td>

                {/* ARRIVAL */}
                <td style={td}>
                  {a.arrival || "-"}
                </td>

                {/* DURATION */}
                <td style={td}>
                  {a.duration.toFixed(2)} h
                </td>

                {/* DISTANCE */}
                <td style={td}>
                  {a.distance.toFixed(2)}
                </td>

                {/* DELETE */}
                <td style={td}>
                  <button
                    onClick={() => onDelete(a.id)}
                    style={{
                      background: "#ff4d4f",
                      border: "none",
                      padding: "5px 8px",
                      borderRadius: 6,
                      cursor: "pointer"
                    }}
                  >
                    ❌
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// 🎨 STYLES
const th: React.CSSProperties = {
  textAlign: "left",
  padding: "10px 8px",
  fontWeight: 500
}

const td: React.CSSProperties = {
  padding: "10px 8px"
}