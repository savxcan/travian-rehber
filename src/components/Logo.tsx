"use client"

export default function Logo({ size = 40 }: { size?: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontWeight: "bold"
      }}
    >
      {/* ⚔️ ICON */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        style={{ filter: "drop-shadow(0 0 10px gold)" }}
      >
        <circle cx="50" cy="50" r="40" stroke="gold" strokeWidth="4" fill="none" />
        <path
          d="M50 20 L55 80 L50 75 L45 80 Z"
          fill="gold"
        >
          <animate
            attributeName="opacity"
            values="1;0.6;1"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </path>
      </svg>

      {/* TEXT */}
      <span
        style={{
          fontSize: size * 0.6,
          background: "linear-gradient(90deg, gold, orange, gold)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}
      >
        TRAVIAN PRO
      </span>
    </div>
  )
}