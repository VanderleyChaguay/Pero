"use client"

// app/admin/utenti/_components/UserList.tsx
// Filterable list of admin users.

import { useState }            from "react"
import { UserRow }             from "./UserRow"
import type { User, Bar }      from "../_types"
import styles                  from "./UserList.module.css"

export function UserList({
  users,
  allBars,
  currentUserId,
}: {
  users:         User[]
  allBars:       Bar[]
  currentUserId: string
}) {
  const [query, setQuery] = useState("")

  const filtered = query.trim().length < 2
    ? users
    : users.filter(u =>
        u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.email.toLowerCase().includes(query.toLowerCase())
      )

  return (
    <div className={styles.section}>

      {/* ── Filter bar ── */}
      <div className={styles.filterWrap}>
        <span className={styles.searchIcon}>⌕</span>
        <input
          type="text"
          placeholder="Filtra per nome o email..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className={styles.filterInput}
        />
        {query && (
          <button onClick={() => setQuery("")} className={styles.clearBtn}>✕</button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>Nessun utente trovato.</div>
      ) : (
        <div className={styles.list}>
          {filtered.map(user => (
            <UserRow
              key={user.id}
              user={user}
              allBars={allBars}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  )
}
