// lib/media/optimize.ts
// Client-side image optimization pipeline.
//
// Strategy:
//   1. Detect browser support for modern formats (AVIF → WebP → JPEG).
//   2. Resize to fit profile dimensions without upscaling.
//   3. Binary-search the highest quality that stays within the size budget.
//   4. If budget not reached at full dimensions, progressively shrink and retry.
//
// createImageBitmap() decodes the file AND corrects EXIF orientation —
// all metadata (GPS, camera info, ICC profile) is stripped when drawing
// the bitmap onto a Canvas.
//
// This file contains no imports that require a browser global at module-load
// time — all browser API usage is inside function bodies that are only called
// from client-side event handlers.

import type { MediaProfile, OptimizeResult } from "./types"
import { MEDIA_PROFILES }                    from "./types"

// ── Format specification ──────────────────────────────────────────────────────
// Tried in priority order: AVIF (best efficiency) → WebP → JPEG (universal).
// Quality ranges are codec-specific — AVIF needs a lower range than WebP
// to produce the same perceived visual quality at smaller file size.

type FormatSpec = {
  mime:   string
  ext:    string
  qStart: number   // highest quality we'll request (budget-permitting)
  qMin:   number   // absolute floor — never go lower
}

const FORMAT_CANDIDATES: FormatSpec[] = [
  { mime: "image/avif", ext: "avif", qStart: 0.76, qMin: 0.50 },
  { mime: "image/webp", ext: "webp", qStart: 0.88, qMin: 0.62 },
  { mime: "image/jpeg", ext: "jpg",  qStart: 0.88, qMin: 0.65 },
]

// ── Format support detection ──────────────────────────────────────────────────
// Encode a 4×4 canvas and check the resulting blob type.
// Cached in a Map so detection runs at most once per format per page load.
// Uses actual encoding test (not UA sniffing) — only marks a format supported
// if the browser can genuinely produce a blob of the expected MIME type.

const _supportCache = new Map<string, boolean>()

async function formatSupported(mime: string): Promise<boolean> {
  if (_supportCache.has(mime)) return _supportCache.get(mime)!
  try {
    const canvas  = document.createElement("canvas")
    canvas.width  = 4
    canvas.height = 4
    const blob = await new Promise<Blob | null>(res =>
      canvas.toBlob(res, mime, 0.8)
    )
    const ok = blob !== null && blob.size > 0 && blob.type === mime
    _supportCache.set(mime, ok)
    return ok
  } catch {
    _supportCache.set(mime, false)
    return false
  }
}

async function getSupportedFormats(): Promise<FormatSpec[]> {
  const supported: FormatSpec[] = []
  for (const spec of FORMAT_CANDIDATES) {
    if (await formatSupported(spec.mime)) supported.push(spec)
  }
  // JPEG is always available as absolute fallback — should never be missing
  if (!supported.some(s => s.mime === "image/jpeg")) {
    supported.push(FORMAT_CANDIDATES[2])
  }
  return supported
}

// ── Canvas rendering helper ───────────────────────────────────────────────────

function renderToBlob(
  bmp:     ImageBitmap,
  w:       number,
  h:       number,
  mime:    string,
  quality: number,
): Promise<Blob> {
  const canvas  = document.createElement("canvas")
  canvas.width  = w
  canvas.height = h
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, w, h)
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      b => b ? resolve(b) : reject(new Error("canvas.toBlob returned null")),
      mime,
      quality,
    )
  )
}

// ── Binary search on quality ──────────────────────────────────────────────────
// Finds the highest quality ≤ qStart that produces a blob ≤ targetBytes.
// 6 iterations → precision < 0.016 quality units (more than sufficient).
//
// Fast path: checks qStart first — if it already fits, skip the search.
// This keeps overhead low for small or simple images.

async function bestQuality(
  bmp:         ImageBitmap,
  w:           number,
  h:           number,
  mime:        string,
  targetBytes: number,
  qMin:        number,
  qStart:      number,
): Promise<{ blob: Blob; quality: number } | null> {
  // Fast path — most common case (image is already under budget at max quality)
  const startBlob = await renderToBlob(bmp, w, h, mime, qStart)
  if (startBlob.size <= targetBytes) {
    return { blob: startBlob, quality: qStart }
  }

  // Binary search between qMin and qStart
  let lo   = qMin
  let hi   = qStart
  let best: Blob    | null = null
  let bestQ         = qMin

  for (let i = 0; i < 6; i++) {
    const mid  = (lo + hi) / 2
    const blob = await renderToBlob(bmp, w, h, mime, mid)
    if (blob.size <= targetBytes) {
      best  = blob
      bestQ = mid
      lo    = mid   // fits — try higher quality
    } else {
      hi = mid      // too large — reduce quality
    }
  }

  if (best) return { blob: best, quality: bestQ }

  // Even qMin doesn't fit at these dimensions — signal caller to try smaller dimensions
  return null
}

// ── Progressive dimension scales for fallback ─────────────────────────────────
// If the quality search cannot reach target at 100% dimensions,
// the pipeline shrinks and retries. Scales are applied to the already-fitted
// base dimensions (never the original image dimensions).

const DIM_SCALES = [1.0, 0.80, 0.65, 0.50] as const

// ── Main export ───────────────────────────────────────────────────────────────

export async function optimize(
  file:    File,
  profile: MediaProfile = "cover",
): Promise<OptimizeResult> {
  const { maxW, maxH, targetBytes } = MEDIA_PROFILES[profile]
  const formats                      = await getSupportedFormats()

  // Decode + EXIF-correct. createImageBitmap also strips metadata on all
  // modern browsers when the source file contains orientation or color tags.
  const bmp = await createImageBitmap(file)

  // Fit to profile dimensions without upscaling
  const ratio = Math.min(maxW / bmp.width, maxH / bmp.height, 1)
  const baseW = Math.round(bmp.width  * ratio)
  const baseH = Math.round(bmp.height * ratio)

  // Iterate formats in priority order (AVIF → WebP → JPEG)
  for (const fmt of formats) {
    // Progressively shrink dimensions until we hit the budget
    for (const scale of DIM_SCALES) {
      const w = Math.round(baseW * scale)
      const h = Math.round(baseH * scale)

      const result = await bestQuality(
        bmp, w, h, fmt.mime, targetBytes, fmt.qMin, fmt.qStart,
      )

      if (result) {
        return {
          blob:         result.blob,
          mime:         fmt.mime,
          ext:          fmt.ext,
          quality:      result.quality,
          width:        w,
          height:       h,
          originalSize: file.size,
          outputSize:   result.blob.size,
        }
      }
    }
  }

  // Absolute last resort — should be unreachable under normal conditions
  // (a 50% JPEG at qMin is extremely small).
  const fmt  = formats[formats.length - 1]
  const w    = Math.round(baseW * 0.5)
  const h    = Math.round(baseH * 0.5)
  const blob = await renderToBlob(bmp, w, h, fmt.mime, fmt.qMin)

  return {
    blob,
    mime:         fmt.mime,
    ext:          fmt.ext,
    quality:      fmt.qMin,
    width:        w,
    height:       h,
    originalSize: file.size,
    outputSize:   blob.size,
  }
}
