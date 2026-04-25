"use client"

// app/admin/businesses/[businessSlug]/menu/_components/CreateMenuForm.tsx

import { useTransition } from "react"
import { createMenu }    from "../actions"
import styles            from "./CreateMenuForm.module.css"

export function CreateMenuForm({ businessSlug }: { businessSlug: string }) {
  const [pending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      await createMenu(businessSlug, formData)
      e.currentTarget?.reset()
    })
  }

  return (
    <form onSubmit={handleSubmit} className={`flex flex-wrap ${styles.form}`}>
      <input
        name="name"
        placeholder="Nome del menù (es. Cocktail estivi, Carta vini, Cucina)"
        required
        className={`flex-1 min-w-[200px] outline-none ${styles.input}`}
      />
      <button
        type="submit"
        disabled={pending}
        className={`border-none cursor-pointer whitespace-nowrap text-white disabled:opacity-60 disabled:cursor-not-allowed ${styles.btnCreate}`}
      >
        {pending ? "Creazione..." : "+ Crea menù"}
      </button>
    </form>
  )
}
