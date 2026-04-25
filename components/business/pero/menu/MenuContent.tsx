// MenuContent — async Server Component.
// Single Prisma query fetches business name + all active menus + items in one
// round trip. Decimal prices are serialized before crossing the server→client
// boundary. No grouping logic — menus are passed as a flat array.

import { connection } from "next/server"
import { prisma }     from "@/lib/prisma/prisma"
import { notFound }   from "next/navigation"
import { MenuView }   from "./MenuView"

// ── Public types ──────────────────────────────────────────────────────────────

export type SerializedItem = {
  id:          string
  name:        string
  description: string
  price:       number        // Prisma Decimal → plain number
  imageUrl:    string | null
  isAvailable: boolean
  allergens:   { allergen: { nameIt: string; slug: string } }[]
}

export type SerializedMenu = {
  id:    string
  name:  string
  items: SerializedItem[]
}

// ── Query — single round trip ─────────────────────────────────────────────────
// Fetches business + menus + items in one DB call.
// Filter: isActive = true on menus. Items are never filtered — an empty menu
// renders as an empty-state tab, not as a missing tab.

async function getMenuData(slug: string) {
  return prisma.business.findUnique({
    where:  { slug },
    select: {
      name: true,
      menus: {
        where:   { isActive: true },
        orderBy: { name: "asc" },
        select: {
          id:   true,
          name: true,
          items: {
            orderBy: { order: "asc" },
            select: {
              id:          true,
              name:        true,
              description: true,
              price:       true,
              imageUrl:    true,
              isAvailable: true,
              allergens: {
                select: {
                  allergen: { select: { nameIt: true, slug: true } },
                },
              },
            },
          },
        },
      },
    },
  })
}

// ── Component ─────────────────────────────────────────────────────────────────

export async function MenuContent({ slug }: { slug: string }) {
  await connection()

  const business = await getMenuData(slug)
  if (!business) notFound()

  const menus: SerializedMenu[] = business.menus.map(menu => ({
    id:    menu.id,
    name:  menu.name,
    items: (menu.items ?? []).map(item => ({
      ...item,
      price: item.price.toNumber(),
    })),
  }))

  return (
    <MenuView
      businessName={business.name}
      menus={menus}
    />
  )
}
