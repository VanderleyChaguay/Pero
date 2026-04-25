"use client"

// app/admin/businesses/[businessSlug]/menu/[menuId]/_components/ItemList.tsx
// Renders the list of menu items or an empty state.

import { ItemRow }                 from "./ItemRow"
import type { MenuItem, Allergen } from "../_types"
import styles                      from "./ItemList.module.css"

export function ItemList({
  items,
  allergens,
  businessSlug,
  menuId,
}: {
  items:        MenuItem[]
  allergens:    Allergen[]
  businessSlug: string
  menuId:       string
}) {
  if (items.length === 0) {
    return (
      <div className={`text-center ${styles.empty}`}>
        Nessuna voce ancora. Aggiungine una sopra.
      </div>
    )
  }

  return (
    <div className={`flex flex-col ${styles.list}`}>
      {items.map(item => (
        <ItemRow
          key={item.id}
          item={item}
          allergens={allergens}
          businessSlug={businessSlug}
          menuId={menuId}
        />
      ))}
    </div>
  )
}
