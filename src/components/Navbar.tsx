"use client"

import Link from "next/link"

export default function Navbar() {
  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "15px 20px",
      background: "#111827",
      borderRadius: "12px",
      marginBottom: "20px"
    }}>
      <div style={{fontWeight: "bold", color: "#f39c12"}}>
        ⚔️ Travian Rehber
      </div>

      <div style={{display: "flex", gap: "20px"}}>
        <Link href="/">Ana Sayfa</Link>
        <Link href="/rehber">Rehber</Link>
        <Link href="/simulator">Simülatör</Link>
      </div>
    </nav>
  )
}