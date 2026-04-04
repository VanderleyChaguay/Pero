"use server"

// app/admin/utenti/actions.ts
// Server Actions for user and permissions management.

import { prisma }            from "@/lib/prisma/prisma"
import { requireAdmin,
         requireSuperAdmin } from "@/lib/admin/adminAuth"
import { revalidatePath }    from "next/cache"

const REVALIDATE = "/admin/utenti"

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
      barAccess: {
        include: { bar: { select: { id: true, name: true } } },
      },
    },
    take: 8,
    orderBy: { name: "asc" },
  })
}

// ── Grant bar access to a user ────────────────────────────────────────────────
export async function grantBarAccess(userId: string, barId: string) {
  const adminUser = await requireAdmin()

  if (!adminUser.isSuperAdmin) {
    const hasAccess = adminUser.barAccess.some(a => a.barId === barId)
    if (!hasAccess) throw new Error("Non hai i permessi per questo locale")
  }

  await prisma.adminBarAccess.upsert({
    where:  { userId_barId: { userId, barId } },
    update: {},
    create: { userId, barId, grantedBy: adminUser.id },
  })

  revalidatePath(REVALIDATE)
}

// ── Revoke bar access from a user ─────────────────────────────────────────────
export async function revokeBarAccess(userId: string, barId: string) {
  const adminUser = await requireAdmin()

  if (!adminUser.isSuperAdmin) {
    const hasAccess = adminUser.barAccess.some(a => a.barId === barId)
    if (!hasAccess) throw new Error("Non hai i permessi per questo locale")
  }

  await prisma.adminBarAccess.deleteMany({ where: { userId, barId } })

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
