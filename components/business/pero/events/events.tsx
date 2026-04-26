// PeroEventiPreview — async Server Component.
// Shows the 3 nearest upcoming published events on the homepage.
// Data is fetched at request time so the preview is always fresh.
// Wrapped in Suspense by the parent page — no skeleton needed here.

import Link          from "next/link"
import { prisma }    from "@/lib/prisma/prisma"
import { routes }    from "@/lib/routes"
import styles        from "./events.module.css"

// ── Data fetching ─────────────────────────────────────────────────────────────

async function getUpcomingEvents() {
  return prisma.event.findMany({
    where: {
      status:    "PUBLISHED",
      startDate: { gte: new Date() },
      business:  { slug: "pero" },
    },
    orderBy: { startDate: "asc" },
    take:    3,
    select:  { id: true, title: true, startDate: true },
  })
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDateRow(date: Date): string {
  return date
    .toLocaleDateString("it-IT", { weekday: "short", day: "2-digit", month: "short" })
    .toUpperCase()
}

// ── Component ─────────────────────────────────────────────────────────────────

export async function PeroEventiPreview() {
  const events = await getUpcomingEvents()

  return (
    <section id="eventi" className={styles.wrapper}>
      <div className={styles.section}>

        <p className={styles.eyebrow}>Prossimi eventi</p>
        <h2 className={styles.title}>
          Serate che <em>restano</em>.
        </h2>

        {events.length === 0 ? (
          <p className={styles.empty}>
            Nuovi eventi in arrivo. Torna presto per scoprirli.
          </p>
        ) : (
          <>
            <div className={styles.list}>
              {events.map(ev => (
                <Link
                  key={ev.id}
                  href={routes.business.events("pero")}
                  className={styles.row}
                >
                  <span className={styles.date}>{formatDateRow(ev.startDate)}</span>
                  <div>
                    <p className={styles.eventTitle}>{ev.title}</p>
                  </div>
                  <span className={styles.arrow} aria-hidden="true">→</span>
                </Link>
              ))}
            </div>

            <div className={styles.viewAll}>
              <Link href={routes.business.events("pero")} className={styles.viewAllLink}>
                Tutti gli eventi →
              </Link>
            </div>
          </>
        )}

      </div>
    </section>
  )
}
