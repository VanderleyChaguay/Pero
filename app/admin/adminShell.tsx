// app/admin/adminShell.tsx
// Async Server Component that handles auth and renders the admin shell.
// Separated from layout.tsx so it can be wrapped in <Suspense>.

import { requireAdmin } from "@/lib/admin/adminAuth"
import { AdminSidebar } from "@/app/admin/_components/sidebar"
import styles from "./layout.module.css"
import clsx from "clsx"

export default async function AdminShell({
  children,
}: {
  children: React.ReactNode
}) {
  const adminUser = await requireAdmin()

  const sidebarUser = {
    name:         adminUser.name,
    email:        adminUser.email,
    isSuperAdmin: adminUser.isSuperAdmin,
    businesses:   adminUser.businessAccess.map(a => ({
      slug: a.business.slug,
      name: a.business.name,
    })),
  }

  return (
    <div className="flex relative">
      <AdminSidebar user={sidebarUser} />
      <div className={clsx("flex-1 min-w-0 min-h-screen", styles.main)}>
        <main className={clsx("w-full", styles.content)}>
          {children}
        </main>
      </div>
    </div>
  )
}
