"use client"

// EventImageViewer — clickable image trigger + fullscreen modal viewer.
//
// Used by EventCard (Server Component) to make cover images expandable.
// Entire modal interaction is client-side: no route change, no data fetch.
//
// Accessibility:
//   - Trigger is a <button> with aria-label.
//   - Modal has role="dialog" + aria-modal + aria-label.
//   - Focus moves to the close button when opened.
//   - ESC key closes the modal.
//   - Body scroll is locked while modal is open.

import { useState, useEffect, useRef, useCallback } from "react"
import { createPortal }                              from "react-dom"
import styles                                        from "./EventImageViewer.module.css"

export function EventImageViewer({
  src,
  alt,
  imgClassName,
}: {
  src:          string
  alt:          string
  imgClassName?: string   // forwarded to the thumbnail <img> (e.g. styles.cardCoverImg)
}) {
  const [open,     setOpen]    = useState(false)
  const closeBtnRef            = useRef<HTMLButtonElement>(null)

  const close = useCallback(() => setOpen(false), [])

  // ESC to close
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, close])

  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
      // Move focus to close button for keyboard users
      closeBtnRef.current?.focus()
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [open])

  return (
    <>
      {/* Thumbnail trigger — fills the parent .cardCover container */}
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen(true)}
        aria-label={`Visualizza immagine ingrandita: ${alt}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className={imgClassName}
          loading="lazy"
        />
      </button>

      {/* Fullscreen modal — rendered into document.body via portal */}
      {open && createPortal(
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={close}
        >
          <button
            ref={closeBtnRef}
            type="button"
            className={styles.closeBtn}
            onClick={close}
            aria-label="Chiudi visualizzatore immagine"
          >
            ×
          </button>

          {/* stopPropagation prevents a click on the image from bubbling to the
              overlay and triggering the close handler */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className={styles.fullImg}
            onClick={e => e.stopPropagation()}
          />
        </div>,
        document.body,
      )}
    </>
  )
}
