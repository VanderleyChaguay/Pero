"use client"

// Navbar component for Bar Però
// Desktop: logo + nav links + search icon
// Mobile (<640px): logo + search icon + dropdown toggle arrow

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import clsx from "clsx"
import { routes } from "@/lib/routes"
import styles from "./navbar.module.css"

const NAV_LINKS = [
  { label: "Storia",   href: "#storia"                    },
  { label: "Menù",     href: routes.business.menu("pero") },
  { label: "Eventi",   href: "#eventi"                    },
  { label: "Contatti", href: "#contatti"                  },
]

export function PeroNavbar() {
  const [scrolled,   setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Apply scrolled style after passing the hero
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60)
      // Close mobile menu when user scrolls away
      if (window.scrollY > 60) setMobileOpen(false)
    }
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Close mobile menu when a nav link is clicked
  const handleLinkClick = () => setMobileOpen(false)

  return (
    <nav className={clsx(styles.navbar, {
      [styles.scrolled]:   scrolled,
      [styles.mobileOpen]: mobileOpen,
    })}>

      {/* ── Logo ── */}
      <Link href="/business/pero" className={styles.logoLink}>
        <Image
          src="/images/pero/PeroWithoutBackGround.png"
          alt="Però"
          width={90}
          height={50}
          className={styles.logo}
          priority
        />
      </Link>

      {/* ── Desktop nav links — hidden below 640px ── */}
      <ul className={styles.links}>
        {NAV_LINKS.map(l => (
          <li key={l.label}>
            <a href={l.href}>{l.label}</a>
          </li>
        ))}
      </ul>

      {/* ── Right side: search + mobile toggle ── */}
      <div className={styles.actions}>

        {/* Search icon — search functionality to be implemented later */}
        <button className={styles.iconBtn} aria-label="Cerca">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>

        {/* Dropdown arrow — only visible below 640px */}
        <button
          className={clsx(styles.iconBtn, styles.mobileToggle)}
          aria-label={mobileOpen ? "Chiudi menu" : "Apri menu"}
          onClick={() => setMobileOpen(prev => !prev)}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={clsx(styles.arrow, { [styles.arrowUp]: mobileOpen })}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      {/* ── Mobile dropdown — slides down below navbar ── */}
      <div className={clsx(styles.mobileMenu, { [styles.mobileMenuOpen]: mobileOpen })}>
        <ul className={styles.mobileLinks}>
          {NAV_LINKS.map(l => (
            <li key={l.label}>
              <a href={l.href} onClick={handleLinkClick}>{l.label}</a>
            </li>
          ))}
        </ul>
      </div>

    </nav>
  )
}
