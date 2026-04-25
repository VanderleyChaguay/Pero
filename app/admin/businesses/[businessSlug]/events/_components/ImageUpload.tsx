"use client"

import { useState, useRef } from "react"
import { createClient }     from "@/lib/supabase/client"
import styles               from "./ImageUpload.module.css"

const BUCKET    = "event-covers"
const MAX_W     = 1400
const MAX_H     = 1050
const TARGET_B  = 350 * 1024   // 350 KB target
const Q_START   = 0.88
const Q_MIN     = 0.60
const Q_STEP    = 0.06
const DIM_SCALE = 0.80

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtBytes(b: number): string {
  if (b < 1024)         return `${b} B`
  if (b < 1024 * 1024)  return `${(b / 1024).toFixed(0)} KB`
  return `${(b / (1024 * 1024)).toFixed(1)} MB`
}

let _webp: boolean | null = null
async function supportsWebP(): Promise<boolean> {
  if (_webp !== null) return _webp
  return new Promise(resolve => {
    const img = new Image()
    img.onload  = () => { _webp = img.width === 1; resolve(_webp) }
    img.onerror = () => { _webp = false; resolve(false) }
    img.src = "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAQAcJZACdAEO/gHOAAA="
  })
}

// ── Compression pipeline ──────────────────────────────────────────────────────

type Compressed = { blob: Blob; mime: string; ext: string }

function bitmapToBlob(bmp: ImageBitmap, w: number, h: number, mime: string, quality: number): Promise<Blob> {
  const canvas = document.createElement("canvas")
  canvas.width  = w
  canvas.height = h
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, w, h)
  return new Promise((resolve, reject) =>
    canvas.toBlob(b => b ? resolve(b) : reject(new Error("toBlob failed")), mime, quality)
  )
}

async function compressBitmap(
  bmp: ImageBitmap, w: number, h: number, mime: string
): Promise<Blob> {
  for (let q = Q_START; q >= Q_MIN - 0.001; q -= Q_STEP) {
    const q_clamped = Math.max(q, Q_MIN)
    const blob = await bitmapToBlob(bmp, w, h, mime, q_clamped)
    if (blob.size <= TARGET_B || q_clamped <= Q_MIN) return blob
  }
  return bitmapToBlob(bmp, w, h, mime, Q_MIN)
}

async function compress(file: File): Promise<Compressed> {
  const mime = (await supportsWebP()) ? "image/webp" : "image/jpeg"
  const ext  = mime === "image/webp" ? "webp" : "jpg"

  // createImageBitmap corrects EXIF orientation automatically
  const bmp = await createImageBitmap(file)

  const ratio = Math.min(MAX_W / bmp.width, MAX_H / bmp.height, 1)
  const w = Math.round(bmp.width  * ratio)
  const h = Math.round(bmp.height * ratio)

  const blob = await compressBitmap(bmp, w, h, mime)
  if (blob.size <= TARGET_B) return { blob, mime, ext }

  // Dimension-reduction fallback pass
  const sw = Math.round(w * DIM_SCALE)
  const sh = Math.round(h * DIM_SCALE)
  const smallCanvas = document.createElement("canvas")
  smallCanvas.width  = sw
  smallCanvas.height = sh
  smallCanvas.getContext("2d")!.drawImage(bmp, 0, 0, sw, sh)
  const smallBmp  = await createImageBitmap(smallCanvas)
  const smallBlob = await compressBitmap(smallBmp, sw, sh, mime)

  return { blob: smallBlob, mime, ext }
}

// ── Types ─────────────────────────────────────────────────────────────────────

type Phase = "idle" | "processing" | "uploading" | "done" | "error"
type Stats = { original: number; output: number }

// ── Component ─────────────────────────────────────────────────────────────────

export function ImageUpload({
  name,
  initialUrl,
  businessSlug,
}: {
  name:         string
  initialUrl?:  string | null
  businessSlug: string
}) {
  const [imageUrl, setImageUrl] = useState<string | null>(initialUrl ?? null)
  const [preview,  setPreview]  = useState<string | null>(null)
  const [phase,    setPhase]    = useState<Phase>("idle")
  const [stats,    setStats]    = useState<Stats | null>(null)
  const [error,    setError]    = useState<string | null>(null)
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

    try {
      const { blob, mime, ext } = await compress(file)
      setStats({ original: file.size, output: blob.size })

      setPhase("uploading")
      const path     = `${businessSlug}/${Date.now()}-cover.${ext}`
      const supabase = createClient()

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, blob, { contentType: mime, upsert: true })

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
      setImageUrl(data.publicUrl)
      setPhase("done")
    } catch {
      setError("Caricamento fallito. Controlla le impostazioni del bucket e riprova.")
      setPhase("error")
    } finally {
      URL.revokeObjectURL(localPreview)
      setPreview(null)
    }
  }

  const handleRemove = () => {
    setImageUrl(null)
    setPreview(null)
    setPhase("idle")
    setStats(null)
    setError(null)
    if (fileRef.current) fileRef.current.value = ""
  }

  const phaseLabel  = phase === "processing" ? "Compressione..." : "Caricamento..."
  const displayUrl  = preview ?? imageUrl
  const saving      = stats ? Math.round((1 - stats.output / stats.original) * 100) : 0

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
          <img src={displayUrl} alt="Anteprima copertina" className={styles.preview} />

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
            {isBusy ? phaseLabel : "Aggiungi immagine di copertina"}
          </span>
          <span className={styles.dropzoneHint}>
            Qualsiasi formato · qualsiasi dimensione · compressa automaticamente
          </span>
        </button>
      )}

      {stats && !isBusy && (
        <p className={styles.stats}>
          {fmtBytes(stats.original)} → {fmtBytes(stats.output)}
          {" "}<span className={styles.statsSaving}>−{saving}%</span>
        </p>
      )}

      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
}
