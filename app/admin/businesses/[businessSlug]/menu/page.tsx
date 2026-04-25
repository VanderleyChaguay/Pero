// app/admin/businesses/[businessSlug]/menu/page.tsx
// Menu management page — lists all menus for a business.
// Fetches data server-side, passes it to interactive Client Components.

import { requireBusinessAccess } from "@/lib/admin/adminAuth"
import { prisma }                from "@/lib/prisma/prisma"
import { CreateMenuForm }        from "./_components/CreateMenuForm"
import { MenuList }              from "./_components/MenuList"
import styles                    from "./page.module.css"

// ── Data fetching ─────────────────────────────────────────────────────────────

async function getMenus(businessId: string) {
  return prisma.menu.findMany({
    where:   { businessId },
    include: { _count: { select: { items: true } } },
    orderBy: { name: "asc" },
  })
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function MenuPage({
  params,
}: {
  params: Promise<{ businessSlug: string }>
}) {
  const { businessSlug } = await params
  const { business }     = await requireBusinessAccess(businessSlug)
  const menus            = await getMenus(business.id)

  const totalItems = menus.reduce((sum, m) => sum + m._count.items, 0)

  return (
    <div className={`flex flex-col ${styles.page}`}>

      {/* ── Header ── */}
      <div className={`flex items-start justify-between flex-wrap ${styles.header}`}>
        <div>
          <p className={`m-0 uppercase ${styles.eyebrow}`}>{business.name}</p>
          <h1 className={`m-0 ${styles.title}`}>Gestione Menù</h1>
          <p className={`m-0 ${styles.subtitle}`}>
            {menus.length} menù · {totalItems} voci totali
          </p>
        </div>
      </div>

      {/* ── Create menu form ── */}
      <section className={`flex flex-col ${styles.section}`}>
        <h2 className={`m-0 uppercase ${styles.sectionTitle}`}>Nuovo menù</h2>
        <CreateMenuForm businessSlug={businessSlug} />
      </section>

      {/* ── Existing menus ── */}
      <section className={`flex flex-col ${styles.section}`}>
        <h2 className={`m-0 uppercase ${styles.sectionTitle}`}>Menù esistenti</h2>
        <MenuList menus={menus} businessSlug={businessSlug} />
      </section>

    </div>
  )
}
