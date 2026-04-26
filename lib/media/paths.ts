// lib/media/paths.ts
// Pure path utilities for Supabase Storage.
// No imports — safe for both "use client" and "use server" contexts.

// ── Extract storage path from a public URL ────────────────────────────────────
// Supabase public URL format:
//   https://{ref}.supabase.co/storage/v1/object/public/{bucket}/{path}
//
// Returns the relative path within the bucket, or null if the URL is not a
// recognizable Supabase storage URL (e.g. a manually-entered external URL).
// The null case is handled gracefully — cleanup is simply skipped.

export function extractStoragePath(publicUrl: string, bucket: string): string | null {
  try {
    const marker = `/object/public/${bucket}/`
    const idx    = publicUrl.indexOf(marker)
    if (idx === -1) return null
    const raw = publicUrl.slice(idx + marker.length)
    // Remove any query parameters (e.g. Supabase transform API params)
    const withoutQuery = raw.split("?")[0]
    return decodeURIComponent(withoutQuery)
  } catch {
    return null
  }
}

// ── Generate a collision-safe storage path ────────────────────────────────────
// Pattern: {prefix}/{timestamp}-{6-char random suffix}.{ext}
// Example: "pero/event-cover/1745659200000-a3f7k2.avif"
//
// Timestamp (ms) + 6 base-36 chars gives ~2.18 billion combinations per
// millisecond — collision probability is negligible in practice.
// upsert: false on upload will catch the rare collision anyway.

export function generateStoragePath(prefix: string, ext: string): string {
  const ts     = Date.now()
  const suffix = Math.random().toString(36).slice(2, 8)
  return `${prefix}/${ts}-${suffix}.${ext}`
}
