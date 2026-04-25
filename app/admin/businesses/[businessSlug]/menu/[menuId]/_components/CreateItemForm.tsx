"use client"

// app/admin/businesses/[businessSlug]/menu/[menuId]/_components/CreateItemForm.tsx
// Form to create a new menu item with allergen selection.

import { useState, useTransition } from "react"
import { createMenuItem }          from "../../actions"
import { AllergenPicker }          from "./AllergenPicker"
import type { Allergen }           from "../_types"
import styles                      from "./CreateItemForm.module.css"

export function CreateItemForm({
  businessSlug,
  menuId,
  allergens,
}: {
  businessSlug: string
  menuId:       string
  allergens:    Allergen[]
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
      await createMenuItem(businessSlug, menuId, formData, selectedAllergens)
      form.reset()
      setSelected([])
    })
  }

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col ${styles.form}`}>

      {/* Row 1: name + price */}
      <div className={`flex flex-wrap ${styles.row}`}>
        <input
          name="name"
          placeholder="Nome (es. Negroni Sbagliato)"
          required
          className={`flex-1 min-w-[160px] outline-none ${styles.input}`}
        />
        <input
          name="price"
          type="number"
          step="0.10"
          min="0"
          placeholder="Prezzo (es. 8.50)"
          required
          className={`w-[120px] shrink-0 outline-none ${styles.inputSmall}`}
        />
      </div>

      {/* Row 2: description */}
      <textarea
        name="description"
        placeholder="Descrizione (facoltativa)"
        rows={2}
        className={`w-full outline-none resize-y ${styles.textarea}`}
      />

      {/* Row 3: ingredients */}
      <input
        name="ingredients"
        placeholder="Ingredienti separati da virgola (es. Vodka, Lime, Zenzero)"
        className={`flex-1 min-w-[160px] outline-none ${styles.input}`}
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
        className={`self-start border-none cursor-pointer text-white disabled:opacity-60 disabled:cursor-not-allowed ${styles.btnCreate}`}
      >
        {pending ? "Aggiunta..." : "+ Aggiungi voce"}
      </button>
    </form>
  )
}
