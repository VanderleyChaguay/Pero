"use client"

// app/admin/[barSlug]/menu/[menuId]/_components/ItemList.tsx
// Renders the list of menu items or an empty state.

import { ItemRow }              from "./ItemRow"
import type { MenuItem, Allergen } from "../_types"
import styles                   from "./ItemList.module.css"

export function ItemList({
  items,
  allergens,
  barSlug,
  menuId,
}: {
  items:     MenuItem[]
  allergens: Allergen[]
  barSlug:   string
  menuId:    string
}) {
  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        Nessuna voce ancora. Aggiungine una sopra.
      </div>
    )
  }

  return (
    <div className={styles.list}>
      {items.map(item => (
        <ItemRow
          key={item.id}
          item={item}
          allergens={allergens}
          barSlug={barSlug}
          menuId={menuId}
        />
      ))}
    </div>
  )
}
