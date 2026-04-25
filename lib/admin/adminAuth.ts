// lib/admin/adminAuth.ts
// Auth and authorization utilities for the admin panel.
// Every admin page and Server Action must use these functions.
//
// cache() from React deduplicates calls within the same request — a layout
// calling requireAdmin() and a page calling requireBusinessAccess() share
// the same getCurrentUser() and getAdminUser() results at zero extra cost.

import { cache }        from "react"
import { createClient } from "@/lib/supabase/server"
import { prisma }       from "@/lib/prisma/prisma"
import { redirect }     from "next/navigation"

// ── Session ───────────────────────────────────────────────────────────────────
// getClaims() validates the JWT signature locally — no network call.
// Middleware refreshes the token before this runs, so the JWT is always fresh.

export const getCurrentUser = cache(async () => {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const claims   = data?.claims
  if (!claims) redirect("/login")
  return claims
})

// ── Admin user ────────────────────────────────────────────────────────────────
// select (not include) to avoid fetching columns no caller needs.
// Cached per-request so multiple callers pay one DB round trip.

export const getAdminUser = cache(async (userId: string) => {
  const adminUser = await prisma.adminUser.findUnique({
    where:  { id: userId },
    select: {
      id:           true,
      email:        true,
      name:         true,
      isSuperAdmin: true,
      businessAccess: {
        select: {
          businessId: true,
          business: { select: { id: true, slug: true, name: true } },
        },
      },
    },
  })
  if (!adminUser) redirect("/login")
  return adminUser
})

// ── Require any valid admin ───────────────────────────────────────────────────

export async function requireAdmin() {
  const user      = await getCurrentUser()
  const adminUser = await getAdminUser(user.sub)
  return adminUser
}

// ── Require SuperAdmin ────────────────────────────────────────────────────────

export async function requireSuperAdmin() {
  const adminUser = await requireAdmin()
  if (!adminUser.isSuperAdmin) redirect("/admin")
  return adminUser
}

// ── Require access to a specific business ────────────────────────────────────
// Reuses the cached getAdminUser result — no second admin-user DB query.
// Business is found from the cached access list; superAdmins without a direct
// access row fall back to a single business lookup.

export async function requireBusinessAccess(businessSlug: string) {
  const user      = await getCurrentUser()
  const adminUser = await getAdminUser(user.sub)

  const accessEntry = adminUser.businessAccess.find(a => a.business.slug === businessSlug)
  const hasAccess   = adminUser.isSuperAdmin || Boolean(accessEntry)

  if (!hasAccess) redirect("/admin")

  const business = accessEntry?.business ?? await prisma.business.findUnique({
    where:  { slug: businessSlug },
    select: { id: true, slug: true, name: true },
  })

  if (!business) redirect("/admin")

  return { adminUser, business }
}
