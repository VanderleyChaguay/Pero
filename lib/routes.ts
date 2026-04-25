// lib/routes.ts
// Centralized route definitions for the entire platform.
// Change a path here and every Link in the app updates automatically.
//
// Usage:
//   import { routes } from "@/lib/routes"
//   <Link href={routes.admin.business.menu("pero")}>Menù</Link>

export const routes = {

  // ── Public business pages ──
  business: {
    home:   (slug: string) => `/business/${slug}`,
    menu:   (slug: string) => `/business/${slug}/menu`,
    events: (slug: string) => `/business/${slug}/eventi`,
  },

  // ── Admin panel ──
  admin: {
    dashboard:    "/admin",
    users:        "/admin/user",
    newBusiness:  "/admin/businesses/new",
    applications: "/admin/user#applications", // anchor to applications section
    apply:        "/admin/apply",

    business: {
      root:      (slug: string) => `/admin/businesses/${slug}`,
      menu:      (slug: string) => `/admin/businesses/${slug}/menu`,
      menuItems: (slug: string, menuId: string) => `/admin/businesses/${slug}/menu/${menuId}`,
      events:    (slug: string) => `/admin/businesses/${slug}/events`,
      newEvent:  (slug: string) => `/admin/businesses/${slug}/events/new`,
      editEvent: (slug: string, eventId: string) => `/admin/businesses/${slug}/events/${eventId}`,
      settings:  (slug: string) => `/admin/businesses/${slug}/settings`,
    },
  },

  // ── Auth ──
  auth: {
    login:   "/login",
    signup:  "/register",
    logout:  "/auth/logout",
  },

} as const
