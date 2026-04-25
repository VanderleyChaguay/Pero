// app/admin/businesses/[businessSlug]/menu/[menuId]/page.tsx
// Menu items management page — lists all items in a menu.
// Allows creating, editing, toggling and deleting items.

import { requireBusinessAccess } from "@/lib/admin/adminAuth"
import { prisma }                from "@/lib/prisma/prisma"
import { CreateItemForm }        from "./_components/CreateItemForm"
import { ItemList }              from "./_components/ItemList"
import Link                      from "next/link"
import styles                    from "./page.module.css"
import { routes }                from "@/lib/routes"

// ── Data fetching ─────────────────────────────────────────────────────────────

async function getMenu(menuId: string, businessId: string) {
  return prisma.menu.findFirst({
    where: { id: menuId, businessId },
  })
}

async function getItems(menuId: string) {
  return prisma.menuItem.findMany({
    where:   { menuId },
    include: {
      allergens: {
        include: { allergen: true },
      },
    },
    orderBy: { order: "asc" },
  })
}

async function getAllergens() {
  return prisma.allergen.findMany({ orderBy: { nameIt: "asc" } })
}

// Serialize Prisma items — convert Decimal price to plain number
// so it can be safely passed to Client Components
function serializeItems(items: Awaited<ReturnType<typeof getItems>>) {
  return items.map(item => ({
    ...item,
    price: item.price.toNumber(),
  }))
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function MenuItemsPage({
  params,
}: {
  params: Promise<{ businessSlug: string; menuId: string }>
}) {
  const { businessSlug, menuId } = await params

  // Auth, items and allergens run in parallel — none depends on the others.
  // Only getMenu needs business.id, so it runs after auth resolves.
  const [{ business }, items, allergens] = await Promise.all([
    requireBusinessAccess(businessSlug),
    getItems(menuId),
    getAllergens(),
  ])

  const menu = await getMenu(menuId, business.id)

  // If menu doesn't belong to this business, show not found
  if (!menu) {
    return (
      <div className={`flex flex-col ${styles.notFound}`}>
        <p>Menù non trovato.</p>
        <Link
          href={routes.admin.business.menu(businessSlug)}
          className={`inline-flex items-center no-underline ${styles.backLink}`}
        >
          ← Torna ai menù
        </Link>
      </div>
    )
  }

  const availableCount = items.filter(i => i.isAvailable).length

  return (
    <div className={`flex flex-col ${styles.page}`}>

      {/* ── Header ── */}
      <div className={`flex flex-col ${styles.header}`}>
        <div>
          <Link
            href={routes.admin.business.menu(businessSlug)}
            className={`inline-flex items-center no-underline ${styles.backLink}`}
          >
            ← Menù
          </Link>
          <p className={`m-0 uppercase ${styles.eyebrow}`}>{business.name} · {menu.name}</p>
          <h1 className={`m-0 ${styles.title}`}>Gestione Voci</h1>
          <p className={`m-0 ${styles.subtitle}`}>
            {items.length} voci totali · {availableCount} disponibili
          </p>
        </div>
      </div>

      {/* ── Create item form ── */}
      <section className={`flex flex-col ${styles.section}`}>
        <h2 className={`m-0 uppercase ${styles.sectionTitle}`}>Nuova voce</h2>
        <CreateItemForm
          businessSlug={businessSlug}
          menuId={menuId}
          allergens={allergens}
        />
      </section>

      {/* ── Items list ── */}
      <section className={`flex flex-col ${styles.section}`}>
        <h2 className={`m-0 uppercase ${styles.sectionTitle}`}>Voci nel menù</h2>
        <ItemList
          items={serializeItems(items)}
          allergens={allergens}
          businessSlug={businessSlug}
          menuId={menuId}
        />
      </section>

    </div>
  )
}
