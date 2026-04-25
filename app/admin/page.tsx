// app/admin/page.tsx
// Admin dashboard — entry point after login.
// SuperAdmin sees global stats + all businesses.
// BusinessAdmin sees only their assigned businesses.

import { requireAdmin } from "@/lib/admin/adminAuth"
import { prisma }       from "@/lib/prisma/prisma"
import { routes }       from "@/lib/routes"
import Link             from "next/link"
import clsx             from "clsx"
import styles           from "./page.module.css"

// ── Data fetching ─────────────────────────────────────────────────────────────

async function getSuperAdminStats() {
  const [businessCount, adminCount, menuItemCount] = await Promise.all([
    prisma.business.count(),
    prisma.adminUser.count(),
    prisma.menuItem.count(),
  ])
  return { businessCount, adminCount, menuItemCount }
}

async function getBusinessesForAdmin(businessIds: string[]) {
  return prisma.business.findMany({
    where:   { id: { in: businessIds } },
    include: { _count: { select: { menus: true, events: true } } },
    orderBy: { name: "asc" },
  })
}

async function getAllBusinesses() {
  return prisma.business.findMany({
    include: { _count: { select: { menus: true, events: true } } },
    orderBy: { name: "asc" },
  })
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function AdminDashboardPage() {
  const adminUser = await requireAdmin()

  // Parallelize business + stats queries — they don't depend on each other
  let businesses: Awaited<ReturnType<typeof getAllBusinesses>>
  let stats:      Awaited<ReturnType<typeof getSuperAdminStats>> | null = null

  if (adminUser.isSuperAdmin) {
    ;[businesses, stats] = await Promise.all([
      getAllBusinesses(),
      getSuperAdminStats(),
    ])
  } else {
    businesses = await getBusinessesForAdmin(
      adminUser.businessAccess.map(a => a.businessId)
    )
  }

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? "Buongiorno" :
    hour < 18 ? "Buon pomeriggio" :
                "Buonasera"

  return (
    <div className={clsx("flex flex-col", styles.page)}>

      {/* ── Header ── */}
      <div className={clsx("flex items-start justify-between flex-wrap", styles.header)}>
        <div>
          <h1 className={styles.title}>
            {greeting}, {adminUser.name.split(" ")[0]}.
          </h1>
          <p className={styles.subtitle}>
            {adminUser.isSuperAdmin
              ? "Hai accesso completo a tutti i locali e gli amministratori."
              : `Gestisci ${businesses.length === 1 ? "il tuo locale" : "i tuoi locali"}.`
            }
          </p>
        </div>

        {adminUser.isSuperAdmin && (
          <div className={clsx("flex shrink-0 flex-wrap", styles.headerActions)}>
            <Link
              href={routes.admin.newBusiness}
              className={clsx("inline-flex items-center whitespace-nowrap no-underline", styles.btnPrimary)}
            >
              + Nuovo locale
            </Link>
            <Link
              href={routes.admin.users}
              className={clsx("inline-flex items-center whitespace-nowrap no-underline", styles.btnSecondary)}
            >
              Amministratori
            </Link>
          </div>
        )}
      </div>

      {/* ── SuperAdmin global stats ── */}
      {stats && (
        <div className={clsx("grid grid-cols-3", styles.statsGrid)}>
          <StatCard label="Locali attivi"  value={stats.businessCount} />
          <StatCard label="Amministratori" value={stats.adminCount} />
          <StatCard label="Voci di menù"   value={stats.menuItemCount} />
        </div>
      )}

      {/* ── Businesses section ── */}
      <div className={clsx("flex flex-col", styles.section)}>
        <h2 className={styles.sectionTitle}>
          {adminUser.isSuperAdmin ? "Tutti i locali" : "I tuoi locali"}
        </h2>

        {businesses.length === 0 ? (
          <div className={clsx("flex flex-col items-start", styles.empty)}>
            <p>Nessun locale trovato.</p>
            {adminUser.isSuperAdmin && (
              <Link
                href={routes.admin.newBusiness}
                className={clsx("inline-flex items-center whitespace-nowrap no-underline", styles.btnPrimary)}
              >
                Crea il primo locale
              </Link>
            )}
          </div>
        ) : (
          <div className={styles.barsGrid}>
            {businesses.map(business => (
              <BusinessCard key={business.id} business={business} />
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
    <div className={clsx("flex flex-col", styles.statCard)}>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  )
}

// ── Business card ─────────────────────────────────────────────────────────────

function BusinessCard({ business }: {
  business: {
    id:      string
    slug:    string
    name:    string
    address: string
    _count:  { menus: number; events: number }
  }
}) {
  return (
    <div className={clsx("flex flex-col", styles.barCard)}>

      <div className={clsx("flex flex-col", styles.barCardHeader)}>
        <h3 className={styles.barName}>{business.name}</h3>
        <p className={styles.barAddress}>{business.address}</p>
      </div>

      <div className={clsx("flex items-center", styles.barStats)}>
        <span className={styles.barStat}>{business._count.menus} menù</span>
        <span className={styles.barStatDivider}>·</span>
        <span className={styles.barStat}>{business._count.events} eventi</span>
      </div>

      <div className={clsx("flex flex-wrap", styles.barActions)}>
        <Link
          href={routes.admin.business.menu(business.slug)}
          className={clsx("inline-flex items-center whitespace-nowrap no-underline", styles.barAction)}
        >
          Menù
        </Link>
        <Link
          href={routes.admin.business.events(business.slug)}
          className={clsx("inline-flex items-center whitespace-nowrap no-underline", styles.barAction)}
        >
          Eventi
        </Link>
        <Link
          href={routes.admin.business.settings(business.slug)}
          className={clsx("inline-flex items-center whitespace-nowrap no-underline", styles.barAction)}
        >
          Impostazioni
        </Link>
      </div>

    </div>
  )
}
