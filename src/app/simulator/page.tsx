export default function Simulator() {
  return (
    <main style={{height: "100vh"}}>
      <h2>⚔️ Saldırı Planlayıcı</h2>

      <iframe
        src="/simulator/index.html"
        style={{
          width: "100%",
          height: "90vh",
          border: "none",
          marginTop: "10px"
        }}
      />
    </main>
  )
}