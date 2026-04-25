// app/admin/businesses/[businessSlug]/events/[eventId]/page.tsx
// Edit event page — loads event data server-side, verifies business ownership,
// then renders EventForm in edit mode and a danger-zone delete button.

import Link                      from "next/link"
import { notFound }              from "next/navigation"
import { requireBusinessAccess } from "@/lib/admin/adminAuth"
import { prisma }                from "@/lib/prisma/prisma"
import { routes }                from "@/lib/routes"
import { EventForm }             from "../_components/EventForm"
import { DeleteEventButton }     from "../_components/DeleteEventButton"
import type { EventDetail }      from "../_types"
import styles                    from "./page.module.css"

// ── Data fetching ─────────────────────────────────────────────────────────────

async function getEvent(eventId: string, businessId: string) {
  return prisma.event.findFirst({
    where: { id: eventId, businessId },
    select: {
      id:            true,
      title:         true,
      description:   true,
      startDate:     true,
      endDate:       true,
      coverImageUrl: true,
      status:        true,
      createdAt:     true,
    },
  })
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ businessSlug: string; eventId: string }>
}) {
  const { businessSlug, eventId } = await params

  // Auth and data run in parallel — both need businessId, so auth goes first
  const { business } = await requireBusinessAccess(businessSlug)
  const raw = await getEvent(eventId, business.id)

  if (!raw) notFound()

  // Serialize dates before crossing the RSC → Client Component boundary
  const event: EventDetail = {
    id:            raw.id,
    title:         raw.title,
    description:   raw.description,
    startDate:     raw.startDate.toISOString(),
    endDate:       raw.endDate?.toISOString() ?? null,
    coverImageUrl: raw.coverImageUrl,
    status:        raw.status as "DRAFT" | "PUBLISHED",
    createdAt:     raw.createdAt.toISOString(),
  }

  return (
    <div className={`flex flex-col ${styles.page}`}>

      {/* Back link */}
      <Link
        href={routes.admin.business.events(businessSlug)}
        className={`inline-flex items-center no-underline self-start ${styles.backLink}`}
      >
        ← Eventi
      </Link>

      {/* Header */}
      <div>
        <p className={`m-0 uppercase ${styles.eyebrow}`}>{business.name}</p>
        <h1 className={`m-0 ${styles.title}`}>{event.title}</h1>
        <p className={`m-0 ${styles.subtitle}`}>
          Creato il {new Date(event.createdAt).toLocaleDateString("it-IT", {
            day: "numeric", month: "long", year: "numeric",
          })}
        </p>
      </div>

      {/* Edit form */}
      <EventForm businessSlug={businessSlug} event={event} />

      {/* Danger zone */}
      <section className={`flex flex-col ${styles.dangerZone}`}>
        <h2 className={`m-0 uppercase ${styles.dangerTitle}`}>Zona pericolosa</h2>
        <p className={`m-0 ${styles.dangerDesc}`}>
          L&apos;eliminazione è permanente e rimuove anche tutte le foto collegate.
        </p>
        <DeleteEventButton
          businessSlug={businessSlug}
          eventId={event.id}
          eventTitle={event.title}
        />
      </section>

    </div>
  )
}
