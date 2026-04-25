// app/admin/businesses/[businessSlug]/events/_components/EventList.tsx
// Renders the list of events for a given section (upcoming / past),
// or an empty-state placeholder when there are no events.

import { EventCard }         from "./EventCard"
import type { EventSummary } from "../_types"
import styles                from "./EventList.module.css"

export function EventList({
  events,
  businessSlug,
  emptyLabel,
}: {
  events:       EventSummary[]
  businessSlug: string
  emptyLabel:   string
}) {
  if (events.length === 0) {
    return (
      <div className={`text-center ${styles.empty}`}>
        {emptyLabel}
      </div>
    )
  }

  return (
    <div className={`flex flex-col ${styles.list}`}>
      {events.map(event => (
        <EventCard key={event.id} event={event} businessSlug={businessSlug} />
      ))}
    </div>
  )
}
