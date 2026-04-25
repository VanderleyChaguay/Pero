// app/admin/businesses/[businessSlug]/events/new/page.tsx
// Create event page — wraps the shared EventForm in create mode.
// After successful submission, createEvent() redirects to the edit page.

import Link                      from "next/link"
import { requireBusinessAccess } from "@/lib/admin/adminAuth"
import { routes }                from "@/lib/routes"
import { EventForm }             from "../_components/EventForm"
import styles                    from "./page.module.css"

export default async function NewEventPage({
  params,
}: {
  params: Promise<{ businessSlug: string }>
}) {
  const { businessSlug } = await params
  const { business }     = await requireBusinessAccess(businessSlug)

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
        <h1 className={`m-0 ${styles.title}`}>Nuovo Evento</h1>
      </div>

      {/* Form */}
      <EventForm businessSlug={businessSlug} />

    </div>
  )
}
