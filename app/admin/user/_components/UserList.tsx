"use client"

// app/admin/utenti/_components/UserList.tsx
// Filterable list of admin users.

import { useState }             from "react"
import { UserRow }              from "./UserRow"
import type { User, Business }  from "../_types"
import styles                   from "./UserList.module.css"

export function UserList({
  users,
  allBusinesses,
  currentUserId,
}: {
  users:          User[]
  allBusinesses:  Business[]
  currentUserId:  string
}) {
  const [query, setQuery] = useState("")

  const filtered = query.trim().length < 2
    ? users
    : users.filter(u =>
        u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.email.toLowerCase().includes(query.toLowerCase())
      )

  return (
    <div className={`flex flex-col ${styles.section}`}>

      {/* ── Filter bar ── */}
      <div className={`flex items-center ${styles.filterWrap}`}>
        <span className={`shrink-0 leading-none ${styles.searchIcon}`}>⌕</span>
        <input
          type="text"
          placeholder="Filtra per nome o email..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className={`flex-1 border-none bg-transparent outline-none ${styles.filterInput}`}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className={`bg-transparent border-none cursor-pointer shrink-0 leading-none ${styles.clearBtn}`}
          >
            ✕
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className={`text-center ${styles.empty}`}>Nessun utente trovato.</div>
      ) : (
        <div className={`flex flex-col ${styles.list}`}>
          {filtered.map(user => (
            <UserRow
              key={user.id}
              user={user}
              allBusinesses={allBusinesses}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  )
}
