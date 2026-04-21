// lib/routes.ts
// Centralized route definitions for the entire platform.
// Change a path here and every Link in the app updates automatically.
//
// Usage:
//   import { routes } from "@/lib/routes"
//   <Link href={routes.admin.bar.menu("pero")}>Menù</Link>

export const routes = {

  // ── Public bar pages ──
  bar: {
    home:   (slug: string) => `/bar/${slug}`,
    menu:   (slug: string) => `/bar/${slug}/menu`,
    events: (slug: string) => `/bar/${slug}/eventi`,
  },

  // ── Admin panel ──
  admin: {
    dashboard:    "/admin",
    users:        "/admin/users",
    newBar:       "/admin/bars/new",
    applications: "/admin/users#applications", // anchor to applications section

    bar: {
      root:      (slug: string) => `/admin/${slug}`,
      menu:      (slug: string) => `/admin/${slug}/menu`,
      menuItems: (slug: string, menuId: string) => `/admin/${slug}/menu/${menuId}`,
      events:    (slug: string) => `/admin/${slug}/events`,
      settings:  (slug: string) => `/admin/${slug}/settings`,
    },
  },

  // ── Auth ──
  auth: {
    login:   "/login",
    signup:  "/register",
    logout:  "/auth/logout",
  },

} as const