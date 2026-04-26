"use client"

// app/admin/businesses/[businessSlug]/events/_components/EventForm.tsx
// Shared form for creating and editing events.
// Handles datetime-local → UTC conversion so the server always receives
// unambiguous ISO strings regardless of the user's timezone.

import { useState, useTransition }   from "react"
import { createEvent, updateEvent }  from "../actions"
import { MediaUpload }               from "@/components/ui/MediaUpload"
import type { EventDetail, EventStatus } from "../_types"
import styles                        from "./EventForm.module.css"

// ── Datetime helpers ──────────────────────────────────────────────────────────

// Convert a stored UTC ISO string → datetime-local input value in local time.
// Uses local Date methods so the browser's timezone is respected automatically.
function utcToLocalInput(isoString: string): string {
  const d   = new Date(isoString)
  const pad = (n: number) => String(n).padStart(2, "0")
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    `T${pad(d.getHours())}:${pad(d.getMinutes())}`
  )
}

// Convert a datetime-local value → UTC ISO string.
// Browsers treat datetime-local strings as local time, so new Date() gives
// the correct UTC equivalent.
function localInputToUtc(localValue: string): string {
  return new Date(localValue).toISOString()
}

// ── Component ─────────────────────────────────────────────────────────────────

type Props = {
  businessSlug: string
  event?:       EventDetail   // undefined = create mode
}

export function EventForm({ businessSlug, event }: Props) {
  const isEdit = Boolean(event)
  const [pending, startTransition] = useTransition()

  // Controlled state for datetime inputs (display in local time)
  const [startLocal, setStartLocal] = useState(
    event ? utcToLocalInput(event.startDate) : ""
  )
  const [endLocal, setEndLocal] = useState(
    event?.endDate ? utcToLocalInput(event.endDate) : ""
  )

  // Status toggle — controlled to drive the hidden input
  const [status, setStatus] = useState<EventStatus>(event?.status ?? "DRAFT")

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    // Inject UTC datetime values — datetime-local inputs are presentational only
    if (startLocal) formData.set("startDate", localInputToUtc(startLocal))
    if (endLocal)   formData.set("endDate",   localInputToUtc(endLocal))
    else            formData.delete("endDate")

    startTransition(async () => {
      if (isEdit && event) {
        await updateEvent(businessSlug, event.id, formData)
      } else {
        await createEvent(businessSlug, formData)
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col ${styles.form}`}>

      {/* ── Title ── */}
      <div className={`flex flex-col ${styles.field}`}>
        <label htmlFor="ef-title" className={styles.label}>Titolo *</label>
        <input
          id="ef-title"
          name="title"
          defaultValue={event?.title}
          placeholder="es. Serata Jazz, Degustazione vini, Notte bianca"
          required
          className={`outline-none ${styles.input}`}
        />
      </div>

      {/* ── Description ── */}
      <div className={`flex flex-col ${styles.field}`}>
        <label htmlFor="ef-description" className={styles.label}>
          Descrizione
          <span className={styles.optional}> (facoltativa)</span>
        </label>
        <textarea
          id="ef-description"
          name="description"
          defaultValue={event?.description}
          placeholder="Descrivi l'evento: atmosfera, ospiti, dress code..."
          rows={4}
          className={`outline-none resize-y ${styles.textarea}`}
        />
      </div>

      {/* ── Dates row ── */}
      <div className={`flex flex-wrap ${styles.datesRow}`}>

        <div className={`flex flex-col flex-1 min-w-[200px] ${styles.field}`}>
          <label htmlFor="ef-start" className={styles.label}>Data e ora di inizio *</label>
          <input
            id="ef-start"
            type="datetime-local"
            value={startLocal}
            onChange={e => setStartLocal(e.target.value)}
            required
            className={`outline-none ${styles.input}`}
          />
        </div>

        <div className={`flex flex-col flex-1 min-w-[200px] ${styles.field}`}>
          <label htmlFor="ef-end" className={styles.label}>
            Data e ora di fine
            <span className={styles.optional}> (facoltativa)</span>
          </label>
          <input
            id="ef-end"
            type="datetime-local"
            value={endLocal}
            min={startLocal}
            onChange={e => setEndLocal(e.target.value)}
            className={`outline-none ${styles.input}`}
          />
        </div>

      </div>

      {/* ── Cover image ── */}
      <div className={`flex flex-col ${styles.field}`}>
        <label className={styles.label}>
          Immagine di copertina
          <span className={styles.optional}> (facoltativa)</span>
        </label>
        <MediaUpload
          name="coverImageUrl"
          bucket="event-covers"
          pathPrefix={`${businessSlug}/event-cover`}
          profile="cover"
          initialUrl={event?.coverImageUrl}
          label="Aggiungi immagine di copertina"
        />
      </div>

      {/* ── Status ── */}
      <div className={`flex items-center flex-wrap ${styles.statusRow}`}>
        <span className={styles.label}>Stato</span>
        <div className={`flex ${styles.statusToggle}`}>
          <button
            type="button"
            onClick={() => setStatus("DRAFT")}
            className={`cursor-pointer ${styles.statusBtn} ${status === "DRAFT" ? styles.statusActive : ""}`}
          >
            Bozza
          </button>
          <button
            type="button"
            onClick={() => setStatus("PUBLISHED")}
            className={`cursor-pointer ${styles.statusBtn} ${status === "PUBLISHED" ? styles.statusPublished : ""}`}
          >
            Pubblicato
          </button>
        </div>
        {/* Hidden input carries the status value to the Server Action */}
        <input type="hidden" name="status" value={status} />
      </div>

      {/* ── Submit ── */}
      <div className={`flex items-center flex-wrap ${styles.footer}`}>
        <button
          type="submit"
          disabled={pending}
          className={`border-none cursor-pointer text-white disabled:opacity-60 disabled:cursor-not-allowed ${styles.btnSubmit}`}
        >
          {pending
            ? (isEdit ? "Salvataggio..." : "Creazione...")
            : (isEdit ? "Salva modifiche" : "+ Crea evento")
          }
        </button>
        {isEdit && !pending && (
          <span className={styles.hint}>Le modifiche vengono salvate immediatamente.</span>
        )}
      </div>

    </form>
  )
}
