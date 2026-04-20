"use client"

import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  return (
    <main style={{ textAlign: "center", padding: "100px" }}>
      <h1>⚔️ TRAVIAN PRO</h1>

      <p>
        Travian Kingdoms için en hızlı köy kurma ve saldırı planlama sistemi
      </p>

      <button
        className="btn"
        onClick={() => router.push("/auth")}
        style={{ marginTop: "20px" }}
      >
        Başla
      </button>
    </main>
  )
}