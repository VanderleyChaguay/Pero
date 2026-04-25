// Contact section component for Bar Però
// Static content — Server Component, no "use client" needed

import styles from "./contact.module.css";

export function PeroContact() {
  return (
    <section id="contatti" className={styles.wrapper}>
      <div className={styles.inner}>
        {/* ── Left: info ── */}
        <div>
          <p className={styles.eyebrow}>Dove siamo</p>
          <h2 className={styles.title}>
            Vieni a<br />
            <em>trovarci</em>.
          </h2>

          <div className={styles.details}>
            <div>
              <p className={styles.label}>Indirizzo</p>
              <p className={styles.value}>
                <a
                  href="https://maps.google.com/?q=Via+Baglietto+44r+Savona"
                  target="_blank"
                  rel="noreferrer"
                >
                  Via Baglietto 44r, Savona
                </a>
              </p>
            </div>

            <div>
              <p className={styles.label}>Orari</p>
              <p className={styles.value}>
                Ogni giorno · 11:00 – 14:00
                <br />
                18:00 – 01:00
              </p>
            </div>

            <div>
              <p className={styles.label}>Email</p>
              <p className={styles.value}>
                <a href="mailto:ciao@pero.bar">ciao@pero.bar</a>
              </p>
            </div>
          </div>
        </div>
        <div className={styles.map}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5710.110779621469!2d8.481011986045358!3d44.308811796506845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12d31dffbee3eedd%3A0x8830dc1517b70c2f!2zVmluw7I!5e0!3m2!1sit!2sus!4v1773447287586!5m2!1sit!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Però Bar — Via Baglietto 44r, Savona"
          />
        </div>
      </div>
    </section>
  );
}
