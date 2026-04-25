"use client"

// app/admin/businesses/[businessSlug]/menu/_components/MenuRow.tsx

import { useTransition }          from "react"
import Link                       from "next/link"
import { toggleMenu, deleteMenu } from "../actions"
import type { MenuSummary }       from "../_types"
import styles                     from "./MenuRow.module.css"
import { routes }                 from "@/lib/routes"

export function MenuRow({
  menu,
  businessSlug,
}: {
  menu:         MenuSummary
  businessSlug: string
}) {
  const [pending, startTransition] = useTransition()

  const handleToggle = () => {
    startTransition(() => toggleMenu(businessSlug, menu.id, menu.isActive))
  }

  const handleDelete = () => {
    if (!confirm(`Eliminare "${menu.name}" e tutti i suoi articoli?`)) return
    startTransition(() => deleteMenu(businessSlug, menu.id))
  }

  return (
    <div
      className={`grid items-center ${styles.row}`}
      style={{ opacity: pending ? 0.5 : 1 }}
    >
      {/* Name + item count */}
      <div className={`flex flex-col min-w-0 ${styles.info}`}>
        <span className={`truncate ${styles.name}`}>{menu.name}</span>
        <span className={styles.itemCount}>{menu._count.items} voci</span>
      </div>

      {/* Active status */}
      <span className={`whitespace-nowrap ${menu.isActive ? styles.badgeActive : styles.badgeInactive}`}>
        {menu.isActive ? "Attivo" : "Inattivo"}
      </span>

      {/* Actions */}
      <div className={`flex flex-wrap ${styles.actions}`}>
        <Link
          href={routes.admin.business.menuItems(businessSlug, menu.id)}
          className={`inline-flex items-center no-underline whitespace-nowrap ${styles.btnOutline}`}
        >
          Gestisci voci
        </Link>
        <button
          onClick={handleToggle}
          disabled={pending}
          className={`bg-transparent cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed ${styles.btnGhost}`}
        >
          {menu.isActive ? "Disattiva" : "Attiva"}
        </button>
        <button
          onClick={handleDelete}
          disabled={pending}
          className={`bg-transparent cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed ${styles.btnDanger}`}
        >
          Elimina
        </button>
      </div>
    </div>
  )
}
