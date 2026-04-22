"use client"

// app/admin/apply/_components/ApplyClient.tsx
// Client Component — search input + bar results + apply interactions.
// Receives no props: all bar status (isAdmin, hasApplied) comes from the
// searchBars Server Action on every query, so data is never stale.

import { useState, useEffect, useRef, useCallback } from "react"
import { searchBars, applyToBar, type BarResult }   from "../actions"
import styles                                        from "../page.module.css"
import clsx                                          from "clsx"

// ── Component ─────────────────────────────────────────────────────────────────

export function ApplyClient() {
  const [query,     setQuery]     = useState("")
  const [results,   setResults]   = useState<BarResult[]>([])
  const [searching, setSearching] = useState(false)
  const [applying,  setApplying]  = useState<string | null>(null)
  const [errors,    setErrors]    = useState<Record<string, string>>({})

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Debounced search ──────────────────────────────────────────────────────
  // Fires 350ms after the user stops typing to avoid excessive server calls.

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    const trimmed = query.trim()

    if (trimmed.length < 2) {
      setResults([])
      setSearching(false)
      return
    }

    setSearching(true)

    debounceRef.current = setTimeout(async () => {
      const data = await searchBars(trimmed)
      setResults(data)
      setSearching(false)
    }, 350)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  // ── Apply handler ─────────────────────────────────────────────────────────
  // On success: mutates local result state for immediate feedback without
  // re-running the search. The server-side revalidatePath ensures a hard
  // refresh would also show the correct state.

  const handleApply = useCallback(async (barId: string) => {
    setApplying(barId)
    setErrors(prev => { const next = { ...prev }; delete next[barId]; return next })

    try {
      await applyToBar(barId)

      // Optimistic update — mark bar as applied in local state immediately
      setResults(prev =>
        prev.map(bar =>
          bar.id === barId
            ? { ...bar, hasApplied: true, applicationStatus: "PENDING" }
            : bar
        )
      )
    } catch (e) {
      const message = e instanceof Error
        ? e.message
        : "Errore durante l'invio della richiesta"

      setErrors(prev => ({ ...prev, [barId]: message }))
    } finally {
      setApplying(null)
    }
  }, [])

  // ── Render ────────────────────────────────────────────────────────────────

  const hasResults = results.length > 0
  const showEmpty  = query.trim().length >= 2 && !searching && !hasResults

  return (
    <section className={`flex flex-col ${styles.section}`}>
      <h2 className={`m-0 uppercase ${styles.sectionTitle}`}>Cerca un locale</h2>

      {/* ── Search input ── */}
      <div className={styles.searchWrap}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Cerca per nome o indirizzo…"
          className={styles.searchInput}
          autoComplete="off"
          spellCheck={false}
        />
        {searching && <span className={styles.searchSpinner}>Ricerca…</span>}
      </div>

      {/* ── Results list ── */}
      {hasResults && (
        <ul className={styles.resultsList}>
          {results.map(bar => (
            <BarResultItem
              key={bar.id}
              bar={bar}
              isApplying={applying === bar.id}
              error={errors[bar.id]}
              onApply={handleApply}
            />
          ))}
        </ul>
      )}

      {/* ── Empty state ── */}
      {showEmpty && (
        <p className={styles.emptyMsg}>
          Nessun locale trovato per &ldquo;{query}&rdquo;.
        </p>
      )}
    </section>
  )
}

// ── Bar result item ───────────────────────────────────────────────────────────
// Extracted to prevent the whole list re-rendering when one item's state changes.

type BarResultItemProps = {
  bar:        BarResult
  isApplying: boolean
  error:      string | undefined
  onApply:    (barId: string) => void
}

function BarResultItem({ bar, isApplying, error, onApply }: BarResultItemProps) {
  const disabled = bar.isAdmin || bar.hasApplied || isApplying

  return (
    <li className={`flex items-center justify-between ${styles.resultItem}`}>

      {/* ── Bar info ── */}
      <div className={`flex flex-col ${styles.barInfo}`}>
        <span className={styles.barName}>{bar.name}</span>
        <span className={styles.barAddress}>{bar.address}</span>
        {error && (
          <span className={styles.errorMsg}>{error}</span>
        )}
        {bar.hasApplied && bar.applicationStatus && !error && (
          <span className={styles.successMsg}>
            {bar.applicationStatus === "PENDING"  && "Richiesta in attesa di revisione"}
            {bar.applicationStatus === "APPROVED" && "Richiesta approvata"}
            {bar.applicationStatus === "REJECTED" && "Richiesta rifiutata"}
          </span>
        )}
      </div>

      {/* ── Action button — three distinct states ── */}
      <button
        onClick={() => onApply(bar.id)}
        disabled={disabled}
        className={clsx(styles.applyBtn, {
          [styles.applyBtnAdmin]:   bar.isAdmin,
          [styles.applyBtnApplied]: !bar.isAdmin && bar.hasApplied,
        })}
        title={
          bar.isAdmin    ? "Hai già accesso a questo locale" :
          bar.hasApplied ? "Richiesta già inviata"           :
          undefined
        }
      >
        {isApplying
          ? "Invio…"
          : bar.isAdmin
            ? "Già amministratore"
            : bar.hasApplied
              ? "Richiesta inviata"
              : "Richiedi accesso"}
      </button>

    </li>
  )
}
