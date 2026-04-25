"use client"

// app/admin/utenti/_components/UserRow.tsx
// Single user row with business access management and role toggle.
// Each row has its own useTransition — so only this row shows pending state.

import { useTransition }                               from "react"
import { grantBusinessAccess, revokeBusinessAccess,
         toggleSuperAdmin }                            from "../actions"
import type { User, Business }                         from "../_types"
import styles                                          from "./UserRow.module.css"

export function UserRow({
  user,
  allBusinesses,
  currentUserId,
}: {
  user:          User
  allBusinesses: Business[]
  currentUserId: string
}) {
  const [pending, startTransition] = useTransition()

  const isSelf                  = user.id === currentUserId
  const accessibleBusinessIds   = user.businessAccess.map(a => a.business.id)
  const businessesWithoutAccess = allBusinesses.filter(b => !accessibleBusinessIds.includes(b.id))

  const handleToggleSuperAdmin = () => {
    if (!confirm(
      user.isSuperAdmin
        ? `Rimuovere i permessi Super Admin a ${user.name}?`
        : `Promuovere ${user.name} a Super Admin?`
    )) return
    startTransition(() => toggleSuperAdmin(user.id, user.isSuperAdmin))
  }

  const handleRevoke = (businessId: string, businessName: string) => {
    if (!confirm(`Revocare l'accesso di ${user.name} a "${businessName}"?`)) return
    startTransition(() => revokeBusinessAccess(user.id, businessId))
  }

  const handleGrant = (businessId: string) => {
    startTransition(() => grantBusinessAccess(user.id, businessId))
  }

  return (
    <div
      className={`flex items-start flex-wrap ${styles.row}`}
      style={{ opacity: pending ? 0.5 : 1 }}
    >

      {/* User info */}
      <div className={`flex flex-col shrink-0 ${styles.info}`}>
        <div className={`flex items-center flex-wrap ${styles.nameRow}`}>
          <span className={styles.name}>{user.name}</span>
          {user.isSuperAdmin && (
            <span className={`uppercase ${styles.superBadge}`}>Super Admin</span>
          )}
          {isSelf && <span className={styles.selfBadge}>Tu</span>}
        </div>
        <span className={styles.email}>{user.email}</span>
      </div>

      {/* Business access */}
      <div className={`flex-1 flex flex-col min-w-0 ${styles.accessSection}`}>
        <p className={`m-0 uppercase ${styles.accessLabel}`}>Accesso ai locali</p>
        <div className={`flex flex-wrap ${styles.accessTags}`}>
          {user.businessAccess.length === 0 ? (
            <span className={styles.noAccess}>Nessun accesso</span>
          ) : (
            user.businessAccess.map(({ business }) => (
              <div key={business.id} className={`flex items-center ${styles.accessTag}`}>
                <span>{business.name}</span>
                {!isSelf && (
                  <button
                    onClick={() => handleRevoke(business.id, business.name)}
                    disabled={pending}
                    className={`flex items-center justify-center bg-transparent border-none cursor-pointer p-0 rounded-full disabled:opacity-50 disabled:cursor-not-allowed ${styles.revokeBtn}`}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {!isSelf && businessesWithoutAccess.length > 0 && (
          <div className={`flex flex-wrap ${styles.addAccess}`}>
            {businessesWithoutAccess.map(business => (
              <button
                key={business.id}
                onClick={() => handleGrant(business.id)}
                disabled={pending}
                className={`bg-transparent cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${styles.addAccessBtn}`}
              >
                + {business.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* SuperAdmin toggle */}
      {!isSelf && (
        <div className="flex items-start shrink-0">
          <button
            onClick={handleToggleSuperAdmin}
            disabled={pending}
            className={`cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed ${user.isSuperAdmin ? styles.btnDemote : styles.btnPromote}`}
          >
            {user.isSuperAdmin ? "Rimuovi Super Admin" : "Promuovi"}
          </button>
        </div>
      )}
    </div>
  )
}
