
import Image from "next/image"
import Link from "next/link"
import { PeroNavbar } from "@/components/bar/pero/navbar/navbar"
import { PeroHero } from "@/components/bar/pero/hero/hero"
import { PeroStoria } from "@/components/bar/pero/storia/storia"
import { PeroMenuPreview } from "@/components/bar/pero/menuPreview/menuPreview"
import { PeroEventiPreview } from "@/components/bar/pero/events/events"
// Evaluated once at build time — not inside the component
const CURRENT_YEAR = new Date().getFullYear()
// ─────────────────────────────────────────────────────────────
// Però Bar — Homepage
// Savona, Via Baglietto 44r
// Elegant minimalist — wine red + bone white identity
// Sections: Navbar, Hero, About, Menu Preview, Events, Contact, Footer
// ─────────────────────────────────────────────────────────────


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

        <PeroMenuPreview/>
        {/* ══ EVENTS ══════════════════════════════════════════ */}
        <PeroEventiPreview/>
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
