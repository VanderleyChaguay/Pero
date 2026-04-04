"use client"

// app/admin/[barSlug]/menu/_components/CreateMenuForm.tsx
// Form to create a new menu — category + name.

import { useTransition } from "react"
import { createMenu }    from "../actions"
import styles            from "./CreateMenuForm.module.css"

export function CreateMenuForm({ barSlug }: { barSlug: string }) {
  const [pending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      await createMenu(barSlug, formData)
      e.currentTarget?.reset()
    })
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        name="name"
        placeholder="Nome del menù (es. Cocktail estivi)"
        required
        className={styles.input}
      />
      <select name="category" required className={styles.select}>
        <option value="">Categoria</option>
        <option value="DRINKS">Drinks</option>
        <option value="WINE">Vini</option>
        <option value="FOOD">Cucina</option>
      </select>
      <button
        type="submit"
        disabled={pending}
        className={styles.btnCreate}
      >
        {pending ? "Creazione..." : "+ Crea menù"}
      </button>
    </form>
  )
}
