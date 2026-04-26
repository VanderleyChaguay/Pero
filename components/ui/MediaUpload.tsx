"use client"

// components/ui/MediaUpload.tsx
// Generic image upload component for the admin panel.
//
// Responsibilities:
//   1. Compress the selected file with the AVIF→WebP→JPEG pipeline.
//   2. Upload to Supabase Storage and write the public URL into a hidden input.
//   3. Clean up orphaned storage files created in the current session:
//      - Replace A with B  → delete A before uploading B.
//      - Click "Remove" on a session-uploaded file → delete immediately.
//      Files that came from the DB (initialUrl) are left to the Server Action.
//
// "isSessionUpload" is not a boolean flag but is inferred from
// sessionStoragePath !== null, keeping state minimal.

import { useState, useRef }             from "react"
import { optimize }                     from "@/lib/media/optimize"
import { generateStoragePath }          from "@/lib/media/paths"
import { uploadToStorage, deleteFromStorage } from "@/lib/media/storage"
import type { MediaProfile }            from "@/lib/media/types"
import styles                           from "./MediaUpload.module.css"

// ── Constants ─────────────────────────────────────────────────────────────────

const FORMAT_LABEL: Record<string, string> = {
  "image/avif": "AVIF",
  "image/webp": "WebP",
  "image/jpeg": "JPEG",
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtBytes(b: number): string {
  if (b < 1024)        return `${b} B`
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`
  return `${(b / (1024 * 1024)).toFixed(1)} MB`
}

function classifyError(err: unknown, bucket: string): string {
  const raw =
    err instanceof Error
      ? err.message
      : typeof err === "object" && err !== null && "message" in err
        ? String((err as { message: unknown }).message)
        : String(err)

  const low = raw.toLowerCase()

  if (low.includes("bucket not found") || low.includes("no such bucket"))
    return `Bucket "${bucket}" non trovato. Crealo nel pannello Supabase Storage prima di caricare immagini.`

  if (
    low.includes("row-level security") ||
    low.includes("security policy")    ||
    low.includes("violates")           ||
    low.includes("403")
  )
    return `Permessi insufficienti sul bucket "${bucket}". Verifica che le policy RLS permettano INSERT agli utenti autenticati.`

  if (low.includes("jwt") || low.includes("unauthorized") || low.includes("401"))
    return "Sessione scaduta. Ricarica la pagina e riprova."

  if (low.includes("too large") || low.includes("payload too large") || low.includes("413"))
    return "File troppo grande anche dopo la compressione."

  if (raw) return `Caricamento fallito: ${raw}`
  return "Caricamento fallito. Controlla la connessione e riprova."
}

// ── Types ─────────────────────────────────────────────────────────────────────

type Phase = "idle" | "processing" | "uploading" | "done" | "error"

type Stats = {
  original: number
  output:   number
  format:   string
}

// ── Component ─────────────────────────────────────────────────────────────────

export function MediaUpload({
  name,
  bucket,
  pathPrefix,
  profile    = "cover",
  initialUrl,
  label,
  hint,
}: {
  name:        string
  bucket:      string
  pathPrefix:  string
  profile?:    MediaProfile
  initialUrl?: string | null
  label?:      string
  hint?:       string
}) {
  // imageUrl is what gets submitted in the hidden input.
  // sessionStoragePath tracks any file uploaded this session for client-side cleanup.
  const [imageUrl,           setImageUrl]           = useState<string | null>(initialUrl ?? null)
  const [sessionStoragePath, setSessionStoragePath] = useState<string | null>(null)
  const [preview,            setPreview]            = useState<string | null>(null)
  const [phase,              setPhase]              = useState<Phase>("idle")
  const [stats,              setStats]              = useState<Stats | null>(null)
  const [error,              setError]              = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const isBusy = phase === "processing" || phase === "uploading"

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Seleziona un file immagine.")
      return
    }

    setError(null)
    setStats(null)
    setPhase("processing")

    const localPreview = URL.createObjectURL(file)
    setPreview(localPreview)

    // Snapshot before async work — used to clean up the previous session upload.
    const prevSessionPath = sessionStoragePath

    try {
      const result      = await optimize(file, profile)
      const storagePath = generateStoragePath(pathPrefix, result.ext)

      setPhase("uploading")

      // Delete the previous session-uploaded file before uploading the replacement.
      // This runs even if the new upload subsequently fails — the old file is
      // already abandoned at this point.
      if (prevSessionPath) {
        await deleteFromStorage(bucket, prevSessionPath)
      }

      const { publicUrl } = await uploadToStorage(
        result.blob, bucket, storagePath, result.mime,
      )

      setImageUrl(publicUrl)
      setSessionStoragePath(storagePath)
      setStats({ original: file.size, output: result.outputSize, format: result.mime })
      setPhase("done")
    } catch (err: unknown) {
      console.error("[MediaUpload] upload error:", err)
      setError(classifyError(err, bucket))
      setPhase("error")
    } finally {
      URL.revokeObjectURL(localPreview)
      setPreview(null)
    }
  }

  const handleRemove = async () => {
    // If the visible image was uploaded this session, delete it immediately.
    // If it came from initialUrl (a DB-stored URL), the Server Action handles
    // the old file when the form is saved with an empty coverImageUrl.
    if (sessionStoragePath) {
      await deleteFromStorage(bucket, sessionStoragePath)
      setSessionStoragePath(null)
    }
    setImageUrl(null)
    setPreview(null)
    setPhase("idle")
    setStats(null)
    setError(null)
    if (fileRef.current) fileRef.current.value = ""
  }

  const phaseLabel = phase === "processing" ? "Compressione..." : "Caricamento..."
  const displayUrl = preview ?? imageUrl
  const saving     = stats ? Math.round((1 - stats.output / stats.original) * 100) : 0

  return (
    <div className={styles.root}>

      {/* Carries the stored URL to the Server Action */}
      <input type="hidden" name={name} value={imageUrl ?? ""} />

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className={styles.fileInput}
        onChange={e => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />

      {displayUrl ? (
        <div className={styles.previewWrapper}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={displayUrl} alt="Anteprima immagine" className={styles.preview} />

          {isBusy ? (
            <div className={`flex flex-col items-center justify-center gap-1 ${styles.uploadingOverlay}`}>
              <span className={styles.uploadingLabel}>{phaseLabel}</span>
            </div>
          ) : (
            <div className={`flex ${styles.previewActions}`}>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className={`cursor-pointer ${styles.btnChange}`}
              >
                Cambia
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className={`cursor-pointer ${styles.btnRemove}`}
              >
                Rimuovi
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={isBusy}
          className={`flex flex-col items-center justify-center w-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${styles.dropzone}`}
        >
          <span className={styles.dropzoneIcon}>⊕</span>
          <span className={styles.dropzoneLabel}>
            {isBusy ? phaseLabel : (label ?? "Aggiungi immagine")}
          </span>
          <span className={styles.dropzoneHint}>
            {hint ?? "Qualsiasi formato · qualsiasi dimensione · compressa automaticamente"}
          </span>
        </button>
      )}

      {stats && !isBusy && (
        <p className={styles.stats}>
          <span className={styles.formatBadge}>
            {FORMAT_LABEL[stats.format] ?? stats.format}
          </span>
          {fmtBytes(stats.original)} → {fmtBytes(stats.output)}
          {" "}<span className={styles.statsSaving}>−{saving}%</span>
        </p>
      )}

      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
}
