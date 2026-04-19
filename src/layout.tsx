import Logo from "@/components/Logo"

export default function RootLayout({ children }: any) {
  return (
    <html lang="tr">
      <body>

        {/* 🔥 HEADER */}
        <div style={{
          padding: "15px 20px",
          borderBottom: "1px solid #222"
        }}>
          <Logo size={40} />
        </div>

        {children}

      </body>
    </html>
  )
}