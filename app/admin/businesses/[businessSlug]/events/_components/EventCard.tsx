"use client"

// app/admin/businesses/[businessSlug]/events/_components/EventCard.tsx
// Single event row in the admin list — shows status badge, dates, and quick actions.

import { useTransition }                    from "react"
import Link                                 from "next/link"
import { deleteEvent, toggleEventStatus }   from "../actions"
import { routes }                           from "@/lib/routes"
import type { EventSummary }                from "../_types"
import styles                               from "./EventCard.module.css"

// ── Date formatting ───────────────────────────────────────────────────────────

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleString("it-IT", {
    day:    "numeric",
    month:  "long",
    year:   "numeric",
    hour:   "2-digit",
    minute: "2-digit",
  })
}

// ── Component ─────────────────────────────────────────────────────────────────

export function EventCard({
  event,
  businessSlug,
}: {
  event:        EventSummary
  businessSlug: string
}) {
  const [pending, startTransition] = useTransition()

  const handleDelete = () => {
    if (!confirm(`Eliminare definitivamente "${event.title}"?`)) return
    startTransition(() => deleteEvent(businessSlug, event.id))
  }

  const handleToggleStatus = () => {
    startTransition(() => toggleEventStatus(businessSlug, event.id, event.status))
  }

  const isPublished = event.status === "PUBLISHED"
  const isPast      = new Date(event.startDate) < new Date()

  return (
    <div
      className={`grid items-start ${styles.card} ${event.coverImageUrl ? styles.cardWithImage : ""}`}
      style={{ opacity: pending ? 0.5 : 1 }}
    >

      {/* Cover thumbnail — only rendered when image exists */}
      {event.coverImageUrl && (
        <div className={styles.thumbnail}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={event.coverImageUrl}
            alt=""
            className={styles.thumbnailImg}
          />
        </div>
      )}

      {/* Main content */}
      <div className={`flex flex-col min-w-0 ${styles.content}`}>
        <div className={`flex flex-wrap items-center ${styles.badges}`}>
          <span className={`${styles.badge} ${isPublished ? styles.badgePublished : styles.badgeDraft}`}>
            {isPublished ? "Pubblicato" : "Bozza"}
          </span>
          {isPast && (
            <span className={`${styles.badge} ${styles.badgePast}`}>Passato</span>
          )}
        </div>

        <span className={styles.title}>{event.title}</span>

        <span className={styles.date}>
          {formatDate(event.startDate)}
          {event.endDate && (
            <> &rarr; {formatDate(event.endDate)}</>
          )}
        </span>
      </div>

      {/* Actions */}
      <div className={`flex flex-wrap items-center ${styles.actions}`}>
        <Link
          href={routes.admin.business.editEvent(businessSlug, event.id)}
          className={`inline-flex items-center no-underline whitespace-nowrap ${styles.btnOutline}`}
        >
          Modifica
        </Link>
        <button
          onClick={handleToggleStatus}
          disabled={pending}
          className={`bg-transparent cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed ${styles.btnGhost}`}
        >
          {isPublished ? "Metti in bozza" : "Pubblica"}
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
