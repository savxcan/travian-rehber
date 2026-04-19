"use client"

import { useState } from "react"
import VillageManager from "./VillageManager"
import AttackForm from "./AttackForm"
import AttackTable from "./AttackTable"

export default function SimulatorLayout() {
  const [villages, setVillages] = useState([])
  const [attacks, setAttacks] = useState<any[]>([])

  const handleAddAttack = (attack: any) => {
    setAttacks(prev => [...prev, attack])
  }

  return (
    <div>
      <h2>⚔️ Saldırı Planlayıcı</h2>

      <VillageManager onChange={setVillages} />

      <AttackForm villages={villages} onAddAttack={handleAddAttack} />

      <AttackTable attacks={attacks} />
    </div>
  )
}