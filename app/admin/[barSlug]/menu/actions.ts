"use server"

// app/admin/[barSlug]/menu/actions.ts
// Server Actions for menu and menu item management.
// Every action verifies bar access before touching the database.

import { prisma }           from "@/lib/prisma/prisma"
import { requireBarAccess } from "@/lib/admin/adminAuth"
import { revalidatePath }   from "next/cache"

// ── Helpers ───────────────────────────────────────────────────────────────────

function revalidateMenu(barSlug: string) {
  revalidatePath(`/admin/${barSlug}/menu`)
}

function revalidateItems(barSlug: string, menuId: string) {
  revalidatePath(`/admin/${barSlug}/menu/${menuId}`)
}

// ── Menu actions ──────────────────────────────────────────────────────────────

export async function createMenu(barSlug: string, formData: FormData) {
  const { bar } = await requireBarAccess(barSlug)

  const name     = (formData.get("name") as string).trim()
  const category = formData.get("category") as string

  if (!name || !category) return

  await prisma.menu.create({
    data: {
      barId:    bar.id,
      name,
      category: category as "DRINKS" | "FOOD" | "WINE",
      isActive: true,
    },
  })

  revalidateMenu(barSlug)
}

export async function toggleMenu(barSlug: string, menuId: string, current: boolean) {
  await requireBarAccess(barSlug)

  await prisma.menu.update({
    where: { id: menuId },
    data:  { isActive: !current },
  })

  revalidateMenu(barSlug)
}

export async function deleteMenu(barSlug: string, menuId: string) {
  await requireBarAccess(barSlug)

  // Delete in order to respect foreign key constraints
  await prisma.menuItemAllergen.deleteMany({
    where: { menuItem: { menuId } },
  })
  await prisma.menuItem.deleteMany({ where: { menuId } })
  await prisma.menu.delete({ where: { id: menuId } })

  revalidateMenu(barSlug)
}

// ── Menu item actions ─────────────────────────────────────────────────────────

export async function createMenuItem(
  barSlug:     string,
  menuId:      string,
  formData:    FormData,
  allergenIds: string[],
) {
  await requireBarAccess(barSlug)

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

  revalidateItems(barSlug, menuId)
}

export async function updateMenuItem(
  barSlug:  string,
  itemId:   string,
  menuId:   string,
  formData: FormData,
) {
  await requireBarAccess(barSlug)

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

  revalidateItems(barSlug, menuId)
}

export async function toggleMenuItem(
  barSlug:  string,
  itemId:   string,
  menuId:   string,
  current:  boolean,
) {
  await requireBarAccess(barSlug)

  await prisma.menuItem.update({
    where: { id: itemId },
    data:  { isAvailable: !current },
  })

  revalidateItems(barSlug, menuId)
}

export async function deleteMenuItem(
  barSlug: string,
  itemId:  string,
  menuId:  string,
) {
  await requireBarAccess(barSlug)

  await prisma.menuItemAllergen.deleteMany({ where: { menuItemId: itemId } })
  await prisma.menuItem.delete({ where: { id: itemId } })

  revalidateItems(barSlug, menuId)
}

export async function updateItemAllergens(
  barSlug:     string,
  itemId:      string,
  menuId:      string,
  allergenIds: string[],
) {
  await requireBarAccess(barSlug)

  // Replace all allergen links atomically
  await prisma.$transaction(async (tx) => {
    await tx.menuItemAllergen.deleteMany({ where: { menuItemId: itemId } })
    if (allergenIds.length > 0) {
      await tx.menuItemAllergen.createMany({
        data: allergenIds.map(allergenId => ({ menuItemId: itemId, allergenId })),
      })
    }
  })

  revalidateItems(barSlug, menuId)
}