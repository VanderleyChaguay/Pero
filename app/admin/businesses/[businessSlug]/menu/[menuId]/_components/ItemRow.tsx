"use client"

// app/admin/businesses/[businessSlug]/menu/[menuId]/_components/ItemRow.tsx
// Single menu item row with view/edit modes.

import { useState, useTransition } from "react"
import {
  updateMenuItem,
  toggleMenuItem,
  deleteMenuItem,
  updateItemAllergens,
} from "../../actions"
import { AllergenPicker }          from "./AllergenPicker"
import type { MenuItem, Allergen } from "../_types"
import styles                      from "./ItemRow.module.css"

export function ItemRow({
  item,
  allergens,
  businessSlug,
  menuId,
}: {
  item:         MenuItem
  allergens:    Allergen[]
  businessSlug: string
  menuId:       string
}) {
  const [editing, setEditing]            = useState(false)
  const [pending, startTransition]       = useTransition()
  const [selectedAllergens, setSelected] = useState<string[]>(
    item.allergens.map(a => a.allergen.id)
  )

  const toggleAllergen = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    )
  }

  const handleToggleAvailable = () => {
    startTransition(() =>
      toggleMenuItem(businessSlug, item.id, menuId, item.isAvailable)
    )
  }

  const handleDelete = () => {
    if (!confirm(`Eliminare "${item.name}"?`)) return
    startTransition(() => deleteMenuItem(businessSlug, item.id, menuId))
  }

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      await updateMenuItem(businessSlug, item.id, menuId, formData)
      await updateItemAllergens(businessSlug, item.id, menuId, selectedAllergens)
      setEditing(false)
    })
  }

  // ── Edit mode ──
  if (editing) {
    return (
      <form onSubmit={handleUpdate} className={`flex flex-col ${styles.editForm}`}>

        <div className={`flex flex-wrap ${styles.formRow}`}>
          <input
            name="name"
            defaultValue={item.name}
            required
            className={`flex-1 min-w-[160px] outline-none ${styles.input}`}
          />
          <input
            name="price"
            type="number"
            step="0.10"
            min="0"
            defaultValue={item.price}
            required
            className={`w-[120px] shrink-0 outline-none ${styles.inputSmall}`}
          />
        </div>

        <textarea
          name="description"
          defaultValue={item.description}
          rows={2}
          className={`w-full outline-none resize-y ${styles.textarea}`}
        />

        <input
          name="ingredients"
          defaultValue={item.ingredients.join(", ")}
          placeholder="Ingredienti separati da virgola"
          className={`flex-1 min-w-[160px] outline-none ${styles.input}`}
        />

        <AllergenPicker
          allergens={allergens}
          selected={selectedAllergens}
          onToggle={toggleAllergen}
        />

        <div className={`flex ${styles.editActions}`}>
          <button
            type="submit"
            disabled={pending}
            className={`border-none cursor-pointer text-white disabled:opacity-60 disabled:cursor-not-allowed ${styles.btnSave}`}
          >
            {pending ? "Salvataggio..." : "Salva"}
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className={`bg-transparent cursor-pointer ${styles.btnCancel}`}
          >
            Annulla
          </button>
        </div>
      </form>
    )
  }

  // ── View mode ──
  return (
    <div
      className={`flex items-start justify-between ${styles.row}`}
      style={{ opacity: pending ? 0.5 : 1 }}
    >
      <div className={`flex flex-col flex-1 min-w-0 ${styles.main}`}>

        {/* Name + price + status */}
        <div className={`flex items-baseline flex-wrap ${styles.header}`}>
          <span className={styles.name}>{item.name}</span>
          <span className={styles.price}>€ {item.price.toFixed(2)}</span>
          <span className={item.isAvailable ? styles.badgeOn : styles.badgeOff}>
            {item.isAvailable ? "Disponibile" : "Non disponibile"}
          </span>
        </div>

        {/* Description */}
        {item.description && (
          <p className={`m-0 ${styles.desc}`}>{item.description}</p>
        )}

        {/* Ingredients */}
        {item.ingredients.length > 0 && (
          <p className={`m-0 ${styles.ingredients}`}>
            {item.ingredients.join(" · ")}
          </p>
        )}

        {/* Allergens */}
        {item.allergens.length > 0 && (
          <div className={`flex flex-wrap ${styles.allergenTags}`}>
            {item.allergens.map(a => (
              <span key={a.allergen.id} className={styles.allergenTag}>
                {a.allergen.nameIt}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className={`flex shrink-0 flex-wrap ${styles.actions}`}>
        <button
          onClick={() => setEditing(true)}
          disabled={pending}
          className={`bg-transparent cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed ${styles.btnGhost}`}
        >
          Modifica
        </button>
        <button
          onClick={handleToggleAvailable}
          disabled={pending}
          className={`bg-transparent cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed ${styles.btnGhost}`}
        >
          {item.isAvailable ? "Nascondi" : "Mostra"}
        </button>
        <button
          onClick={handleDelete}
          disabled={pending}
          className={`bg-transparent cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed ${styles.btnDanger}`}
        >
          Elimina
        </button>
      </div>
    </div>
  )
}
