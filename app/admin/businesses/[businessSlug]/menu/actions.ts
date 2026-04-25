"use server"

// app/admin/businesses/[businessSlug]/menu/actions.ts
// Server Actions for menu and menu item management.
// Every action verifies business access before touching the database.

import { prisma }                from "@/lib/prisma/prisma"
import { requireBusinessAccess } from "@/lib/admin/adminAuth"
import { revalidatePath }        from "next/cache"

// ── Helpers ───────────────────────────────────────────────────────────────────

function revalidateMenu(businessSlug: string) {
  revalidatePath(`/admin/businesses/${businessSlug}/menu`)
}

function revalidateItems(businessSlug: string, menuId: string) {
  revalidatePath(`/admin/businesses/${businessSlug}/menu/${menuId}`)
}

// ── Menu actions ──────────────────────────────────────────────────────────────

export async function createMenu(businessSlug: string, formData: FormData) {
  const { business } = await requireBusinessAccess(businessSlug)

  const name     = (formData.get("name") as string).trim()
  const category = formData.get("category") as string

  if (!name || !category) return

  await prisma.menu.create({
    data: {
      businessId: business.id,
      name,
      category:   category as "DRINKS" | "FOOD" | "WINE",
      isActive:   true,
    },
  })

  revalidateMenu(businessSlug)
}

export async function toggleMenu(businessSlug: string, menuId: string, current: boolean) {
  const { business } = await requireBusinessAccess(businessSlug)

  const menu = await prisma.menu.findFirst({ where: { id: menuId, businessId: business.id }, select: { id: true } })
  if (!menu) return

  await prisma.menu.update({
    where: { id: menuId },
    data:  { isActive: !current },
  })

  revalidateMenu(businessSlug)
}

export async function deleteMenu(businessSlug: string, menuId: string) {
  const { business } = await requireBusinessAccess(businessSlug)

  const menu = await prisma.menu.findFirst({ where: { id: menuId, businessId: business.id }, select: { id: true } })
  if (!menu) return

  // Wrapped in transaction — all three deletes must succeed together
  await prisma.$transaction(async (tx) => {
    await tx.menuItemAllergen.deleteMany({ where: { menuItem: { menuId } } })
    await tx.menuItem.deleteMany({ where: { menuId } })
    await tx.menu.delete({ where: { id: menuId } })
  })

  revalidateMenu(businessSlug)
}

// ── Menu item actions ─────────────────────────────────────────────────────────

export async function createMenuItem(
  businessSlug: string,
  menuId:       string,
  formData:     FormData,
  allergenIds:  string[],
) {
  const { business } = await requireBusinessAccess(businessSlug)

  const menu = await prisma.menu.findFirst({ where: { id: menuId, businessId: business.id }, select: { id: true } })
  if (!menu) return

  const name        = (formData.get("name")        as string).trim()
  const description = (formData.get("description") as string | null ?? "").trim()
  const price       = parseFloat(formData.get("price") as string)
  const ingredients = (formData.get("ingredients") as string)
    .split(",")
    .map(i => i.trim())
    .filter(Boolean)

  if (!name || isNaN(price)) return

  // Create item and allergen links in a single transaction
  await prisma.$transaction(async (tx) => {
    const item = await tx.menuItem.create({
      data: {
        menuId,
        name,
        description,
        price,
        ingredients,
        isAvailable: true,
        order:       0,
      },
    })

    if (allergenIds.length > 0) {
      await tx.menuItemAllergen.createMany({
        data: allergenIds.map(allergenId => ({
          menuItemId: item.id,
          allergenId,
        })),
      })
    }
  })

  revalidateItems(businessSlug, menuId)
}

export async function updateMenuItem(
  businessSlug: string,
  itemId:       string,
  menuId:       string,
  formData:     FormData,
) {
  const { business } = await requireBusinessAccess(businessSlug)

  const item = await prisma.menuItem.findFirst({ where: { id: itemId, menu: { businessId: business.id } }, select: { id: true } })
  if (!item) return

  const name        = (formData.get("name")        as string).trim()
  const description = (formData.get("description") as string | null ?? "").trim()
  const price       = parseFloat(formData.get("price") as string)
  const ingredients = (formData.get("ingredients") as string)
    .split(",")
    .map(i => i.trim())
    .filter(Boolean)

  if (!name || isNaN(price)) return

  await prisma.menuItem.update({
    where: { id: itemId },
    data:  { name, description, price, ingredients },
  })

  revalidateItems(businessSlug, menuId)
}

export async function toggleMenuItem(
  businessSlug: string,
  itemId:       string,
  menuId:       string,
  current:      boolean,
) {
  const { business } = await requireBusinessAccess(businessSlug)

  const item = await prisma.menuItem.findFirst({ where: { id: itemId, menu: { businessId: business.id } }, select: { id: true } })
  if (!item) return

  await prisma.menuItem.update({
    where: { id: itemId },
    data:  { isAvailable: !current },
  })

  revalidateItems(businessSlug, menuId)
}

export async function deleteMenuItem(
  businessSlug: string,
  itemId:       string,
  menuId:       string,
) {
  const { business } = await requireBusinessAccess(businessSlug)

  const item = await prisma.menuItem.findFirst({ where: { id: itemId, menu: { businessId: business.id } }, select: { id: true } })
  if (!item) return

  await prisma.menuItemAllergen.deleteMany({ where: { menuItemId: itemId } })
  await prisma.menuItem.delete({ where: { id: itemId } })

  revalidateItems(businessSlug, menuId)
}

export async function updateItemAllergens(
  businessSlug: string,
  itemId:       string,
  menuId:       string,
  allergenIds:  string[],
) {
  const { business } = await requireBusinessAccess(businessSlug)

  const item = await prisma.menuItem.findFirst({ where: { id: itemId, menu: { businessId: business.id } }, select: { id: true } })
  if (!item) return

  // Replace all allergen links atomically
  await prisma.$transaction(async (tx) => {
    await tx.menuItemAllergen.deleteMany({ where: { menuItemId: itemId } })
    if (allergenIds.length > 0) {
      await tx.menuItemAllergen.createMany({
        data: allergenIds.map(allergenId => ({ menuItemId: itemId, allergenId })),
      })
    }
  })

  revalidateItems(businessSlug, menuId)
}
