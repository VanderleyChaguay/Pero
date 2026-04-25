"use server"

import { prisma }         from "@/lib/prisma/prisma"
import { requireAdmin }   from "@/lib/admin/adminAuth"
import { revalidatePath } from "next/cache"

// ── Types ─────────────────────────────────────────────────────────────────────

export type BusinessResult = {
  id:                string
  name:              string
  address:           string
  isAdmin:           boolean // user already has AdminBusinessAccess
  hasApplied:        boolean // user already has an AdminApplication
  applicationStatus: "PENDING" | "APPROVED" | "REJECTED" | null
}

// ── Search businesses ─────────────────────────────────────────────────────────
// Returns up to 10 results enriched with per-user admin and application status.
// Single Prisma call with nested filtered relations — no N+1.

export async function searchBusinesses(query: string): Promise<BusinessResult[]> {
  const adminUser = await requireAdmin()

  if (!query || query.trim().length < 2) return []

  const businesses = await prisma.business.findMany({
    where: {
      OR: [
        { name:    { contains: query.trim(), mode: "insensitive" } },
        { address: { contains: query.trim(), mode: "insensitive" } },
      ],
    },
    select: {
      id:      true,
      name:    true,
      address: true,
      // Filter nested relations to current user — Prisma batches these as IN queries, not N+1
      admins: {
        where:  { userId: adminUser.id },
        select: { userId: true },
        take:   1,
      },
      applications: {
        where:  { userId: adminUser.id },
        select: { status: true },
        take:   1,
      },
    },
    take:    10,
    orderBy: { name: "asc" },
  })

  return businesses.map(business => ({
    id:                business.id,
    name:              business.name,
    address:           business.address,
    isAdmin:           business.admins.length > 0,
    hasApplied:        business.applications.length > 0,
    applicationStatus: business.applications[0]?.status ?? null,
  }))
}

// ── Apply to become admin of a business ──────────────────────────────────────
// Server-side enforces both rules: no existing admin access, no duplicate application.
// Uses a transaction so the check + write is atomic.

export async function applyToBusiness(businessId: string): Promise<void> {
  const adminUser = await requireAdmin()

  await prisma.$transaction(async tx => {
    // Run both read checks in parallel inside the transaction
    const [existingAccess, existingApplication] = await Promise.all([
      tx.adminBusinessAccess.findUnique({
        where: { userId_businessId: { userId: adminUser.id, businessId } },
      }),
      tx.adminApplication.findUnique({
        where: { userId_businessId: { userId: adminUser.id, businessId } },
      }),
    ])

    if (existingAccess) {
      throw new Error("Sei già amministratore di questo locale")
    }

    if (existingApplication) {
      throw new Error("Hai già inviato una richiesta per questo locale")
    }

    await tx.adminApplication.create({
      data: { userId: adminUser.id, businessId },
    })
  })

  // Revalidate so a hard-refresh reflects the new application
  revalidatePath("/admin/apply")
}
