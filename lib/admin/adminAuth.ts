// lib/admin-auth.ts
// Centralized authentication and authorization utilities for the admin panel
// Every admin page and Server Action should use these functions

import { createClient } from "@/lib/supabase/server"
import { prisma }       from "@/lib/prisma/prisma"
import { redirect }     from "next/navigation"
// ── Get the current Supabase session user ────────────────────────────────────
// Returns the raw Supabase user or redirects to login if not authenticated
export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  return user
}

// ── Get the AdminUser record from the database ───────────────────────────────
// Returns the full AdminUser with business access list
export async function getAdminUser(userId: string) {
  const adminUser = await prisma.adminUser.findUnique({
    where:   { id: userId },
    include: { businessAccess: { include: { business: true } } },
  })

  if (!adminUser) redirect("/login")

  return adminUser
}

// ── Require any valid admin ──────────────────────────────────────────────────
// Use this on pages accessible to all admins
export async function requireAdmin() {
  const user      = await getCurrentUser()
  const adminUser = await getAdminUser(user.id)
  return adminUser
}

// ── Require SuperAdmin ───────────────────────────────────────────────────────
// Use this on pages only SuperAdmins can access (user management, business creation)
export async function requireSuperAdmin() {
  const adminUser = await requireAdmin()

  if (!adminUser.isSuperAdmin) redirect("/admin")

  return adminUser
}

// ── Require access to a specific business ───────────────────────────────────
// SuperAdmins pass automatically — BusinessAdmins only if they have explicit access
export async function requireBusinessAccess(businessSlug: string) {
  const adminUser = await requireAdmin()

  // SuperAdmins have access to everything
  if (adminUser.isSuperAdmin) {
    const business = await prisma.business.findUnique({ where: { slug: businessSlug } })
    if (!business) redirect("/admin")
    return { adminUser, business }
  }

  // BusinessAdmins — check explicit access
  const access = adminUser.businessAccess.find(a => a.business.slug === businessSlug)
  if (!access) redirect("/admin")

  return { adminUser, business: access.business }
}
