"use server"

import { prisma }         from "@/lib/prisma/prisma"
import { requireAdmin }   from "@/lib/admin/adminAuth"
import { revalidatePath } from "next/cache"

// ── Types ─────────────────────────────────────────────────────────────────────

export type BarResult = {
  id:                string
  name:              string
  address:           string
  isAdmin:           boolean // user already has AdminBarAccess
  hasApplied:        boolean // user already has an AdminApplication
  applicationStatus: "PENDING" | "APPROVED" | "REJECTED" | null
}

// ── Search bars ───────────────────────────────────────────────────────────────
// Returns up to 10 results enriched with per-user admin and application status.
// Single Prisma call with nested filtered relations — no N+1.

export async function searchBars(query: string): Promise<BarResult[]> {
  const adminUser = await requireAdmin()

  if (!query || query.trim().length < 2) return []

  const bars = await prisma.bar.findMany({
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

  return bars.map(bar => ({
    id:                bar.id,
    name:              bar.name,
    address:           bar.address,
    isAdmin:           bar.admins.length > 0,
    hasApplied:        bar.applications.length > 0,
    applicationStatus: bar.applications[0]?.status ?? null,
  }))
}

// ── Apply to become admin of a bar ────────────────────────────────────────────
// Server-side enforces both rules: no existing admin access, no duplicate application.
// Uses a transaction so the check + write is atomic.

export async function applyToBar(barId: string): Promise<void> {
  const adminUser = await requireAdmin()

  await prisma.$transaction(async tx => {
    // Run both read checks in parallel inside the transaction
    const [existingAccess, existingApplication] = await Promise.all([
      tx.adminBarAccess.findUnique({
        where: { userId_barId: { userId: adminUser.id, barId } },
      }),
      tx.adminApplication.findUnique({
        where: { userId_barId: { userId: adminUser.id, barId } },
      }),
    ])

    if (existingAccess) {
      throw new Error("Sei già amministratore di questo locale")
    }

    if (existingApplication) {
      throw new Error("Hai già inviato una richiesta per questo locale")
    }

    await tx.adminApplication.create({
      data: { userId: adminUser.id, barId },
    })
  })

  // Revalidate so a hard-refresh reflects the new application
  revalidatePath("/admin/apply")
}
