"use server"

// app/admin/utenti/actions.ts
// Server Actions for user and permissions management.

import { prisma }            from "@/lib/prisma/prisma"
import { requireAdmin,
         requireSuperAdmin } from "@/lib/admin/adminAuth"
import { revalidatePath }    from "next/cache"

const REVALIDATE = "/admin/user"

// ── Search users by name or email ─────────────────────────────────────────────
// Returns up to 8 results — used by the search bar in the UI
export async function searchUsers(query: string) {
  await requireAdmin()

  if (!query || query.trim().length < 2) return []

  const q = query.trim().toLowerCase()

  return prisma.adminUser.findMany({
    where: {
      OR: [
        { name:  { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
      ],
    },
    select: {
      id:           true,
      name:         true,
      email:        true,
      isSuperAdmin: true,
      businessAccess: {
        include: { business: { select: { id: true, name: true } } },
      },
    },
    take: 8,
    orderBy: { name: "asc" },
  })
}

// ── Grant business access to a user ──────────────────────────────────────────
export async function grantBusinessAccess(userId: string, businessId: string) {
  const adminUser = await requireAdmin()

  if (!adminUser.isSuperAdmin) {
    const hasAccess = adminUser.businessAccess.some(a => a.businessId === businessId)
    if (!hasAccess) throw new Error("Non hai i permessi per questo locale")
  }

  await prisma.adminBusinessAccess.upsert({
    where:  { userId_businessId: { userId, businessId } },
    update: {},
    create: { userId, businessId, grantedBy: adminUser.id },
  })

  revalidatePath(REVALIDATE)
}

// ── Revoke business access from a user ───────────────────────────────────────
export async function revokeBusinessAccess(userId: string, businessId: string) {
  const adminUser = await requireAdmin()

  if (!adminUser.isSuperAdmin) {
    const hasAccess = adminUser.businessAccess.some(a => a.businessId === businessId)
    if (!hasAccess) throw new Error("Non hai i permessi per questo locale")
  }

  await prisma.adminBusinessAccess.deleteMany({ where: { userId, businessId } })

  revalidatePath(REVALIDATE)
}

// ── Toggle SuperAdmin status ──────────────────────────────────────────────────
export async function toggleSuperAdmin(userId: string, current: boolean) {
  const adminUser = await requireSuperAdmin()

  if (userId === adminUser.id) {
    throw new Error("Non puoi modificare il tuo stesso ruolo")
  }

  await prisma.adminUser.update({
    where: { id: userId },
    data:  { isSuperAdmin: !current },
  })

  revalidatePath(REVALIDATE)
}
