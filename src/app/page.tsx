"use client"

import { useEffect, useState } from "react"
import { apiGetGuides } from "../lib/api"

export default function Guides() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    apiGetGuides().then(setData)
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h2>Rehberler</h2>

      {data.map(g => (
        <div key={g.id}>
          <h3>{g.title}</h3>
          <p>{g.content}</p>
          <small>{g.category}</small>
        </div>
      ))}
    </div>
  )
}