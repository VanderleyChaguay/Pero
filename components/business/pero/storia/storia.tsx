// Storia (About) component for Bar Però
// Static content — no client interactivity needed, so no "use client"

import styles from "./storia.module.css"

export function PeroStoria() {
  return (
    <section id="storia" className={styles.wrapper}>
      <div className={styles.section}>

        <p className={styles.eyebrow}>La nostra storia</p>
        <h2 className={styles.title}>
          Nati per <em>contraddire</em><br />l'ordinario.
        </h2>

        <div className={styles.grid}>

          <div className={styles.body}>
            <p>
              Però nasce da un'idea semplice: creare uno spazio dove la qualità
              non è un lusso ma una necessità. Nel cuore di Savona, in Via Baglietto,
              abbiamo aperto le porte a chi cercava qualcosa di diverso.
            </p>
            <p>
              La nostra carta dei vini è costruita con cura, privilegiando produttori
              artigianali e territori meno conosciuti. I nostri cocktail nascono da
              abbinamenti inaspettati, sempre con ingredienti freschi e di stagione.
            </p>
            <p>
              Però non è solo un bar — è un punto di incontro, un luogo dove ogni
              visita diventa un ricordo. Perché ci sono posti che entrano nella vita
              delle persone e non se ne vanno più.
            </p>
            <blockquote className={styles.quote}>
              "Il nome dice tutto — però, c'è sempre qualcosa in più."
            </blockquote>
          </div>

          <div className={styles.imageWrap}>
            {/*
              Replace src with a real interior photo of Però once available.
              Suggested path: /images/pero/interior.jpg
              Use next/image when the real photo is ready for automatic optimization.
            */}
            <img
              src="https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80"
              alt="Interno del bar Però — Savona"
            />
          </div>

        </div>
      </div>
    </section>
  )
}
