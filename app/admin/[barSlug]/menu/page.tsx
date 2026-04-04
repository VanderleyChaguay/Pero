// app/admin/[barSlug]/menu/page.tsx
// Menu management page — lists all menus for a bar.
// Fetches data server-side, passes it to interactive Client Components.

import { requireBarAccess }    from "@/lib/admin/adminAuth"
import { prisma }              from "@/lib/prisma/prisma"
import { CreateMenuForm }      from "./_components/CreateMenuForm"
import { MenuList }            from "./_components/MenuList"
import styles                  from "./page.module.css"

// ── Data fetching ─────────────────────────────────────────────────────────────

async function getMenus(barId: string) {
  return prisma.menu.findMany({
    where:   { barId },
    include: { _count: { select: { items: true } } },
    orderBy: { category: "asc" },
  })
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function MenuPage({
  params,
}: {
  params: Promise<{ barSlug: string }>
}) {
  const { barSlug }    = await params
  const { bar }        = await requireBarAccess(barSlug)
  const menus          = await getMenus(bar.id)

  const totalItems = menus.reduce((sum, m) => sum + m._count.items, 0)

  return (
    <div className={styles.page}>

      {/* ── Header ── */}
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>{bar.name}</p>
          <h1 className={styles.title}>Gestione Menù</h1>
          <p className={styles.subtitle}>
            {menus.length} menù · {totalItems} voci totali
          </p>
        </div>
      </div>

      {/* ── Create menu form ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Nuovo menù</h2>
        <CreateMenuForm barSlug={barSlug} />
      </section>

      {/* ── Existing menus ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Menù esistenti</h2>
        <MenuList menus={menus} barSlug={barSlug} />
      </section>

    </div>
  )
}
