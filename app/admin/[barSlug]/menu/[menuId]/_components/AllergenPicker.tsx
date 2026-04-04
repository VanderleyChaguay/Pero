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
    <div className={styles.section}>
      <p className={styles.label}>Allergeni</p>
      <div className={styles.grid}>
        {allergens.map(a => (
          <button
            key={a.id}
            type="button"
            onClick={() => onToggle(a.id)}
            className={
              selected.includes(a.id) ? styles.btnActive : styles.btn
            }
          >
            {a.nameIt}
          </button>
        ))}
      </div>
    </div>
  )
}
