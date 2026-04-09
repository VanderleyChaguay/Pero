"use client"

// app/admin/[barSlug]/menu/_components/MenuRow.tsx
// Single menu row with status badge and action buttons.

import { useTransition }          from "react"
import Link                       from "next/link"
import { toggleMenu, deleteMenu } from "../actions"
import { CATEGORY_LABELS }        from "../_types"
import type { MenuSummary }       from "../_types"
import styles                     from "./MenuRow.module.css"
import { routes } from "@/lib/routes"

export function MenuRow({
  menu,
  barSlug,
}: {
  menu:    MenuSummary
  barSlug: string
}) {
  const [pending, startTransition] = useTransition()

  const handleToggle = () => {
    startTransition(() => toggleMenu(barSlug, menu.id, menu.isActive))
  }

  const handleDelete = () => {
    if (!confirm(`Eliminare "${menu.name}" e tutti i suoi articoli?`)) return
    startTransition(() => deleteMenu(barSlug, menu.id))
  }

  return (
    <div
      className={`grid items-center ${styles.row}`}
      style={{ opacity: pending ? 0.5 : 1 }}
    >
      {/* Category badge */}
      <span className={`uppercase text-center whitespace-nowrap ${styles.categoryBadge}`}>
        {CATEGORY_LABELS[menu.category] ?? menu.category}
      </span>

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
          href={routes.admin.bar.menuItems(barSlug, menu.id)}
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
