// app/bar/pero/layout.tsx
// Applies Però's visual theme to all pages under /bar/pero
// The data-theme attribute activates the CSS variables in styles/themes/pero.css

import "@/styles/themes/pero/style.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title:       "Però — Wine & Cocktails · Savona",
  description: "Un posto diverso. Vini, cocktail e cucina nel cuore di Savona.",
}

export default function PeròLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div data-theme="pero" style={{ fontFamily: "var(--font-body)" }}>
      {children}
    </div>
  )
}