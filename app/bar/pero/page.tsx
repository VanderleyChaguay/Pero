
import Image from "next/image"
import Link from "next/link"
import { PeroNavbar } from "@/components/bar/pero/navbar/navbar"
import { PeroHero } from "@/components/bar/pero/hero/hero"
import { PeroStoria } from "@/components/bar/pero/storia/storia"
import { PeroMenuPreview } from "@/components/bar/pero/menuPreview/menuPreview"
import { PeroEventiPreview } from "@/components/bar/pero/events/events"
import { PeroContact } from "@/components/bar/pero/contact/contact"
import { PeroFooter } from "@/components/bar/pero/footer/footer"
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
