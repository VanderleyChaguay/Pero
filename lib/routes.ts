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
    dashboard: "/admin",
    users:     "/admin/user",
    newBar:    "/admin/bares/nuovo",

    bar: {
      menu:     (slug: string) => `/admin/${slug}/menu`,
      menuItems:(slug: string, menuId: string) => `/admin/${slug}/menu/${menuId}`,
      events:   (slug: string) => `/admin/${slug}/eventi`,
      settings: (slug: string) => `/admin/${slug}/configurazione`,
    },
  },

  // ── Auth ──
  auth: {
    login:  "/auth/login",
    logout: "/auth/logout",
  },
} as const
