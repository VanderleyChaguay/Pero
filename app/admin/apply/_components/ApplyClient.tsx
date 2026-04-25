"use client"

// app/admin/apply/_components/ApplyClient.tsx
// Client Component — search input + business results + apply interactions.
// Receives no props: all business status (isAdmin, hasApplied) comes from the
// searchBusinesses Server Action on every query, so data is never stale.

import { useState, useEffect, useRef, useCallback }             from "react"
import { searchBusinesses, applyToBusiness, type BusinessResult } from "../actions"
import styles                                                    from "../page.module.css"
import clsx                                                      from "clsx"

// ── Component ─────────────────────────────────────────────────────────────────

export function ApplyClient() {
  const [query,     setQuery]     = useState("")
  const [results,   setResults]   = useState<BusinessResult[]>([])
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
      const data = await searchBusinesses(trimmed)
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

  const handleApply = useCallback(async (businessId: string) => {
    setApplying(businessId)
    setErrors(prev => { const next = { ...prev }; delete next[businessId]; return next })

    try {
      await applyToBusiness(businessId)

      // Optimistic update — mark business as applied in local state immediately
      setResults(prev =>
        prev.map(business =>
          business.id === businessId
            ? { ...business, hasApplied: true, applicationStatus: "PENDING" }
            : business
        )
      )
    } catch (e) {
      const message = e instanceof Error
        ? e.message
        : "Errore durante l'invio della richiesta"

      setErrors(prev => ({ ...prev, [businessId]: message }))
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
          {results.map(business => (
            <BusinessResultItem
              key={business.id}
              business={business}
              isApplying={applying === business.id}
              error={errors[business.id]}
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

// ── Business result item ──────────────────────────────────────────────────────
// Extracted to prevent the whole list re-rendering when one item's state changes.

type BusinessResultItemProps = {
  business:   BusinessResult
  isApplying: boolean
  error:      string | undefined
  onApply:    (businessId: string) => void
}

function BusinessResultItem({ business, isApplying, error, onApply }: BusinessResultItemProps) {
  const disabled = business.isAdmin || business.hasApplied || isApplying

  return (
    <li className={`flex items-center justify-between ${styles.resultItem}`}>

      {/* ── Business info ── */}
      <div className={`flex flex-col ${styles.barInfo}`}>
        <span className={styles.barName}>{business.name}</span>
        <span className={styles.barAddress}>{business.address}</span>
        {error && (
          <span className={styles.errorMsg}>{error}</span>
        )}
        {business.hasApplied && business.applicationStatus && !error && (
          <span className={styles.successMsg}>
            {business.applicationStatus === "PENDING"  && "Richiesta in attesa di revisione"}
            {business.applicationStatus === "APPROVED" && "Richiesta approvata"}
            {business.applicationStatus === "REJECTED" && "Richiesta rifiutata"}
          </span>
        )}
      </div>

      {/* ── Action button — three distinct states ── */}
      <button
        onClick={() => onApply(business.id)}
        disabled={disabled}
        className={clsx(styles.applyBtn, {
          [styles.applyBtnAdmin]:   business.isAdmin,
          [styles.applyBtnApplied]: !business.isAdmin && business.hasApplied,
        })}
        title={
          business.isAdmin    ? "Hai già accesso a questo locale" :
          business.hasApplied ? "Richiesta già inviata"           :
          undefined
        }
      >
        {isApplying
          ? "Invio…"
          : business.isAdmin
            ? "Già amministratore"
            : business.hasApplied
              ? "Richiesta inviata"
              : "Richiedi accesso"}
      </button>

    </li>
  )
}
