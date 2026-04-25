import "@/styles/themes/home/style.css"
import styles from "./page.module.css"
import Link from "next/link"
import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma/prisma"
import { routes } from "@/lib/routes"
import { connection } from "next/server" 

// ── Async sub-components ────────────────────────────────────────────────────
// Each owns exactly one async concern and is suspended independently.
// The static shell (title, subtitle) renders immediately.

async function AuthCTA() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    return (
      <Link href={routes.admin.dashboard} className={styles.btnPrimary}>
        Vai alla dashboard
      </Link>
    )
  }

  return (
    <>
      <Link href={routes.auth.login} className={styles.btnPrimary}>
        Accedi
      </Link>
      <Link href={routes.auth.signup} className={styles.btnOutline}>
        Registrati
      </Link>
    </>
  )
}

async function BusinessesGrid() {
  await connection() // For dinamic components
  const businesses = await prisma.business.findMany({
    select: { slug: true, name: true, address: true },
    take: 8,
    orderBy: { createdAt: "asc" },
  })

  if (businesses.length === 0) return null

  return (
    <section className="px-6 pb-28 max-w-4xl mx-auto">
      <hr className={styles.divider} />

      <p className="text-text-muted-home text-xs uppercase tracking-widest mb-8">
        Locali sulla piattaforma
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {businesses.map((business) => (
          <Link
            key={business.slug}
            href={routes.business.home(business.slug)}
            className={`${styles.card} bg-bg-card border border-col-border`}
          >
            <span className="text-text-main text-sm font-medium">
              {business.name}
            </span>
            {business.address && (
              <span className="text-text-muted-home text-xs mt-2 leading-relaxed line-clamp-1">
                {business.address}
              </span>
            )}
          </Link>
        ))}
      </div>
    </section>
  )
}

// ── Static shell ─────────────────────────────────────────────────────────────
// Synchronous — renders immediately. Async parts stream in via Suspense.

export default function HomeShell() {
  return (
    <div data-theme="home" className="min-h-screen bg-bg-app">

      <section className="flex flex-col items-center justify-center min-h-[65vh] px-6 text-center">
        <p className="text-text-muted-home text-xs uppercase tracking-widest mb-6 font-medium">
          Piattaforma di gestione locali
        </p>

        <h1 className={styles.title}>Vael Space</h1>

        <p className={`${styles.subtitle} mt-6 max-w-sm text-base leading-relaxed`}>
          Scopri e gestisci i migliori locali in un&apos;unica piattaforma.
        </p>

        <div className="flex gap-3 mt-10">
          <Suspense fallback={
            <div className="h-10 w-36 rounded-md bg-bg-card opacity-40 animate-pulse" />
          }>
            <AuthCTA />
          </Suspense>
        </div>
      </section>

      <Suspense fallback={null}>
        <BusinessesGrid />
      </Suspense>

    </div>
  )
}
