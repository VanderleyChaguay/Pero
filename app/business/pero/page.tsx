
import Image from "next/image"
import Link from "next/link"
import { PeroNavbar } from "@/components/business/pero/navbar/navbar"
import { PeroHero } from "@/components/business/pero/hero/hero"
import { PeroStoria } from "@/components/business/pero/storia/storia"
import { PeroMenuPreview } from "@/components/business/pero/menuPreview/menuPreview"
import { PeroEventiPreview } from "@/components/business/pero/events/events"
import { PeroContact } from "@/components/business/pero/contact/contact"
import { PeroFooter } from "@/components/business/pero/footer/footer"
// Evaluated once at build time — not inside the component
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
        <PeroContact/>
        {/* ══ FOOTER ══════════════════════════════════════════ */}
        <PeroFooter/>
      </div>
    </>
  )
}
