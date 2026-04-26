// app/business/pero/page.tsx
// Homepage for Bar Però.
//
// PeroEventiPreview is async (fetches DB at request time) — wrapped in
// Suspense so it streams independently and doesn't block the static shell.
// PeroFooter uses "use cache" internally — same Suspense pattern as
// menu/page.tsx to keep it out of the static prerender shell.

import { Suspense }           from "react"
import { PeroNavbar }         from "@/components/business/pero/navbar/navbar"
import { PeroHero }           from "@/components/business/pero/hero/hero"
import { PeroStoria }         from "@/components/business/pero/storia/storia"
import { PeroMenuPreview }    from "@/components/business/pero/menuPreview/menuPreview"
import { PeroEventiPreview }  from "@/components/business/pero/events/events"
import { PeroContact }        from "@/components/business/pero/contact/contact"
import { PeroFooter }         from "@/components/business/pero/footer/footer"

export default function PeròPage() {
  return (
    <div className="pero-page">

      <PeroNavbar />
      <PeroHero />
      <PeroStoria />
      <PeroMenuPreview />

      {/* Events preview fetches from DB — stream it independently */}
      <Suspense fallback={null}>
        <PeroEventiPreview />
      </Suspense>

      <PeroContact />

      {/* Footer uses "use cache" with new Date() — must be outside static shell */}
      <Suspense fallback={null}>
        <PeroFooter />
      </Suspense>

    </div>
  )
}
