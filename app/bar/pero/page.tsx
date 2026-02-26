"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"

// ─── Però Bar Homepage ───────────────────────────────────────────────────────
// Elegant minimalist design — wine red (#6B1E2A) + bone white (#F5F0E8) + black
// Sections: Navbar, Hero, About, Menu Preview, Events, Contact, Footer

const NAV_LINKS = [
  { label: "Storia",   href: "#storia" },
  { label: "Menù",     href: "#menu" },
  { label: "Eventi",   href: "#eventi" },
  { label: "Contatti", href: "#contatti" },
]

const MENU_PREVIEW = [
  { category: "Cocktail", items: ["Negroni Sbagliato", "Spritz al Prosecco", "Americano Rosso"] },
  { category: "Vini",     items: ["Barolo 2019", "Brunello di Montalcino", "Amarone della Valpolicella"] },
  { category: "Cucina",   items: ["Tagliere di salumi", "Bruschette al pomodoro", "Carpaccio di manzo"] },
]

const EVENTS = [
  { date: "VEN 07 MAR", title: "Jazz in Vigna", desc: "Una serata di jazz dal vivo tra i profumi del vino." },
  { date: "SAB 15 MAR", title: "Degustazione Barolo", desc: "Selezione di grandi Barolo con il nostro sommelier." },
  { date: "VEN 21 MAR", title: "Aperitivo Letterario", desc: "Letture e vino. Un abbinamento senza tempo." },
]

