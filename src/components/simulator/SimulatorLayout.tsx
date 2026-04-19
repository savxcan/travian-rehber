"use client"

import { useEffect, useState } from "react"
import VillageManager from "./VillageManager"
import AttackForm from "./AttackForm"
import AttackTable from "./AttackTable"

const STORAGE_KEY = "travian_attacks_v1"

export default function SimulatorLayout() {
  const [villages, setVillages] = useState([])
  const [attacks, setAttacks] = useState<any[]>([])
  const [loaded, setLoaded] = useState(false)

  // LOAD
  useEffect(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        setAttacks(JSON.parse(data))
      }
    } catch (e) {
      console.error("load error", e)
    } finally {
      setLoaded(true)
    }
  }, [])

  // SAVE
  useEffect(() => {
    if (!loaded) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(attacks))
  }, [attacks, loaded])

  const handleAddAttack = (attack: any) => {
    setAttacks(prev => [...prev, attack])
  }

  // 🔥 SENKRON MOTORU
  const handleSync = (arrival: string) => {
    if (!arrival) return alert("Varış zamanı seç")

    const arrivalDate = new Date(arrival)

    const updated = attacks.map(a => {
      const departureDate = new Date(
        arrivalDate.getTime() - a.duration * 3600 * 1000
      )

      return {
        ...a,
        arrival: arrivalDate.toLocaleString(),
        departure: departureDate.toLocaleString()
      }
    })

    setAttacks(updated)
  }

  return (
    <div>
      <h2>⚔️ Saldırı Planlayıcı</h2>

      <VillageManager onChange={setVillages} />

      <AttackForm
        villages={villages}
        onAddAttack={handleAddAttack}
      />

      <AttackTable
        attacks={attacks}
        onSync={handleSync}
      />
    </div>
  )
}