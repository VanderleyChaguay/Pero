// app/admin/businesses/[businessSlug]/menu/_components/MenuList.tsx
// Renders the list of menus or an empty state.

import { MenuRow }          from "./MenuRow"
import type { MenuSummary } from "../_types"
import styles               from "./MenuList.module.css"

export function MenuList({
  menus,
  businessSlug,
}: {
  menus:        MenuSummary[]
  businessSlug: string
}) {
  if (menus.length === 0) {
    return (
      <div className={`text-center ${styles.empty}`}>
        Nessun menù ancora. Creane uno sopra.
      </div>
    )
  }

  return (
    <div className={`flex flex-col ${styles.list}`}>
      {menus.map(menu => (
        <MenuRow key={menu.id} menu={menu} businessSlug={businessSlug} />
      ))}
    </div>
  )
}
