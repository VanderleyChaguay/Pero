"use client"

// app/admin/utenti/_components/GrantAccessForm.tsx
// Search bar with live results dropdown to grant bar access to users.

import { useState, useTransition, useEffect, useRef } from "react"
import { searchUsers, grantBarAccess }                from "../actions"
import type { Bar, SearchResult }                     from "../_types"
import styles                                         from "./GrantAccessForm.module.css"

export function GrantAccessForm({ bars }: { bars: Bar[] }) {
  const [query,      setQuery]        = useState("")
  const [results,    setResults]      = useState<SearchResult[]>([])
  const [selected,   setSelected]     = useState<SearchResult | null>(null)
  const [barId,      setBarId]        = useState("")
  const [showDrop,   setShowDrop]     = useState(false)
  const [searching,  setSearching]    = useState(false)
  const [pending,    startTransition] = useTransition()
  const [feedback,   setFeedback]     = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)

  const wrapperRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDrop(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  // Debounced search — fires 300ms after the user stops typing
  useEffect(() => {
    if (selected) return
    if (query.trim().length < 2) {
      setResults([])
      setShowDrop(false)
      return
    }

    const timer = setTimeout(async () => {
      setSearching(true)
      const found = await searchUsers(query)
      setResults(found)
      setShowDrop(true)
      setSearching(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, selected])

  const handleSelect = (user: SearchResult) => {
    setSelected(user)
    setQuery(user.name)
    setShowDrop(false)
    setResults([])
  }

  const handleClear = () => {
    setSelected(null)
    setQuery("")
    setBarId("")
    setFeedback(null)
  }

  const handleGrant = () => {
    if (!selected || !barId) return
    setFeedback(null)

    startTransition(async () => {
      try {
        await grantBarAccess(selected.id, barId)
        setFeedback({
          type:    "success",
          message: `Accesso a "${bars.find(b => b.id === barId)?.name}" concesso a ${selected.name}`,
        })
        handleClear()
      } catch (err) {
        setFeedback({
          type:    "error",
          message: err instanceof Error ? err.message : "Errore sconosciuto",
        })
      }
    })
  }

  // Bars this selected user already has access to
  const alreadyHasAccess = selected
    ? selected.barAccess.map(a => a.bar.id)
    : []
  const availableBars = bars.filter(b => !alreadyHasAccess.includes(b.id))

  return (
    <div className={`flex flex-col ${styles.form}`}>
      <div className={`flex items-start flex-wrap ${styles.searchRow}`}>

        {/* ── Search input with dropdown ── */}
        <div className={`relative flex-1 ${styles.searchWrap}`} ref={wrapperRef}>
          <div className={`flex items-center ${styles.searchInputWrap}`}>
            <span className={`shrink-0 leading-none ${styles.searchIcon}`}>
              {searching ? "⟳" : "⌕"}
            </span>
            <input
              type="text"
              placeholder="Cerca per nome o email..."
              value={query}
              onChange={e => {
                setQuery(e.target.value)
                if (selected) setSelected(null)
              }}
              onFocus={() => results.length > 0 && setShowDrop(true)}
              className={`flex-1 border-none bg-transparent outline-none ${styles.searchInput}`}
            />
            {(query || selected) && (
              <button
                type="button"
                onClick={handleClear}
                className={`bg-transparent border-none cursor-pointer shrink-0 leading-none ${styles.clearBtn}`}
              >
                ✕
              </button>
            )}
          </div>

          {/* Dropdown results */}
          {showDrop && results.length > 0 && (
            <div className={`absolute left-0 right-0 z-50 overflow-hidden ${styles.dropdown}`}>
              {results.map(user => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleSelect(user)}
                  className={`flex flex-col w-full bg-transparent border-none text-left cursor-pointer ${styles.dropdownItem}`}
                >
                  <div className={`flex items-center ${styles.dropdownItemName}`}>
                    {user.name}
                    {user.isSuperAdmin && (
                      <span className={`uppercase ${styles.dropSuperBadge}`}>Super Admin</span>
                    )}
                  </div>
                  <div className={styles.dropdownItemEmail}>{user.email}</div>
                  {user.barAccess.length > 0 && (
                    <div className={styles.dropdownItemBars}>
                      {user.barAccess.map(a => a.bar.name).join(", ")}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* No results */}
          {showDrop && !searching && results.length === 0 && query.length >= 2 && (
            <div className={`absolute left-0 right-0 z-50 overflow-hidden ${styles.dropdown}`}>
              <div className={`text-center ${styles.dropdownEmpty}`}>
                Nessun utente trovato per &ldquo;{query}&rdquo;
              </div>
            </div>
          )}
        </div>

        {/* ── Bar selector — only shown after selecting a user ── */}
        {selected && (
          <select
            value={barId}
            onChange={e => setBarId(e.target.value)}
            className={`outline-none cursor-pointer ${styles.select}`}
          >
            <option value="">Seleziona locale</option>
            {availableBars.length === 0 ? (
              <option disabled>Ha già accesso a tutti i locali</option>
            ) : (
              availableBars.map(bar => (
                <option key={bar.id} value={bar.id}>{bar.name}</option>
              ))
            )}
          </select>
        )}

        {/* ── Grant button ── */}
        {selected && barId && (
          <button
            type="button"
            onClick={handleGrant}
            disabled={pending}
            className={`border-none cursor-pointer whitespace-nowrap text-white disabled:opacity-50 disabled:cursor-not-allowed ${styles.btnGrant}`}
          >
            {pending ? "..." : "Concedi accesso"}
          </button>
        )}
      </div>

      {/* Selected user preview */}
      {selected && (
        <div className={`flex items-center flex-wrap ${styles.selectedUser}`}>
          <span className={`uppercase ${styles.selectedLabel}`}>Utente selezionato:</span>
          <span className={styles.selectedName}>{selected.name}</span>
          <span className={styles.selectedEmail}>{selected.email}</span>
        </div>
      )}

      {/* Feedback */}
      {feedback && (
        <p className={`m-0 ${feedback.type === "success" ? styles.msgSuccess : styles.msgError}`}>
          {feedback.message}
        </p>
      )}
    </div>
  )
}
