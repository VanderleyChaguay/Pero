// app/admin/layout.tsx
// Layout for all admin pages — includes sidebar navigation and logout button
// Only reachable if the user is authenticated (enforced by proxy.ts)

import { LogoutButton } from "@/components/logout-button"
import Link from "next/link"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "sans-serif" }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: "240px",
        background: "#0F0A08",
        color: "#F5F0E8",
        display: "flex",
        flexDirection: "column",
        padding: "2rem 1.5rem",
        gap: "0.5rem",
        flexShrink: 0,
      }}>
        <p style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(245,240,232,0.4)", marginBottom: "1rem" }}>
          Birro Admin
        </p>

        <Link href="/admin" style={{ color: "#F5F0E8", textDecoration: "none", fontSize: "0.9rem", padding: "0.5rem 0" }}>
          Dashboard
        </Link>

        <p style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(245,240,232,0.3)", marginTop: "1rem", marginBottom: "0.5rem" }}>
          Però
        </p>
        <Link href="/admin/pero/menu" style={{ color: "rgba(245,240,232,0.7)", textDecoration: "none", fontSize: "0.85rem", padding: "0.4rem 0" }}>
          Menù
        </Link>
        <Link href="/admin/pero/eventi" style={{ color: "rgba(245,240,232,0.7)", textDecoration: "none", fontSize: "0.85rem", padding: "0.4rem 0" }}>
          Eventi
        </Link>
        <Link href="/admin/pero/configurazione" style={{ color: "rgba(245,240,232,0.7)", textDecoration: "none", fontSize: "0.85rem", padding: "0.4rem 0" }}>
          Configurazione
        </Link>

        <div style={{ marginTop: "auto" }}>
          <LogoutButton />
        </div>
      </aside>

      {/* ── Main content ── */}
      <main style={{ flex: 1, padding: "2rem", background: "#F5F0E8" }}>
        {children}
      </main>

    </div>
  )
}