export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body>
        <div style={{padding: "20px"}}>
          <header style={{marginBottom: "20px"}}>
            <h1>🔥 Travian Kingdoms Rehberi</h1>
          </header>

          {children}
        </div>
      </body>
    </html>
  )
}