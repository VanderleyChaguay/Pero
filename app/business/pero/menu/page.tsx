import type { Metadata } from "next"
import { Suspense }      from "react"

import { PeroNavbar }  from "@/components/business/pero/navbar/navbar"
import { PeroFooter }  from "@/components/business/pero/footer/footer"
import { MenuContent } from "@/components/business/pero/menu/MenuContent"
import styles          from "@/components/business/pero/menu/menu.module.css"

// ── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title:       "Menù — Però · Savona",
  description:
    "Scopri il menù completo di Però: cocktail artigianali, selezione vini naturali e cucina di stagione. Via Baglietto 44r, Savona.",
}

// ── Loading skeleton ──────────────────────────────────────────────────────────

function MenuSkeleton() {
  return (
    <div className={styles.skeleton}>
      <div className={`${styles.skeletonBar} ${styles.skeletonLabel}`} />
      <div className={`${styles.skeletonBar} ${styles.skeletonTitle}`} />
      <div className={`${styles.skeletonBar} ${styles.skeletonSub}`}   />
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
// Static shell: only PeroNavbar (Client Component, no dynamic APIs).
//
// PeroFooter uses "use cache" internally and calls new Date() — in Next.js 16
// with PPR, any component outside Suspense is part of the static prerender
// shell and must not call time-sensitive or dynamic APIs.
// Wrapping PeroFooter in Suspense moves it into the dynamic stream,
// resolving the "new Date() before uncached data" conflict.

export default function PeròMenuPage() {
  return (
    <div className="pero-page">
      <PeroNavbar />

      <Suspense fallback={<MenuSkeleton />}>
        <MenuContent slug="pero" />
      </Suspense>

      <Suspense fallback={null}>
        <PeroFooter />
      </Suspense>
    </div>
  )
}
