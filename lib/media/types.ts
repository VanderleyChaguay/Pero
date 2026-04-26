// lib/media/types.ts
// Shared types for the media optimization and upload pipeline.
// Imported by both client-side components and server-side utilities.

// ── Compression profiles ──────────────────────────────────────────────────────
// Each profile targets a use case with appropriate dimensions and size budget.

export type MediaProfile = "cover" | "thumbnail" | "logo"

export const MEDIA_PROFILES: Record<
  MediaProfile,
  { maxW: number; maxH: number; targetBytes: number }
> = {
  cover:     { maxW: 1600, maxH: 1200, targetBytes: 260 * 1024 },  // 260 KB
  thumbnail: { maxW:  640, maxH:  480, targetBytes:  80 * 1024 },  //  80 KB
  logo:      { maxW:  400, maxH:  400, targetBytes:  50 * 1024 },  //  50 KB
}

// ── Optimization result ───────────────────────────────────────────────────────
// Returned by optimize() after the compression pipeline completes.

export type OptimizeResult = {
  blob:         Blob
  mime:         string    // e.g. "image/avif"
  ext:          string    // e.g. "avif"
  quality:      number    // final quality value used (0–1)
  width:        number    // output pixel width
  height:       number    // output pixel height
  originalSize: number    // input File size in bytes
  outputSize:   number    // output Blob size in bytes
}
