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
// Returns the full AdminUser with bar access list
export async function getAdminUser(userId: string) {
  const adminUser = await prisma.adminUser.findUnique({
    where:   { id: userId },
    include: { barAccess: { include: { bar: true } } },
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
// Use this on pages only SuperAdmins can access (user management, bar creation)
export async function requireSuperAdmin() {
  const adminUser = await requireAdmin()

  if (!adminUser.isSuperAdmin) redirect("/admin")

  return adminUser
}

// ── Require access to a specific bar ────────────────────────────────────────
// SuperAdmins pass automatically — BarAdmins only if they have explicit access
export async function requireBarAccess(barSlug: string) {
  const adminUser = await requireAdmin()

  // SuperAdmins have access to everything
  if (adminUser.isSuperAdmin) {
    const bar = await prisma.bar.findUnique({ where: { slug: barSlug } })
    if (!bar) redirect("/admin")
    return { adminUser, bar }
  }

  // BarAdmins — check explicit access
  const access = adminUser.barAccess.find(a => a.bar.slug === barSlug)
  if (!access) redirect("/admin")

  return { adminUser, bar: access.bar }
}