"use client"

import { useRouter } from "next/navigation"
import Auth from "../../components/Auth"

export default function AuthPage() {
  const router = useRouter()

  return (
    <Auth
      onLogin={() => {
        router.push("/app")
      }}
    />
  )
}