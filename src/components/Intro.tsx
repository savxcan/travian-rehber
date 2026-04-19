"use client"

import { useEffect, useState } from "react"
import Logo from "./Logo"

export default function Intro({ onFinish }: { onFinish: () => void }) {
  const [visible, setVisible] = useState(true)
  const [skipAvailable, setSkipAvailable] = useState(false)
  const [alwaysPlay, setAlwaysPlay] = useState(false)

  // 🔥 INTRO KONTROL
  useEffect(() => {
    const played = localStorage.getItem("intro_played")

    if (played && !alwaysPlay) {
      // kısa intro
      const timer = setTimeout(() => finish(), 1200)
      return () => clearTimeout(timer)
    } else {
      // uzun intro
      const skipTimer = setTimeout(() => setSkipAvailable(true), 1500)
      const endTimer = setTimeout(() => finish(), 4000)

      return () => {
        clearTimeout(skipTimer)
        clearTimeout(endTimer)
      }
    }
  }, [alwaysPlay])

  const finish = () => {
    if (!alwaysPlay) {
      localStorage.setItem("intro_played", "1")
    }
    setVisible(false)
    onFinish()
  }

  if (!visible) return null

  return (
    <div className="intro">

      {/* 🔥 PARTICLES */}
      <div className="particles">
        {[...Array(25)].map((_, i) => (
          <span key={i}></span>
        ))}
      </div>

      {/* 🔥 CONTENT */}
      <div className="intro-content">

        {/* LOGO */}
        <Logo size={60} />

        <p className="subtitle">Strateji Başlıyor...</p>

        {/* SKIP */}
        {skipAvailable && (
          <button className="btn" onClick={finish}>
            Geç
          </button>
        )}

        {/* ALWAYS PLAY */}
        <label className="toggle">
          <input
            type="checkbox"
            checked={alwaysPlay}
            onChange={(e) => setAlwaysPlay(e.target.checked)}
          />
          Her zaman oynat
        </label>

      </div>
    </div>
  )
}