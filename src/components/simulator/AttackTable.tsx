"use client"

type Attack = {
  id: number
  attacker: string
  target: string
  distance: number
  duration: number
  arrival: string
  departure: string
}

export default function AttackTable({ attacks }: { attacks: Attack[] }) {
  return (
    <div style={{ marginTop: "40px" }}>
      <h3>📋 Saldırı Listesi</h3>

      <table style={{ width: "100%", tableLayout: "fixed" }}>
        <thead>
          <tr>
            <th>#</th>
			<th>Asker</th>
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
			  <td>{a.troop}</td>
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