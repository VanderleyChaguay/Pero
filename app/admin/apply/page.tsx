// app/admin/apply/page.tsx
// Server Component — authenticates and renders the apply shell.
// All business status data is fetched inside the searchBusinesses Server Action
// so results are always fresh and never stale from page-load time.

import { requireAdmin } from "@/lib/admin/adminAuth"
import { ApplyClient }  from "./_components/ApplyClient"
import styles           from "./page.module.css"

export const metadata = { title: "Diventa admin — Birro" }

export default async function ApplyPage() {
  // Auth check only — no data pre-fetching needed here.
  // searchBusinesses enriches results with isAdmin/hasApplied on every call.
  await requireAdmin()

  return (
    <div className={`flex flex-col ${styles.page}`}>

      {/* ── Header ── */}
      <div className={`flex items-start justify-between flex-wrap ${styles.header}`}>
        <div>
          <h1 className={`m-0 ${styles.title}`}>Diventa admin</h1>
          <p className={`m-0 ${styles.subtitle}`}>
            Cerca un locale e invia una richiesta di accesso.
            Sarai contattato quando la tua richiesta verrà esaminata.
          </p>
        </div>
      </div>

      {/* ── Search + apply ── */}
      <ApplyClient />

    </div>
  )
}
