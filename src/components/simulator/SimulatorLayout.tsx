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
  duration: number // saat cinsinden (float)
  arrival: string
  departure: string
}

export default function SimulatorLayout() {
  const [villages, setVillages] = useState<any[]>([])
  const [attacks, setAttacks] = useState<Attack[]>([])
  const [loaded, setLoaded] = useState(false)
  const [showIntro, setShowIntro] = useState(true)

  // 🔥 TIMELINE STATE
  const [timelineArrival, setTimelineArrival] = useState("")
  const [offset, setOffset] = useState(1) // dakika

  // 🔐 USER (sadece header için)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) setUser(JSON.parse(stored))
  }, [])

  // 💾 LOAD
  useEffect(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) setAttacks(JSON.parse(data))
    } catch (err) {
      console.error(err)
    } finally {
      setLoaded(true)
    }
  }, [])

  // 💾 SAVE
  useEffect(() => {
    if (!loaded) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(attacks))
  }, [attacks, loaded])

  // ➕ ADD
  const handleAddAttack = (attack: Attack) => {
    setAttacks(prev => [...prev, attack])
  }

  // ❌ DELETE
  const handleDelete = (id: number) => {
    setAttacks(prev => prev.filter(a => a.id !== id))
  }

  // 🔄 NORMAL SYNC
  const handleSync = (arrival: string) => {
    if (!arrival) return alert("Varış zamanı seç")

    const arrivalDate = new Date(arrival)

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

  // ⚔️ TIMELINE (ANA SİSTEM)
  const handleTimeline = () => {
    if (!timelineArrival) return alert("Varış zamanı seç")

    const arrivalDate = new Date(timelineArrival)

    // 🔥 süreye göre sırala (uzun süre önce çıkar)
    const sorted = [...attacks].sort((a, b) => b.duration - a.duration)

    const updated = sorted.map((a, i) => {
      const delay = i * offset * 60 * 1000

      const departure = new Date(
        arrivalDate.getTime() - a.duration * 3600 * 1000 - delay
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
    <div style={{ padding: 20 }}>

      {/* INTRO */}
      {showIntro && (
        <Intro onFinish={() => setShowIntro(false)} />
      )}

      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 20
      }}>
        <h2>⚔️ Saldırı Planlayıcı</h2>

        <div>
          {user ? `${user.nickname} (${user.server})` : "Misafir"}

          <button
            onClick={() => {
              localStorage.removeItem("user")
              location.href = "/auth"
            }}
            style={{ marginLeft: 10 }}
          >
            Çıkış
          </button>
        </div>
      </div>

      {/* TIMELINE PANEL */}
      <div style={{
        padding: 15,
        marginBottom: 20,
        border: "1px solid #333",
        borderRadius: 10
      }}>
        <h3>⏱ Timeline Planlama</h3>

        <input
          type="datetime-local"
          value={timelineArrival}
          onChange={(e) => setTimelineArrival(e.target.value)}
        />

        <input
          type="number"
          value={offset}
          onChange={(e) => setOffset(Number(e.target.value))}
          placeholder="Dakika aralık"
          style={{ marginLeft: 10 }}
        />

        <button onClick={handleTimeline} style={{ marginLeft: 10 }}>
          Timeline Hesapla
        </button>
      </div>

      {/* MAIN */}
      <div className="grid">

        <VillageManager onChange={setVillages} />

        <AttackForm
          villages={villages}
          onAddAttack={handleAddAttack}
        />

        <AttackTable
          attacks={attacks}
          onDelete={handleDelete}
          onSync={handleSync}
        />

      </div>
    </div>
  )
}