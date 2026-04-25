"use client"

// app/admin/businesses/[businessSlug]/events/_components/DeleteEventButton.tsx
// Isolated delete button for the edit page — handles confirmation and Server Action call.

import { useTransition } from "react"
import { deleteEvent }   from "../actions"
import styles            from "./DeleteEventButton.module.css"

export function DeleteEventButton({
  businessSlug,
  eventId,
  eventTitle,
}: {
  businessSlug: string
  eventId:      string
  eventTitle:   string
}) {
  const [pending, startTransition] = useTransition()

  const handleDelete = () => {
    if (!confirm(`Eliminare definitivamente "${eventTitle}"? L'operazione è irreversibile.`)) return
    startTransition(() => deleteEvent(businessSlug, eventId))
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      className={`bg-transparent cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${styles.btn}`}
    >
      {pending ? "Eliminazione..." : "Elimina evento"}
    </button>
  )
}
