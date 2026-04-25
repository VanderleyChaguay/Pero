// app/admin/businesses/[businessSlug]/events/page.tsx
// Events management list page — shows upcoming and past events with status badges.
// Data is fetched server-side; dates are serialized to ISO strings before
// crossing the RSC → Client Component boundary.

import Link                      from "next/link"
import { requireBusinessAccess } from "@/lib/admin/adminAuth"
import { prisma }                from "@/lib/prisma/prisma"
import { routes }                from "@/lib/routes"
import { EventList }             from "./_components/EventList"
import type { EventSummary }     from "./_types"
import styles                    from "./page.module.css"

// ── Data fetching ─────────────────────────────────────────────────────────────

async function getEvents(businessId: string) {
  const now    = new Date()
  const events = await prisma.event.findMany({
    where:   { businessId },
    orderBy: { startDate: "asc" },
    select: {
      id:            true,
      title:         true,
      startDate:     true,
      endDate:       true,
      coverImageUrl: true,
      status:        true,
      createdAt:     true,
    },
  })

  const serialized: EventSummary[] = events.map(e => ({
    id:            e.id,
    title:         e.title,
    startDate:     e.startDate.toISOString(),
    endDate:       e.endDate?.toISOString() ?? null,
    coverImageUrl: e.coverImageUrl,
    status:        e.status as "DRAFT" | "PUBLISHED",
    createdAt:     e.createdAt.toISOString(),
  }))

  return {
    upcoming: serialized.filter(e => new Date(e.startDate) >= now),
    past:     serialized.filter(e => new Date(e.startDate) < now),
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function EventsPage({
  params,
}: {
  params: Promise<{ businessSlug: string }>
}) {
  const { businessSlug }   = await params
  const { business }       = await requireBusinessAccess(businessSlug)
  const { upcoming, past } = await getEvents(business.id)
  const total              = upcoming.length + past.length

  return (
    <div className={`flex flex-col ${styles.page}`}>

      {/* ── Header ── */}
      <div className={`flex items-start justify-between flex-wrap ${styles.header}`}>
        <div>
          <p className={`m-0 uppercase ${styles.eyebrow}`}>{business.name}</p>
          <h1 className={`m-0 ${styles.title}`}>Gestione Eventi</h1>
          <p className={`m-0 ${styles.subtitle}`}>
            {total === 0
              ? "Nessun evento ancora"
              : `${total} event${total === 1 ? "o" : "i"}`
            }
            {upcoming.length > 0 && ` · ${upcoming.length} in programma`}
          </p>
        </div>
        <Link
          href={routes.admin.business.newEvent(businessSlug)}
          className={`inline-flex items-center no-underline whitespace-nowrap ${styles.btnNew}`}
        >
          + Nuovo evento
        </Link>
      </div>

      {/* ── Upcoming events ── */}
      <section className={`flex flex-col ${styles.section}`}>
        <h2 className={`m-0 uppercase ${styles.sectionTitle}`}>In programma</h2>
        <EventList
          events={upcoming}
          businessSlug={businessSlug}
          emptyLabel="Nessun evento in programma. Creane uno con il pulsante in alto."
        />
      </section>

      {/* ── Past events — shown only if they exist ── */}
      {past.length > 0 && (
        <section className={`flex flex-col ${styles.section}`}>
          <h2 className={`m-0 uppercase ${styles.sectionTitle}`}>Passati</h2>
          <EventList
            events={past}
            businessSlug={businessSlug}
            emptyLabel="Nessun evento passato."
          />
        </section>
      )}

    </div>
  )
}
