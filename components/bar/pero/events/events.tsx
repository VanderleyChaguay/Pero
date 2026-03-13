// Events Preview component for Bar Però
// Shows upcoming events in a minimal list layout
// Static content — Server Component, no "use client" needed

import styles from "./events.module.css"

// Placeholder data — will be replaced with real database data later
const EVENTS = [
  {
    date:  "VEN 07 MAR",
    title: "Jazz in Vigna",
    desc:  "Una serata di jazz dal vivo tra i profumi del vino.",
  },
  {
    date:  "SAB 15 MAR",
    title: "Degustazione Barolo",
    desc:  "Selezione di grandi Barolo con il nostro sommelier.",
  },
  {
    date:  "VEN 21 MAR",
    title: "Aperitivo Letterario",
    desc:  "Letture e vino. Un abbinamento senza tempo.",
  },
]

export function PeroEventiPreview() {
  return (
    <section id="eventi" className={styles.wrapper}>
      <div className={styles.section}>

        <p className={styles.eyebrow}>Prossimi eventi</p>
        <h2 className={styles.title}>
          Serate che <em>restano</em>.
        </h2>

        <div className={styles.list}>
          {EVENTS.map(ev => (
            <div key={ev.title} className={styles.row}>
              <span className={styles.date}>{ev.date}</span>
              <div>
                <p className={styles.eventTitle}>{ev.title}</p>
                <p className={styles.desc}>{ev.desc}</p>
              </div>
              <span className={styles.arrow}>→</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
