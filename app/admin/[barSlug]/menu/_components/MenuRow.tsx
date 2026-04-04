"use client"

// app/admin/[barSlug]/menu/_components/MenuRow.tsx
// Single menu row with status badge and action buttons.

import { useTransition }              from "react"
import Link                           from "next/link"
import { toggleMenu, deleteMenu }     from "../actions"
import { CATEGORY_LABELS }            from "../_types"
import type { MenuSummary }           from "../_types"
import styles                         from "./MenuRow.module.css"

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
      className={styles.row}
      style={{ opacity: pending ? 0.5 : 1 }}
    >
      {/* Category badge */}
      <span className={styles.categoryBadge}>
        {CATEGORY_LABELS[menu.category] ?? menu.category}
      </span>

      {/* Name + item count */}
      <div className={styles.info}>
        <span className={styles.name}>{menu.name}</span>
        <span className={styles.itemCount}>{menu._count.items} voci</span>
      </div>

      {/* Active status */}
      <span className={menu.isActive ? styles.badgeActive : styles.badgeInactive}>
        {menu.isActive ? "Attivo" : "Inattivo"}
      </span>

      {/* Actions */}
      <div className={styles.actions}>
        <Link
          href={`/admin/${barSlug}/menu/${menu.id}`}
          className={styles.btnOutline}
        >
          Gestisci voci
        </Link>
        <button
          onClick={handleToggle}
          disabled={pending}
          className={styles.btnGhost}
        >
          {menu.isActive ? "Disattiva" : "Attiva"}
        </button>
        <button
          onClick={handleDelete}
          disabled={pending}
          className={styles.btnDanger}
        >
          Elimina
        </button>
      </div>
    </div>
  )
}
