// app/admin/page.tsx
// Admin dashboard — entry point after login.
// SuperAdmin sees global stats + all bars.
// BarAdmin sees only their assigned bars.

import { requireAdmin }   from "@/lib/admin/adminAuth"
import { prisma }         from "@/lib/prisma/prisma"
import { routes }         from "@/lib/routes"
import Link               from "next/link"
import styles             from "./page.module.css"

// ── Data fetching ─────────────────────────────────────────────────────────────

async function getSuperAdminStats() {
  const [barCount, adminCount, menuItemCount] = await Promise.all([
    prisma.bar.count(),
    prisma.adminUser.count(),
    prisma.menuItem.count(),
  ])
  return { barCount, adminCount, menuItemCount }
}

async function getBarsForAdmin(barIds: string[]) {
  return prisma.bar.findMany({
    where:   { id: { in: barIds } },
    include: { _count: { select: { menus: true, events: true } } },
    orderBy: { name: "asc" },
  })
}

async function getAllBars() {
  return prisma.bar.findMany({
    include: { _count: { select: { menus: true, events: true } } },
    orderBy: { name: "asc" },
  })
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function AdminDashboardPage() {
  const adminUser = await requireAdmin()

  // Parallelize bar + stats queries — they don't depend on each other
  let bars:  Awaited<ReturnType<typeof getAllBars>>
  let stats: Awaited<ReturnType<typeof getSuperAdminStats>> | null = null

  if (adminUser.isSuperAdmin) {
    ;[bars, stats] = await Promise.all([
      getAllBars(),
      getSuperAdminStats(),
    ])
  } else {
    bars = await getBarsForAdmin(
      adminUser.barAccess.map(a => a.barId)
    )
  }

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? "Buongiorno" :
    hour < 18 ? "Buon pomeriggio" :
                "Buonasera"

  return (
    <div className={styles.page}>

      {/* ── Header ── */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>
            {greeting}, {adminUser.name.split(" ")[0]}.
          </h1>
          <p className={styles.subtitle}>
            {adminUser.isSuperAdmin
              ? "Hai accesso completo a tutti i locali e gli amministratori."
              : `Gestisci ${bars.length === 1 ? "il tuo locale" : "i tuoi locali"}.`
            }
          </p>
        </div>

        {adminUser.isSuperAdmin && (
          <div className={styles.headerActions}>
            <Link href={routes.admin.newBar} className={styles.btnPrimary}>
              + Nuovo locale
            </Link>
            <Link href={routes.admin.users} className={styles.btnSecondary}>
              Amministratori
            </Link>
          </div>
        )}
      </div>

      {/* ── SuperAdmin global stats ── */}
      {stats && (
        <div className={styles.statsGrid}>
          <StatCard label="Locali attivi"  value={stats.barCount} />
          <StatCard label="Amministratori" value={stats.adminCount} />
          <StatCard label="Voci di menù"   value={stats.menuItemCount} />
        </div>
      )}

      {/* ── Bars section ── */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          {adminUser.isSuperAdmin ? "Tutti i locali" : "I tuoi locali"}
        </h2>

        {bars.length === 0 ? (
          <div className={styles.empty}>
            <p>Nessun locale trovato.</p>
            {adminUser.isSuperAdmin && (
              <Link href={routes.admin.newBar} className={styles.btnPrimary}>
                Crea il primo locale
              </Link>
            )}
          </div>
        ) : (
          <div className={styles.barsGrid}>
            {bars.map(bar => (
              <BarCard key={bar.id} bar={bar} />
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className={styles.statCard}>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  )
}

// ── Bar card ──────────────────────────────────────────────────────────────────

function BarCard({ bar }: {
  bar: {
    id:      string
    slug:    string
    name:    string
    address: string
    _count:  { menus: number; events: number }
  }
}) {
  return (
    <div className={styles.barCard}>

      <div className={styles.barCardHeader}>
        <h3 className={styles.barName}>{bar.name}</h3>
        <p className={styles.barAddress}>{bar.address}</p>
      </div>

      <div className={styles.barStats}>
        <span className={styles.barStat}>{bar._count.menus} menù</span>
        <span className={styles.barStatDivider}>·</span>
        <span className={styles.barStat}>{bar._count.events} eventi</span>
      </div>

      <div className={styles.barActions}>
        <Link href={routes.admin.bar.menu(bar.slug)}     className={styles.barAction}>Menù</Link>
        <Link href={routes.admin.bar.events(bar.slug)}   className={styles.barAction}>Eventi</Link>
        <Link href={routes.admin.bar.settings(bar.slug)} className={styles.barAction}>Impostazioni</Link>
      </div>

    </div>
  )
}
