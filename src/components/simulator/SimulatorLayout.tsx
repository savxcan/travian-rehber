"use client"

import { useEffect, useState } from "react"
import VillageManager from "./VillageManager"
import AttackForm from "./AttackForm"
import AttackTable from "./AttackTable"
import Intro from "../Intro"

const STORAGE_KEY = "travian_attacks_v1"

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

export default function SimulatorLayout() {

  const [villages, setVillages] = useState<any[]>([])
  const [attacks, setAttacks] = useState<Attack[]>([])
  const [loaded, setLoaded] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const [user, setUser] = useState<any>(null)

  // 🔐 USER LOAD (sadece görüntü için)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user")
      if (stored) {
        setUser(JSON.parse(stored))
      }
    }
  }, [])

  // 🔥 DATE PARSER (TIME FIX)
  const parseLocalDate = (value: string) => {
    if (!value) return new Date()

    const [datePart, timePart] = value.split("T")
    const [year, month, day] = datePart.split("-").map(Number)
    const [hour, minute] = timePart.split(":").map(Number)

    return new Date(year, month - 1, day, hour, minute)
  }

  // 💾 ATTACK LOAD
  useEffect(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        setAttacks(JSON.parse(data))
      }
    } catch (err) {
      console.error("Load error:", err)
    } finally {
      setLoaded(true)
    }
  }, [])

  // 💾 SAVE
  useEffect(() => {
    if (!loaded) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(attacks))
  }, [attacks, loaded])

  // ➕ ADD ATTACK
  const handleAddAttack = (attack: Attack) => {
    setAttacks(prev => [...prev, attack])
  }

  // ❌ DELETE
  const handleDelete = (id: number) => {
    setAttacks(prev => prev.filter(a => a.id !== id))
  }

  // 🔄 SYNC
  const handleSync = (arrival: string) => {
    if (!arrival) return alert("Varış zamanı seç")

    const arrivalDate = parseLocalDate(arrival)

    const updated = attacks.map(a => {
      const departure = new Date(
        arrivalDate.getTime() - a.duration * 3600 * 1000
      )

      return {
        ...a,
        arrival: arrivalDate.toLocaleString(),
        departure: departure.toLocaleString()
      }
    })

    setAttacks(updated)
  }

  return (
    <div style={{ padding: "20px" }}>

      {/* 🔥 INTRO */}
      {showIntro && (
        <Intro onFinish={() => setShowIntro(false)} />
      )}

      {/* 🔝 HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px"
        }}
      >
        <h2>⚔️ Saldırı Planlayıcı</h2>

        <div>
          {user ? `${user.nickname} (${user.server})` : "Misafir"}

          <button
            className="btn-danger"
            onClick={() => {
              localStorage.removeItem("user")
              window.location.href = "/auth"
            }}
            style={{ marginLeft: "10px" }}
          >
            Çıkış
          </button>
        </div>
      </div>

      {/* 🔥 MAIN */}
      <div className="grid">

        {/* 🏘️ Köy Yönetimi */}
        <VillageManager onChange={setVillages} />

        {/* ⚔️ Saldırı Form */}
        <AttackForm
          villages={villages}
          onAddAttack={handleAddAttack}
        />

        {/* 📋 Liste */}
        <AttackTable
          attacks={attacks}
          onDelete={handleDelete}
          onSync={handleSync}
        />

      </div>
    </div>
  )
}