export default function PeròHomepage() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="pero-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

        :root {
          --wine:      #6B1E2A;
          --wine-dark: #4A1219;
          --bone:      #F5F0E8;
          --bone-dark: #E8E0D0;
          --ink:       #0F0A08;
          --ink-light: #3A2F2A;
          --gold:      #B8960C;
        }

        .pero-root {
          font-family: 'Jost', sans-serif;
          background: var(--bone);
          color: var(--ink);
          overflow-x: hidden;
        }

        /* ── Navbar ── */
        .navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          padding: 1.5rem 3rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: background 0.4s, padding 0.4s, backdrop-filter 0.4s;
        }
        .navbar.scrolled {
          background: rgba(245, 240, 232, 0.92);
          backdrop-filter: blur(12px);
          padding: 1rem 3rem;
          border-bottom: 1px solid rgba(107, 30, 42, 0.12);
        }
        .navbar-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.8rem;
          font-weight: 300;
          letter-spacing: 0.15em;
          color: var(--bone);
          text-decoration: none;
          transition: color 0.4s;
        }
        .navbar.scrolled .navbar-logo { color: var(--wine); }

        .navbar-links {
          display: flex;
          gap: 2.5rem;
          list-style: none;
          margin: 0; padding: 0;
        }
        .navbar-links a {
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          text-decoration: none;
          color: rgba(245,240,232,0.85);
          transition: color 0.3s;
        }
        .navbar.scrolled .navbar-links a { color: var(--ink-light); }
        .navbar-links a:hover { color: var(--wine); }

        .navbar-reserve {
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          text-decoration: none;
          border: 1px solid rgba(245,240,232,0.6);
          color: var(--bone);
          padding: 0.55rem 1.4rem;
          transition: all 0.3s;
        }
        .navbar.scrolled .navbar-reserve {
          border-color: var(--wine);
          color: var(--wine);
        }
        .navbar-reserve:hover {
          background: var(--wine);
          border-color: var(--wine);
          color: var(--bone) !important;
        }

        /* ── Hero ── */
        .hero {
          position: relative;
          height: 100vh;
          min-height: 700px;
          display: flex;
          align-items: flex-end;
          overflow: hidden;
          background: var(--ink);
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(160deg, rgba(107,30,42,0.55) 0%, rgba(10,6,4,0.75) 60%),
            url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1800&q=80') center/cover no-repeat;
          transform: scale(1.04);
          animation: heroZoom 12s ease-out forwards;
        }
        @keyframes heroZoom {
          from { transform: scale(1.04); }
          to   { transform: scale(1); }
        }
        .hero-content {
          position: relative;
          z-index: 2;
          padding: 0 3rem 7rem;
          max-width: 780px;
          animation: heroFade 1.2s 0.3s ease-out both;
        }
        @keyframes heroFade {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-eyebrow {
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--wine);
          margin-bottom: 1.2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .hero-eyebrow::before {
          content: '';
          display: block;
          width: 40px;
          height: 1px;
          background: var(--wine);
        }
        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(4rem, 10vw, 8rem);
          font-weight: 300;
          line-height: 0.9;
          color: var(--bone);
          margin: 0 0 1.5rem;
          letter-spacing: -0.01em;
        }
        .hero-title em {
          font-style: italic;
          color: rgba(245,240,232,0.5);
        }
        .hero-subtitle {
          font-size: 0.9rem;
          font-weight: 300;
          letter-spacing: 0.08em;
          color: rgba(245,240,232,0.65);
          max-width: 420px;
          line-height: 1.8;
          margin-bottom: 2.5rem;
        }
        .hero-cta {
          display: inline-flex;
          align-items: center;
          gap: 1rem;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          text-decoration: none;
          color: var(--bone);
          border-bottom: 1px solid rgba(245,240,232,0.4);
          padding-bottom: 0.3rem;
          transition: all 0.3s;
        }
        .hero-cta:hover {
          color: var(--wine);
          border-color: var(--wine);
          gap: 1.5rem;
        }
        .hero-scroll {
          position: absolute;
          right: 3rem;
          bottom: 3rem;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.6rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(245,240,232,0.45);
          writing-mode: vertical-rl;
        }
        .hero-scroll::after {
          content: '';
          display: block;
          width: 1px;
          height: 50px;
          background: rgba(245,240,232,0.3);
          animation: scrollPulse 2s ease-in-out infinite;
        }
        @keyframes scrollPulse {
          0%,100% { opacity: 0.3; transform: scaleY(1); }
          50%      { opacity: 1;   transform: scaleY(1.2); }
        }

        /* ── Section base ── */
        .section {
          padding: 8rem 3rem;
          max-width: 1200px;
          margin: 0 auto;
        }
        .section-eyebrow {
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--wine);
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        .section-eyebrow::before {
          content: '';
          display: block;
          width: 30px;
          height: 1px;
          background: var(--wine);
        }
        .section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.5rem, 5vw, 4.5rem);
          font-weight: 300;
          line-height: 1.1;
          color: var(--ink);
          margin: 0 0 0.5rem;
        }
        .section-title em {
          font-style: italic;
          color: var(--wine);
        }

        /* ── Storia ── */
        .storia-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6rem;
          align-items: center;
          margin-top: 4rem;
        }
        .storia-text p {
          font-size: 1rem;
          font-weight: 300;
          line-height: 1.9;
          color: var(--ink-light);
          margin-bottom: 1.2rem;
        }
        .storia-image {
          position: relative;
          aspect-ratio: 3/4;
          overflow: hidden;
        }
        .storia-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: sepia(15%) contrast(1.05);
          transition: transform 0.8s ease;
        }
        .storia-image:hover img { transform: scale(1.04); }
        .storia-image::after {
          content: '';
          position: absolute;
          inset: 0;
          border: 1px solid rgba(107,30,42,0.2);
          pointer-events: none;
        }
        .storia-quote {
          margin-top: 2rem;
          padding-left: 1.5rem;
          border-left: 2px solid var(--wine);
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 1.3rem;
          font-weight: 300;
          color: var(--wine-dark);
          line-height: 1.6;
        }

        /* ── Menu ── */
        .menu-section {
          background: var(--ink);
          padding: 8rem 0;
        }
        .menu-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 3rem;
        }
        .menu-section .section-eyebrow { color: var(--wine); }
        .menu-section .section-title   { color: var(--bone); }
        .menu-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          margin-top: 4rem;
          border: 1px solid rgba(245,240,232,0.08);
        }
        .menu-card {
          padding: 3rem 2.5rem;
          border-right: 1px solid rgba(245,240,232,0.08);
          transition: background 0.3s;
        }
        .menu-card:last-child { border-right: none; }
        .menu-card:hover { background: rgba(107,30,42,0.15); }
        .menu-card-category {
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--wine);
          margin-bottom: 2rem;
        }
        .menu-card-items {
          list-style: none;
          padding: 0; margin: 0;
        }
        .menu-card-items li {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.25rem;
          font-weight: 300;
          color: var(--bone);
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(245,240,232,0.07);
          transition: color 0.3s, padding-left 0.3s;
        }
        .menu-card-items li:last-child { border-bottom: none; }
        .menu-card-items li:hover { color: var(--wine); padding-left: 0.5rem; }
        .menu-cta-wrap {
          margin-top: 4rem;
          text-align: center;
        }
        .btn-outline-bone {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          text-decoration: none;
          color: var(--bone);
          border: 1px solid rgba(245,240,232,0.3);
          padding: 1rem 2.5rem;
          transition: all 0.3s;
        }
        .btn-outline-bone:hover {
          background: var(--wine);
          border-color: var(--wine);
        }

        /* ── Events ── */
        .events-list {
          margin-top: 4rem;
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .event-item {
          display: grid;
          grid-template-columns: 140px 1fr auto;
          align-items: center;
          gap: 3rem;
          padding: 2.5rem 0;
          border-bottom: 1px solid rgba(15,10,8,0.1);
          transition: padding-left 0.3s;
        }
        .event-item:first-child { border-top: 1px solid rgba(15,10,8,0.1); }
        .event-item:hover { padding-left: 1rem; }
        .event-date {
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--wine);
        }
        .event-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          font-weight: 400;
          color: var(--ink);
          margin-bottom: 0.3rem;
        }
        .event-desc {
          font-size: 0.85rem;
          font-weight: 300;
          color: var(--ink-light);
          line-height: 1.6;
        }
        .event-arrow {
          font-size: 1.2rem;
          color: rgba(15,10,8,0.2);
          transition: color 0.3s, transform 0.3s;
        }
        .event-item:hover .event-arrow {
          color: var(--wine);
          transform: translateX(4px);
        }

        /* ── Contact ── */
        .contact-section {
          background: var(--wine);
          padding: 8rem 3rem;
        }
        .contact-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6rem;
          align-items: start;
        }
        .contact-section .section-eyebrow {
          color: rgba(245,240,232,0.6);
        }
        .contact-section .section-eyebrow::before {
          background: rgba(245,240,232,0.4);
        }
        .contact-section .section-title { color: var(--bone); }
        .contact-info {
          margin-top: 3rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .contact-info-item {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        .contact-info-label {
          font-size: 0.62rem;
          font-weight: 500;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(245,240,232,0.5);
        }
        .contact-info-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.3rem;
          font-weight: 300;
          color: var(--bone);
        }
        .contact-map {
          aspect-ratio: 4/3;
          background: rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        .contact-map-placeholder {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 1rem;
          color: rgba(245,240,232,0.4);
          letter-spacing: 0.1em;
        }

        /* ── Footer ── */
        .footer {
          background: var(--ink);
          padding: 4rem 3rem;
        }
        .footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .footer-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.8rem;
          font-weight: 300;
          letter-spacing: 0.15em;
          color: var(--bone);
        }
        .footer-social {
          display: flex;
          gap: 1.5rem;
        }
        .footer-social a {
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(245,240,232,0.4);
          text-decoration: none;
          transition: color 0.3s;
        }
        .footer-social a:hover { color: var(--wine); }
        .footer-copy {
          font-size: 0.65rem;
          color: rgba(245,240,232,0.25);
          letter-spacing: 0.1em;
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .navbar { padding: 1.2rem 1.5rem; }
          .navbar.scrolled { padding: 0.8rem 1.5rem; }
          .navbar-links, .navbar-reserve { display: none; }
          .hero-content { padding: 0 1.5rem 5rem; }
          .section { padding: 5rem 1.5rem; }
          .storia-grid  { grid-template-columns: 1fr; gap: 3rem; }
          .menu-grid    { grid-template-columns: 1fr; }
          .menu-card    { border-right: none; border-bottom: 1px solid rgba(245,240,232,0.08); }
          .event-item   { grid-template-columns: 1fr; gap: 0.5rem; }
          .event-arrow  { display: none; }
          .contact-inner { grid-template-columns: 1fr; gap: 3rem; }
          .footer-inner  { flex-direction: column; gap: 1.5rem; text-align: center; }
          .menu-inner, .contact-section { padding-left: 1.5rem; padding-right: 1.5rem; }
        }
      `}</style>

      {/* ── Navbar ── */}
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <a href="/" className="navbar-logo">Però</a>
        <ul className="navbar-links">
          {NAV_LINKS.map(l => (
            <li key={l.label}><a href={l.href}>{l.label}</a></li>
          ))}
        </ul>
        <a href="#contatti" className="navbar-reserve">Prenota</a>
      </nav>

      {/* ── Hero ── */}
      <section className="hero" ref={heroRef}>
        <div className="hero-bg" />
        <div className="hero-content">
          <p className="hero-eyebrow">Dal 2018 · Brescia</p>
          <h1 className="hero-title">
            Però.<br /><em>Un posto</em><br />diverso.
          </h1>
          <p className="hero-subtitle">
            Un bar dove il tempo rallenta, il vino racconta storie
            e ogni cocktail è una scelta consapevole.
          </p>
          <a href="#menu" className="hero-cta">
            Scopri il menù <span>→</span>
          </a>
        </div>
        <span className="hero-scroll">Scorri</span>
      </section>

      {/* ── Storia ── */}
      <section id="storia">
        <div className="section">
          <p className="section-eyebrow">La nostra storia</p>
          <h2 className="section-title">Nati per <em>contraddire</em><br />l'ordinario.</h2>
          <div className="storia-grid">
            <div className="storia-text">
              <p>
                Però nasce da un'idea semplice: creare uno spazio dove la qualità non è
                un lusso ma una necessità. Nel 2018, nel cuore di Brescia, abbiamo aperto
                le porte a chi cercava qualcosa di diverso.
              </p>
              <p>
                La nostra carta dei vini è costruita con cura, privilegiando produttori
                artigianali e territori meno conosciuti. I nostri cocktail nascono da
                abbinamenti inaspettati, sempre con ingredienti freschi e di stagione.
              </p>
              <blockquote className="storia-quote">
                "Il nome dice tutto — però, c'è sempre qualcosa in più."
              </blockquote>
            </div>
            <div className="storia-image">
              <img
                src="https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80"
                alt="Interno del bar Però"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Menu Preview ── */}
      <section id="menu" className="menu-section">
        <div className="menu-inner">
          <p className="section-eyebrow">Il nostro menù</p>
          <h2 className="section-title" style={{ color: "var(--bone)" }}>
            Ogni scelta <em>racconta</em><br />qualcosa.
          </h2>
          <div className="menu-grid">
            {MENU_PREVIEW.map(col => (
              <div key={col.category} className="menu-card">
                <p className="menu-card-category">{col.category}</p>
                <ul className="menu-card-items">
                  {col.items.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="menu-cta-wrap">
            <Link href="/bar/pero/menu" className="btn-outline-bone">
              Vedi il menù completo
            </Link>
          </div>
        </div>
      </section>

      {/* ── Events ── */}
      <section id="eventi">
        <div className="section">
          <p className="section-eyebrow">Prossimi eventi</p>
          <h2 className="section-title">Serate che <em>restano</em>.</h2>
          <div className="events-list">
            {EVENTS.map(ev => (
              <div key={ev.title} className="event-item">
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

      {/* ── Contact ── */}
      <section id="contatti" className="contact-section">
        <div className="contact-inner">
          <div>
            <p className="section-eyebrow">Dove siamo</p>
            <h2 className="section-title">Vieni a<br /><em>trovarci</em>.</h2>
            <div className="contact-info">
              <div className="contact-info-item">
                <span className="contact-info-label">Indirizzo</span>
                <span className="contact-info-value">Via Roma 12, Brescia</span>
              </div>
              <div className="contact-info-item">
                <span className="contact-info-label">Orari</span>
                <span className="contact-info-value">Mar–Dom · 17:00 – 02:00</span>
              </div>
              <div className="contact-info-item">
                <span className="contact-info-label">Telefono</span>
                <span className="contact-info-value">+39 030 000 0000</span>
              </div>
              <div className="contact-info-item">
                <span className="contact-info-label">Email</span>
                <span className="contact-info-value">ciao@pero.bar</span>
              </div>
            </div>
          </div>
          <div className="contact-map">
            {/* Replace with a real Google Maps embed using the bar's address */}
            <span className="contact-map-placeholder">Mappa in arrivo</span>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-inner">
          <span className="footer-logo">Però.</span>
          <div className="footer-social">
            <a href="#" target="_blank" rel="noreferrer">Instagram</a>
            <a href="#" target="_blank" rel="noreferrer">Facebook</a>
            <a href="#" target="_blank" rel="noreferrer">TikTok</a>
          </div>
          <span className="footer-copy">© 2025 Però. Tutti i diritti riservati.</span>
        </div>
      </footer>
    </div>
  )
}
