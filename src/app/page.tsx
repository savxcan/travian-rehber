"use client"

import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  return (
    <main>
      <h2>📌 Hoşgeldin</h2>

      <p>
        Travian Kingdoms için en hızlı köy kurma ve saldırı planlama rehberi.
      </p>

      <div style={{marginTop: "20px"}}>
        <button className="btn" onClick={() => router.push("/simulator")}>
          ⚔️ Simülatöre Git
        </button>
      </div>
    </main>
  )
}