// app/admin/adminShell.tsx
// Async Server Component that handles auth and renders the admin shell.
// Separated from layout.tsx so it can be wrapped in <Suspense>.

import { requireAdmin } from "@/lib/admin/adminAuth"
import { AdminSidebar } from "@/app/admin/_components/sidebar"
import styles from "./layout.module.css"

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
    bars:         adminUser.barAccess.map(a => ({
      slug: a.bar.slug,
      name: a.bar.name,
    })),
  }

  return (
    <div className={styles.shell}>
      <AdminSidebar user={sidebarUser} />
      <div className={styles.main}>
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  )
}
