// EventsView — pure Server Component.
// Receives already-serialized events from EventsContent and renders them.
// No client-side state needed — event listing is a static layout.

import Link                  from "next/link"
import { routes }            from "@/lib/routes"
import type { PublicEvent }  from "./EventsContent"
import { EventImageViewer }  from "./EventImageViewer"
import styles                from "./eventsPage.module.css"

// ── Date helpers ──────────────────────────────────────────────────────────────

function formatDateCard(isoString: string): string {
  return new Date(isoString).toLocaleDateString("it-IT", {
    weekday: "long",
    day:     "numeric",
    month:   "long",
    year:    "numeric",
  })
}

function formatDateShort(isoString: string): string {
  return new Date(isoString).toLocaleDateString("it-IT", {
    day:   "numeric",
    month: "short",
    year:  "numeric",
  }).toUpperCase()
}

function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString("it-IT", {
    hour:   "2-digit",
    minute: "2-digit",
  })
}

function buildDateLabel(startIso: string, endIso: string | null): string {
  const start = formatDateCard(startIso)
  const time  = formatTime(startIso)
  if (!endIso) return `${start} · ${time}`
  const end = new Date(endIso)
  const isSameDay =
    new Date(startIso).toDateString() === end.toDateString()
  if (isSameDay) return `${start} · ${time} – ${formatTime(endIso)}`
  return `${start} → ${formatDateCard(endIso)}`
}

// ── Types ─────────────────────────────────────────────────────────────────────

type Props = {
  businessName: string
  upcoming:     PublicEvent[]
  past:         PublicEvent[]
}

// ── Upcoming event card ───────────────────────────────────────────────────────

function EventCard({ event }: { event: PublicEvent }) {
  const dateLabel = buildDateLabel(event.startDate, event.endDate)

  return (
    <article className={styles.card}>

      {/* Cover image — clickable when a URL is available */}
      <div className={styles.cardCover}>
        {event.coverImageUrl ? (
          <EventImageViewer
            src={event.coverImageUrl}
            alt={`Immagine di copertina per ${event.title}`}
            imgClassName={styles.cardCoverImg}
          />
        ) : (
          <div className={styles.cardCoverPlaceholder}>
            <span className={styles.cardCoverPlaceholderIcon} aria-hidden="true">◈</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={styles.cardBody}>
        <p className={styles.cardDate}>{dateLabel}</p>
        <h3 className={styles.cardTitle}>{event.title}</h3>
        {event.description && (
          <p className={styles.cardDesc}>{event.description}</p>
        )}
      </div>

    </article>
  )
}

// ── Past event row ────────────────────────────────────────────────────────────

function PastRow({ event }: { event: PublicEvent }) {
  return (
    <div className={styles.pastRow}>
      <span className={styles.pastDate}>{formatDateShort(event.startDate)}</span>
      <span className={styles.pastTitle}>{event.title}</span>
      <span className={styles.pastArrow} aria-hidden="true">→</span>
    </div>
  )
}

// ── Component ─────────────────────────────────────────────────────────────────

export function EventsView({ businessName, upcoming, past }: Props) {

  // ── Full empty state ─────────────────────────────────────────────────────────
  if (upcoming.length === 0 && past.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyEyebrow}>I nostri eventi</p>
        <h1 className={styles.emptyTitle}>
          Gli eventi stanno <em>arrivando</em>.
        </h1>
        <p className={styles.emptyText}>
          Nuove serate in programma. Torna presto per scoprirle.
        </p>
        <Link href={routes.business.home("pero")} className={styles.backLink}>
          ← Torna alla home
        </Link>
      </div>
    )
  }

  const countAttr =
    upcoming.length === 1 ? "1"
    : upcoming.length === 2 ? "2"
    : "many"

  return (
    <main className={styles.page}>

      {/* ── Page header ── */}
      <header className={styles.header}>
        <p className={styles.eyebrow}>I nostri eventi</p>
        <h1 className={styles.title}>
          Serate che <em>restano</em>.
        </h1>
        <p className={styles.subtitle}>
          Scopri i prossimi appuntamenti di {businessName}.
        </p>
      </header>

      {/* ── Upcoming events ── */}
      {upcoming.length > 0 && (
        <section className={styles.section}>
          <div className={styles.inner}>
            <p className={styles.sectionLabel}>In programma</p>
            <div className={styles.cardGrid} data-count={countAttr}>
              {upcoming.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Past events — only if they exist ── */}
      {past.length > 0 && (
        <section className={styles.section}>
          <div className={styles.inner}>
            <p className={`${styles.sectionLabel} ${styles.sectionLabelPast}`}>
              Passati
            </p>
            <div className={styles.pastList}>
              {past.map(event => (
                <PastRow key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

    </main>
  )
}
