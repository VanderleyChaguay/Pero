"use client"

// Hero component for Bar Però
// Full-viewport section with background image, entrance animation and scroll indicator

import { useEffect, useRef, useState } from "react"
import clsx from "clsx"
import styles from "./hero.module.css"

export function PeroHero() {
  const [visible, setVisible] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  

  // Trigger entrance animation shortly after mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <section className={styles.hero}>
      {/* Background image with zoom animation — replace url in hero.module.css with real photo */}
      <div className={styles.bg} />

      {/* Subtle grain overlay for depth and texture */}
      <div className={styles.grain} />

      {/* Main content — fades and slides up on load */}
      <div className={clsx(styles.content, { [styles.visible]: visible })}>

        <p className={styles.eyebrow}>Wine bar · Savona</p>

        <h1 className={styles.title}>
          Però.<br />
          <em>Un posto</em><br />
          diverso.
        </h1>

        <p className={styles.subtitle}>
          Un bar dove il tempo rallenta, il vino racconta storie
          e ogni cocktail è una scelta consapevole.
        </p>

        <div className={styles.actions}>
          <a href="#menu"   className={styles.ctaPrimary}>Scopri il menù</a>
          <a href="#storia" className={styles.ctaSecondary}>La nostra storia →</a>
        </div>
      </div>

      {/* Vertical scroll indicator */}
      <span className={styles.scrollIndicator}>Scorri</span>
    </section>
  )
}
