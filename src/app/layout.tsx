import "./globals.css"
import Navbar from "../components/Navbar"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Travian Kingdoms Rehberi",
  description: "Travian rehber ve araç platformu",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body
        style={{
          margin: 0,
          padding: 0,
          background: "linear-gradient(135deg, #0a0f1a, #0f1420)",
          color: "#e0e0e0",
          fontFamily: "Segoe UI, sans-serif"
        }}
      >
        <div style={{ padding: "20px" }}>
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  )
}