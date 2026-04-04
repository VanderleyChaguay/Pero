// app/admin/layout.tsx
// Root layout for the entire admin panel.
// Applies the admin theme and wraps AdminShell in Suspense
// so the dynamic auth check doesn't block the full page render.

import "@/styles/themes/admin/style.css"
import styles from "./layout.module.css"
import { Suspense } from "react"
import AdminShell from "./adminShell"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title:  "Birro Admin",
  robots: "noindex, nofollow",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div data-theme="admin" className={styles.wrapper}>
      <Suspense fallback={<AdminLoadingFallback />}>
        <AdminShell>{children}</AdminShell>
      </Suspense>
    </div>
  )
}

function AdminLoadingFallback() {
  return (
    <div className={styles.loadingFallback}>
      Caricamento...
    </div>
  )
}
