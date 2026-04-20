"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import SimulatorLayout from "../../components/simulator/SimulatorLayout"

export default function AppPage() {
  const [ready, setReady] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("user")

    if (!user) {
      router.push("/auth")
    } else {
      setReady(true)
    }
  }, [router])

  if (!ready) return null

  return <SimulatorLayout />
}