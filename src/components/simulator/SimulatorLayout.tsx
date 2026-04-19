"use client"

import { useState } from "react"
import VillageManager from "./VillageManager"
import AttackForm from "./AttackForm"
import AttackTable from "./AttackTable"

export default function SimulatorLayout() {
  const [villages, setVillages] = useState([])

  return (
    <div>
      <h2>⚔️ Saldırı Planlayıcı</h2>

      <VillageManager onChange={setVillages} />

      <AttackForm villages={villages} />

      <AttackTable />
    </div>
  )
}