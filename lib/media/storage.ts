// lib/media/storage.ts
// Client-side Supabase Storage wrappers for the media pipeline.
// Must only be called from browser context (uses createBrowserClient).

import { createClient } from "@/lib/supabase/client"

// ── Upload ────────────────────────────────────────────────────────────────────
// Uploads a blob to the given bucket path and returns the public URL.
// upsert: false — collision is caught as an error rather than silently
// overwriting an unrelated file. generateStoragePath() makes collisions
// negligible in practice (timestamp + 6-char random suffix).

export async function uploadToStorage(
  blob:   Blob,
  bucket: string,
  path:   string,
  mime:   string,
): Promise<{ publicUrl: string; storagePath: string }> {
  const supabase = createClient()
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, blob, { contentType: mime, upsert: false })

  if (error) throw error

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return { publicUrl: data.publicUrl, storagePath: path }
}

// ── Delete ────────────────────────────────────────────────────────────────────
// Fire-and-forget: orphan cleanup should never block the user's action.
// Errors are logged for observability but not re-thrown.

export async function deleteFromStorage(
  bucket: string,
  path:   string,
): Promise<void> {
  try {
    const supabase = createClient()
    const { error } = await supabase.storage.from(bucket).remove([path])
    if (error) {
      console.error("[deleteFromStorage] cleanup failed:", bucket, path, error)
    }
  } catch (err) {
    console.error("[deleteFromStorage] unexpected error:", bucket, path, err)
  }
}
