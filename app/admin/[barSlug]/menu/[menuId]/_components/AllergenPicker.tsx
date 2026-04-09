"use client"

// app/admin/[barSlug]/menu/[menuId]/_components/AllergenPicker.tsx
// Reusable allergen selector — used in both create and edit forms.

import type { Allergen } from "../_types"
import styles            from "./AllergenPicker.module.css"

export function AllergenPicker({
  allergens,
  selected,
  onToggle,
}: {
  allergens: Allergen[]
  selected:  string[]
  onToggle:  (id: string) => void
}) {
  return (
    <div className={`flex flex-col ${styles.section}`}>
      <p className={`m-0 uppercase ${styles.label}`}>Allergeni</p>
      <div className={`flex flex-wrap ${styles.grid}`}>
        {allergens.map(a => (
          <button
            key={a.id}
            type="button"
            onClick={() => onToggle(a.id)}
            className={`cursor-pointer rounded-full ${
              selected.includes(a.id) ? styles.btnActive : styles.btn
            }`}
          >
            {a.nameIt}
          </button>
        ))}
      </div>
    </div>
  )
}
