"use client"

// app/admin/[barSlug]/menu/[menuId]/_components/CreateItemForm.tsx
// Form to create a new menu item with allergen selection.

import { useState, useTransition } from "react"
import { createMenuItem }          from "../../actions"
import { AllergenPicker }          from "./AllergenPicker"
import type { Allergen }           from "../_types"
import styles                      from "./CreateItemForm.module.css"

export function CreateItemForm({
  barSlug,
  menuId,
  allergens,
}: {
  barSlug:   string
  menuId:    string
  allergens: Allergen[]
}) {
  const [pending, startTransition]       = useTransition()
  const [selectedAllergens, setSelected] = useState<string[]>([])

  const toggleAllergen = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    )
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form     = e.currentTarget
    const formData = new FormData(form)

    startTransition(async () => {
      await createMenuItem(barSlug, menuId, formData, selectedAllergens)
      form.reset()
      setSelected([])
    })
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>

      {/* Row 1: name + price */}
      <div className={styles.row}>
        <input
          name="name"
          placeholder="Nome (es. Negroni Sbagliato)"
          required
          className={styles.input}
        />
        <input
          name="price"
          type="number"
          step="0.10"
          min="0"
          placeholder="Prezzo (es. 8.50)"
          required
          className={styles.inputSmall}
        />
      </div>

      {/* Row 2: description */}
      <textarea
        name="description"
        placeholder="Descrizione (facoltativa)"
        rows={2}
        className={styles.textarea}
      />

      {/* Row 3: ingredients */}
      <input
        name="ingredients"
        placeholder="Ingredienti separati da virgola (es. Vodka, Lime, Zenzero)"
        className={styles.input}
      />

      {/* Row 4: allergens */}
      <AllergenPicker
        allergens={allergens}
        selected={selectedAllergens}
        onToggle={toggleAllergen}
      />

      <button
        type="submit"
        disabled={pending}
        className={styles.btnCreate}
      >
        {pending ? "Aggiunta..." : "+ Aggiungi voce"}
      </button>
    </form>
  )
}
