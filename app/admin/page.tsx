// app/admin/page.tsx
// Admin dashboard — entry point after login

export default function AdminPage() {
  return (
    <div>
      <h1 style={{ fontFamily: "Georgia, serif", fontSize: "2rem", fontWeight: 300, marginBottom: "0.5rem" }}>
        Benvenuto nel pannello admin
      </h1>
      <p style={{ color: "#3A2F2A", fontSize: "0.9rem" }}>
        Seleziona un bar dalla barra laterale per iniziare.
      </p>
    </div>
  )
}