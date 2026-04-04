"use client"

// app/admin/utenti/_components/UserRow.tsx
// Single user row with bar access management and role toggle.
// Each row has its own useTransition — so only this row shows pending state.

import { useTransition }                              from "react"
import { grantBarAccess, revokeBarAccess,
         toggleSuperAdmin }                           from "../actions"
import type { User, Bar }                             from "../_types"
import styles                                         from "./UserRow.module.css"

export function UserRow({
  user,
  allBars,
  currentUserId,
}: {
  user:          User
  allBars:       Bar[]
  currentUserId: string
}) {
  const [pending, startTransition] = useTransition()

  const isSelf            = user.id === currentUserId
  const accessibleBarIds  = user.barAccess.map(a => a.bar.id)
  const barsWithoutAccess = allBars.filter(b => !accessibleBarIds.includes(b.id))

  const handleToggleSuperAdmin = () => {
    if (!confirm(
      user.isSuperAdmin
        ? `Rimuovere i permessi Super Admin a ${user.name}?`
        : `Promuovere ${user.name} a Super Admin?`
    )) return
    startTransition(() => toggleSuperAdmin(user.id, user.isSuperAdmin))
  }

  const handleRevoke = (barId: string, barName: string) => {
    if (!confirm(`Revocare l'accesso di ${user.name} a "${barName}"?`)) return
    startTransition(() => revokeBarAccess(user.id, barId))
  }

  const handleGrant = (barId: string) => {
    startTransition(() => grantBarAccess(user.id, barId))
  }

  return (
    <div className={styles.row} style={{ opacity: pending ? 0.5 : 1 }}>

      {/* User info */}
      <div className={styles.info}>
        <div className={styles.nameRow}>
          <span className={styles.name}>{user.name}</span>
          {user.isSuperAdmin && <span className={styles.superBadge}>Super Admin</span>}
          {isSelf && <span className={styles.selfBadge}>Tu</span>}
        </div>
        <span className={styles.email}>{user.email}</span>
      </div>

      {/* Bar access */}
      <div className={styles.accessSection}>
        <p className={styles.accessLabel}>Accesso ai locali</p>
        <div className={styles.accessTags}>
          {user.barAccess.length === 0 ? (
            <span className={styles.noAccess}>Nessun accesso</span>
          ) : (
            user.barAccess.map(({ bar }) => (
              <div key={bar.id} className={styles.accessTag}>
                <span>{bar.name}</span>
                {!isSelf && (
                  <button
                    onClick={() => handleRevoke(bar.id, bar.name)}
                    disabled={pending}
                    className={styles.revokeBtn}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {!isSelf && barsWithoutAccess.length > 0 && (
          <div className={styles.addAccess}>
            {barsWithoutAccess.map(bar => (
              <button
                key={bar.id}
                onClick={() => handleGrant(bar.id)}
                disabled={pending}
                className={styles.addAccessBtn}
              >
                + {bar.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* SuperAdmin toggle */}
      {!isSelf && (
        <div className={styles.actions}>
          <button
            onClick={handleToggleSuperAdmin}
            disabled={pending}
            className={user.isSuperAdmin ? styles.btnDemote : styles.btnPromote}
          >
            {user.isSuperAdmin ? "Rimuovi Super Admin" : "Promuovi"}
          </button>
        </div>
      )}
    </div>
  )
}
