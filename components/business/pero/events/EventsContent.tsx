// EventsContent — async Server Component for the public events page.
// Mirrors MenuContent.tsx: data is fetched here, serialized, then passed
// to the pure EventsView component. connection() opts into dynamic rendering
// so event changes are reflected on every request.

import { connection } from "next/server"
import { prisma }     from "@/lib/prisma/prisma"
import { notFound }   from "next/navigation"
import { EventsView } from "./EventsView"

// ── Public types ──────────────────────────────────────────────────────────────

export type PublicEvent = {
  id:            string
  title:         string
  description:   string
  startDate:     string   // UTC ISO — safe to cross RSC → client boundary
  endDate:       string | null
  coverImageUrl: string | null
}

// ── Query — single round trip ─────────────────────────────────────────────────
// Only PUBLISHED events are exposed publicly. Draft events are invisible.
// Past events are returned in descending order (most-recent past first).

async function getPublicEvents(slug: string) {
  const now      = new Date()
  const business = await prisma.business.findUnique({
    where:  { slug },
    select: {
      name: true,
      events: {
        where:   { status: "PUBLISHED" },
        orderBy: { startDate: "asc" },
        select: {
          id:            true,
          title:         true,
          description:   true,
          startDate:     true,
          endDate:       true,
          coverImageUrl: true,
        },
      },
    },
  })

  if (!business) notFound()

  const serialized: PublicEvent[] = business.events.map(e => ({
    id:            e.id,
    title:         e.title,
    description:   e.description,
    startDate:     e.startDate.toISOString(),
    endDate:       e.endDate?.toISOString() ?? null,
    coverImageUrl: e.coverImageUrl,
  }))

  // Split at request time — guarantees upcoming/past reflect the actual moment
  const upcoming = serialized.filter(e => new Date(e.startDate) >= now)
  const past     = serialized.filter(e => new Date(e.startDate) < now).reverse()

  return { businessName: business.name, upcoming, past }
}

// ── Component ─────────────────────────────────────────────────────────────────

export async function EventsContent({ slug }: { slug: string }) {
  await connection()

  const data = await getPublicEvents(slug)

  return (
    <EventsView
      businessName={data.businessName}
      upcoming={data.upcoming}
      past={data.past}
    />
  )
}
