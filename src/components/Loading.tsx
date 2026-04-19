"use client"

import Logo from "./Logo"

export default function Loading() {
  return (
    <div style={{
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: "20px"
    }}>
      <Logo size={60} />

      <div className="spinner"></div>
    </div>
  )
}