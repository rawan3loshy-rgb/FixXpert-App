import Link from "next/link"

export default function Home() {
  return (
    <main style={{
      background: "#020617",
      minHeight: "100vh",
      color: "white",
      fontFamily: "Arial",
      padding: "40px"
    }}>

    
      {/* HERO */}
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "40px" }}>
          Das Reparatursystem der Zukunft
        </h1>

        <p style={{ color: "#94a3b8" }}>
          Verwalte dein Geschäft smarter und schneller
        </p>

        <div style={{ marginTop: "20px" }}>
          <Link href="/signup">
         <button className="btn">Jetzt starten</button>
         </Link>

         <Link href="/login">
         <button className="btn-outline">Login</button>
        </Link>
        </div>
      </div>

    </main>
  )
}