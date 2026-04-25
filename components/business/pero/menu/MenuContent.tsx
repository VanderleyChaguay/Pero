// MenuContent — async Server Component.
// Fetches menus from Prisma and serializes Decimal prices before passing
// data to MenuView (Client Component).
// Filter rules: businessId + isActive = true only. Never filter by item count.

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

// ── Queries ───────────────────────────────────────────────────────────────────

async function getBusinessBySlug(slug: string) {
  return prisma.business.findUnique({
    where:  { slug },
    select: { id: true, name: true },
  })
}

async function getActiveMenus(businessId: string) {
  return prisma.menu.findMany({
    where:   { businessId, isActive: true },
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
  })
}

// ── Component ─────────────────────────────────────────────────────────────────

export async function MenuContent({ slug }: { slug: string }) {
  await connection()

  const business = await getBusinessBySlug(slug)
  if (!business) notFound()

  const rawMenus = await getActiveMenus(business.id)

  const menus: SerializedMenu[] = rawMenus.map(menu => ({
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
