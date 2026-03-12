
import Image from "next/image"
import Link from "next/link"
import { PeroNavbar } from "@/components/bar/pero/navbar/navbar"
import { PeroHero } from "@/components/bar/pero/hero/hero"
import { PeroStoria } from "@/components/bar/pero/storia/storia"
// Evaluated once at build time — not inside the component
const CURRENT_YEAR = new Date().getFullYear()
// ─────────────────────────────────────────────────────────────
// Però Bar — Homepage
// Savona, Via Baglietto 44r
// Elegant minimalist — wine red + bone white identity
// Sections: Navbar, Hero, About, Menu Preview, Events, Contact, Footer
// ─────────────────────────────────────────────────────────────


const MENU_PREVIEW = [
  {
    category: "Cocktail",
    items: [
      { name: "Negroni Sbagliato",    price: "9€" },
      { name: "Spritz al Prosecco",   price: "7€" },
      { name: "Americano Rosso",      price: "8€" },
    ],
  },
  {
    category: "Vini",
    items: [
      { name: "Barolo 2019",                    price: "12€" },
      { name: "Brunello di Montalcino",         price: "15€" },
      { name: "Vermentino di Sardegna",         price: "9€"  },
    ],
  },
  {
    category: "Cucina",
    items: [
      { name: "Tagliere di salumi e formaggi", price: "14€" },
      { name: "Bruschette al pomodoro",        price: "7€"  },
      { name: "Carpaccio di manzo",            price: "13€" },
    ],
  },
]

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

export default function PeròPage() {


  return (
    <>
      
      <div className="pero-page">
        
        {/* ══ NAVBAR ══════════════════════════════════════════ */}

        <PeroNavbar />
        {/* ══ HERO ════════════════════════════════════════════ */}

        <PeroHero/>

        {/* ══ STORIA ══════════════════════════════════════════ */}
        <PeroStoria/>
        {/* ══ MENU PREVIEW ════════════════════════════════════ */}
        <section id="menu">
          <div className="menu-section-wrap">
            <div className="menu-section">
              <p className="eyebrow">Il nostro menù</p>
              <h2 className="section-title">
                Ogni scelta <em>racconta</em><br />qualcosa.
              </h2>

              <div className="menu-grid">
                {MENU_PREVIEW.map(col => (
                  <div key={col.category} className="menu-col">
                    <p className="menu-col-category">{col.category}</p>
                    <ul className="menu-col-items">
                      {col.items.map(item => (
                        <li key={item.name}>
                          <span>{item.name}</span>
                          <span className="price">{item.price}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="menu-footer">
                <Link href="/bar/pero/menu" className="btn-ghost-bone">
                  Vedi il menù completo
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ══ EVENTS ══════════════════════════════════════════ */}
        <section id="eventi">
          <div className="section">
            <p className="eyebrow">Prossimi eventi</p>
            <h2 className="section-title">Serate che <em>restano</em>.</h2>

            <div className="events-list">
              {EVENTS.map(ev => (
                <div key={ev.title} className="event-row">
                  <span className="event-date">{ev.date}</span>
                  <div>
                    <p className="event-title">{ev.title}</p>
                    <p className="event-desc">{ev.desc}</p>
                  </div>
                  <span className="event-arrow">→</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ CONTACT ═════════════════════════════════════════ */}
        <section id="contatti">
          <div className="contact-wrap">
            <div className="contact-section">
              <div>
                <p className="eyebrow">Dove siamo</p>
                <h2 className="section-title">
                  Vieni a<br /><em>trovarci</em>.
                </h2>

                <div className="contact-details">
                  <div>
                    <p className="contact-item-label">Indirizzo</p>
                    <p className="contact-item-value">
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
                    <p className="contact-item-label">Orari</p>
                    <p className="contact-item-value">
                      Ogni giorno · 11:00 – 14:00<br />
                      18:00 – 01:00
                    </p>
                  </div>
                  <div>
                    <p className="contact-item-label">Email</p>
                    <p className="contact-item-value">
                      <a href="mailto:ciao@pero.bar">ciao@pero.bar</a>
                    </p>
                  </div>
                </div>
              </div>

              {/*
                Replace this div with a real Google Maps embed:
                <iframe
                  src="https://maps.google.com/maps?q=Via+Baglietto+44r+Savona&output=embed"
                  width="100%" height="100%" style={{ border: 0 }}
                  allowFullScreen loading="lazy"
                />
              */}
              <div className="contact-map">
                <span className="contact-map-text">Mappa in arrivo</span>
              </div>
            </div>
          </div>
        </section>

        {/* ══ FOOTER ══════════════════════════════════════════ */}
        <footer className="footer">
          <div className="footer-inner">
            <Image
              src="/images/pero/PeroWithoutBackGround.png"
              alt="Però"
              width={78}
              height={50}
              className="footer-logo"
            />

            <div className="footer-social">
              <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
              <a href="https://facebook.com"  target="_blank" rel="noreferrer">Facebook</a>
              <a href="https://tiktok.com"    target="_blank" rel="noreferrer">TikTok</a>
            </div>

            <span className="footer-copy">
              © {CURRENT_YEAR} Però · Savona
            </span>
          </div>
        </footer>

      </div>
    </>
  )
}
