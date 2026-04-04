// app/admin/utenti/page.tsx
// User management page.
// SuperAdmin sees all users with their bar access.
// BarAdmin sees a simplified view to grant access to their own bars.

import { requireAdmin }     from "@/lib/admin/adminAuth"
import { prisma }            from "@/lib/prisma/prisma"
import { GrantAccessForm }   from "./_components/GrantAccessForm"
import { UserList }          from "./_components/UserList"
import styles                from "./page.module.css"

// ── Data fetching ─────────────────────────────────────────────────────────────

async function getAllUsers() {
  return prisma.adminUser.findMany({
    include: {
      barAccess: {
        include: { bar: { select: { id: true, slug: true, name: true } } },
      },
    },
    orderBy: { isSuperAdmin: "desc" },
  })
}

async function getAllBars() {
  return prisma.bar.findMany({
    select:  { id: true, slug: true, name: true },
    orderBy: { name: "asc" },
  })
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function UtentiPage() {
  const adminUser = await requireAdmin()

  // SuperAdmin: fetch all users + all bars in parallel
  // BarAdmin: only sees bars they manage (from auth data)
  const [users, allBars] = adminUser.isSuperAdmin
    ? await Promise.all([getAllUsers(), getAllBars()])
    : [[], adminUser.barAccess.map(a => a.bar)]

  return (
    <div className={styles.page}>

      {/* ── Header ── */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Amministratori</h1>
          <p className={styles.subtitle}>
            {adminUser.isSuperAdmin
              ? `${users.length} utenti registrati`
              : "Gestisci i permessi per i tuoi locali"
            }
          </p>
        </div>
      </div>

      {/* ── Grant access form ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Aggiungi accesso</h2>
        <p className={styles.sectionDesc}>
          Cerca un utente per email e dagli accesso a un locale.
          L&apos;utente deve essere già registrato nel sistema.
        </p>
        <GrantAccessForm bars={allBars} />
      </section>

      {/* ── Users list — SuperAdmin only ── */}
      {adminUser.isSuperAdmin && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Tutti gli utenti</h2>
          <UserList
            users={users}
            allBars={allBars}
            currentUserId={adminUser.id}
          />
        </section>
      )}

    </div>
  )
}
