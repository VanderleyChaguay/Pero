"use client"

// app/admin/[barSlug]/menu/[menuId]/_components/ItemRow.tsx
// Single menu item row with view/edit modes.

import { useState, useTransition }  from "react"
import {
  updateMenuItem,
  toggleMenuItem,
  deleteMenuItem,
  updateItemAllergens,
} from "../../actions"
import { AllergenPicker }           from "./AllergenPicker"
import type { MenuItem, Allergen }  from "../_types"
import styles                       from "./ItemRow.module.css"

export function ItemRow({
  item,
  allergens,
  barSlug,
  menuId,
}: {
  item:      MenuItem
  allergens: Allergen[]
  barSlug:   string
  menuId:    string
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
      toggleMenuItem(barSlug, item.id, menuId, item.isAvailable)
    )
  }

  const handleDelete = () => {
    if (!confirm(`Eliminare "${item.name}"?`)) return
    startTransition(() => deleteMenuItem(barSlug, item.id, menuId))
  }

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      await updateMenuItem(barSlug, item.id, menuId, formData)
      await updateItemAllergens(barSlug, item.id, menuId, selectedAllergens)
      setEditing(false)
    })
  }

  // ── Edit mode ──
  if (editing) {
    return (
      <form onSubmit={handleUpdate} className={styles.editForm}>

        <div className={styles.formRow}>
          <input
            name="name"
            defaultValue={item.name}
            required
            className={styles.input}
          />
          <input
            name="price"
            type="number"
            step="0.10"
            min="0"
            defaultValue={item.price}
            required
            className={styles.inputSmall}
          />
        </div>

        <textarea
          name="description"
          defaultValue={item.description}
          rows={2}
          className={styles.textarea}
        />

        <input
          name="ingredients"
          defaultValue={item.ingredients.join(", ")}
          placeholder="Ingredienti separati da virgola"
          className={styles.input}
        />

        <AllergenPicker
          allergens={allergens}
          selected={selectedAllergens}
          onToggle={toggleAllergen}
        />

        <div className={styles.editActions}>
          <button
            type="submit"
            disabled={pending}
            className={styles.btnSave}
          >
            {pending ? "Salvataggio..." : "Salva"}
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className={styles.btnCancel}
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
      className={styles.row}
      style={{ opacity: pending ? 0.5 : 1 }}
    >
      <div className={styles.main}>

        {/* Name + price + status */}
        <div className={styles.header}>
          <span className={styles.name}>{item.name}</span>
          <span className={styles.price}>€ {item.price.toFixed(2)}</span>
          <span className={item.isAvailable ? styles.badgeOn : styles.badgeOff}>
            {item.isAvailable ? "Disponibile" : "Non disponibile"}
          </span>
        </div>

        {/* Description */}
        {item.description && (
          <p className={styles.desc}>{item.description}</p>
        )}

        {/* Ingredients */}
        {item.ingredients.length > 0 && (
          <p className={styles.ingredients}>
            {item.ingredients.join(" · ")}
          </p>
        )}

        {/* Allergens */}
        {item.allergens.length > 0 && (
          <div className={styles.allergenTags}>
            {item.allergens.map(a => (
              <span key={a.allergen.id} className={styles.allergenTag}>
                {a.allergen.nameIt}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button
          onClick={() => setEditing(true)}
          disabled={pending}
          className={styles.btnGhost}
        >
          Modifica
        </button>
        <button
          onClick={handleToggleAvailable}
          disabled={pending}
          className={styles.btnGhost}
        >
          {item.isAvailable ? "Nascondi" : "Mostra"}
        </button>
        <button
          onClick={handleDelete}
          disabled={pending}
          className={styles.btnDanger}
        >
          Elimina
        </button>
      </div>
    </div>
  )
}
