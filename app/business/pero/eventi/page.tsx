// app/business/pero/eventi/page.tsx
// Public events page for Bar Però.
// Accessible without login — only PUBLISHED events are shown.
//
// Architecture mirrors menu/page.tsx:
//   Static shell (PeroNavbar) + Suspense > EventsContent (dynamic data)
//   + Suspense > PeroFooter (cached, but must stay outside static shell)

import type { Metadata } from "next"
import { Suspense }      from "react"

import { PeroNavbar }    from "@/components/business/pero/navbar/navbar"
import { PeroFooter }    from "@/components/business/pero/footer/footer"
import { EventsContent } from "@/components/business/pero/events/EventsContent"
import styles            from "@/components/business/pero/events/eventsPage.module.css"

// ── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title:       "Eventi — Però · Savona",
  description:
    "Scopri i prossimi eventi di Però: serate jazz, degustazioni di vino, aperitivi speciali. Via Baglietto 44r, Savona.",
}

// ── Loading skeleton ──────────────────────────────────────────────────────────

function EventsSkeleton() {
  return (
    <div className={styles.skeleton}>
      <div className={`${styles.skeletonBar} ${styles.skeletonLabel}`} />
      <div className={`${styles.skeletonBar} ${styles.skeletonTitle}`} />
      <div className={`${styles.skeletonBar} ${styles.skeletonSub}`}   />
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PeròEventiPage() {
  return (
    <div className="pero-page">
      <PeroNavbar />

      <Suspense fallback={<EventsSkeleton />}>
        <EventsContent slug="pero" />
      </Suspense>

      <Suspense fallback={null}>
        <PeroFooter />
      </Suspense>
    </div>
  )
}
