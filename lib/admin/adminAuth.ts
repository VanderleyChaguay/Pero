// lib/admin/adminAuth.ts
// Auth and authorization utilities for the admin panel.
// Every admin page and Server Action must use these functions.

import { createClient } from "@/lib/supabase/server"
import { prisma }       from "@/lib/prisma/prisma"
import { redirect }     from "next/navigation"

// ── Session ───────────────────────────────────────────────────────────────────
// getClaims() validates the JWT signature and expiry locally — no network call.
// The proxy middleware already runs getClaims() + refreshes the token before
// this code executes, so the JWT in the cookie is guaranteed fresh.
// getUser() would add a redundant Supabase round trip (~200–400 ms) on every
// admin request without any additional security benefit in this setup.

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const claims   = data?.claims
  if (!claims) redirect("/login")
  return claims
}

// ── Admin user ────────────────────────────────────────────────────────────────
// Full include kept for requireAdmin / requireSuperAdmin paths that may
// need the business access list (e.g. sidebar rendering).

export async function getAdminUser(userId: string) {
  const adminUser = await prisma.adminUser.findUnique({
    where:   { id: userId },
    include: { businessAccess: { include: { business: true } } },
  })
  if (!adminUser) redirect("/login")
  return adminUser
}

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
// Runs the admin user lookup and business lookup in parallel.
// businessAccess is filtered server-side to the requested slug — no
// client-side .find() over a full list of businesses.

export async function requireBusinessAccess(businessSlug: string) {
  const user = await getCurrentUser()

  const [adminUser, business] = await Promise.all([
    prisma.adminUser.findUnique({
      where:  { id: user.sub },
      select: {
        id:           true,
        isSuperAdmin: true,
        businessAccess: {
          where:  { business: { slug: businessSlug } },
          select: { businessId: true },
          take:   1,
        },
      },
    }),
    prisma.business.findUnique({
      where:  { slug: businessSlug },
      select: { id: true, slug: true, name: true },
    }),
  ])

  if (!adminUser) redirect("/login")
  if (!business)  redirect("/admin")
  if (!adminUser.isSuperAdmin && adminUser.businessAccess.length === 0) redirect("/admin")

  return { adminUser, business }
}
