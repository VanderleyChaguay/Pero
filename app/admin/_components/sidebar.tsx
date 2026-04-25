"use client"

// app/admin/_components/sidebar.tsx
// Responsive admin sidebar — fixed on desktop, drawer on mobile.
// Receives serialized user data from the Server Component layout.

import { useState }     from "react"
import Link             from "next/link"
import { usePathname }  from "next/navigation"
import { useRouter }    from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { routes }       from "@/lib/routes"
import clsx             from "clsx"
import styles           from "./sidebar.module.css"

// ── Types ─────────────────────────────────────────────────────────────────────

type Business = {
  slug: string
  name: string
}

type Props = {
  user: {
    name:         string
    email:        string
    isSuperAdmin: boolean
    businesses:   Business[]
  }
}

// ── Nav link helper ───────────────────────────────────────────────────────────

function NavLink({
  href,
  label,
  icon,
  onClick,
}: {
  href:     string
  label:    string
  icon:     string
  onClick?: () => void
}) {
  const pathname = usePathname()
  const active   = pathname === href || pathname.startsWith(href + "/")

  return (
    <Link
      href={href}
      onClick={onClick}
      className={clsx(
        "flex items-center relative no-underline",
        styles.navLink,
        { [styles.active]: active }
      )}
    >
      <span className={`shrink-0 text-center ${styles.navIcon}`}>{icon}</span>
      <span>{label}</span>
    </Link>
  )
}

// ── Main sidebar ──────────────────────────────────────────────────────────────

export function AdminSidebar({ user }: Props) {
  const [open, setOpen] = useState(false)
  const router          = useRouter()

  const close = () => setOpen(false)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push(routes.auth.login)
  }

  const sidebarContent = (
    <div className={`flex flex-col h-full ${styles.sidebarInner}`}>

      {/* ── Brand ── */}
      <div className={`flex flex-col ${styles.brand}`}>
        <span className={styles.brandName}>Birro</span>
        <span className={`uppercase ${styles.brandLabel}`}>Admin Panel</span>
      </div>

      {/* ── Navigation ── */}
      <nav className={`flex-1 flex flex-col ${styles.nav}`}>

        {/* Dashboard — visible to all admins */}
        <NavLink
          href={routes.admin.dashboard}
          label="Dashboard"
          icon="⊞"
          onClick={close}
        />
        <NavLink
          href={routes.admin.apply}
          label="Diventa admin"
          icon="✦"
          onClick={close}
        />

        {/* SuperAdmin-only section */}
        {user.isSuperAdmin && (
          <>
            <p className={`m-0 uppercase ${styles.navSection}`}>Gestione globale</p>
            <NavLink href={routes.admin.newBusiness} label="Locali"         icon="⌂" onClick={close} />
            <NavLink href={routes.admin.users}       label="Amministratori" icon="◎" onClick={close} />
          </>
        )}

        {/* Business sections — one per business the admin has access to */}
        {user.businesses.map(business => (
          <div key={business.slug}>
            <p className={`m-0 uppercase ${styles.navSection}`}>{business.name}</p>
            <NavLink href={routes.admin.business.menu(business.slug)}     label="Menù"           icon="≡" onClick={close} />
            <NavLink href={routes.admin.business.events(business.slug)}   label="Eventi"         icon="◈" onClick={close} />
            <NavLink href={routes.admin.business.settings(business.slug)} label="Configurazione" icon="◉" onClick={close} />
          </div>
        ))}

      </nav>

      {/* ── User info + logout ── */}
      <div className={`mt-auto flex items-center ${styles.userArea}`}>
        <div className={`flex-1 min-w-0 flex flex-col ${styles.userInfo}`}>
          <span className={`truncate ${styles.userName}`}>{user.name}</span>
          <span className={`truncate ${styles.userEmail}`}>{user.email}</span>
          {user.isSuperAdmin && (
            <span className={`inline-block uppercase w-fit ${styles.superBadge}`}>Super Admin</span>
          )}
        </div>
        <button
          className={`shrink-0 whitespace-nowrap cursor-pointer bg-transparent ${styles.logoutBtn}`}
          onClick={handleLogout}
        >
          Esci
        </button>
      </div>

    </div>
  )

  return (
    <>
      {/* ── Mobile top bar ── */}
      <div className={`hidden fixed inset-x-0 top-0 z-[100] items-center justify-between px-4 ${styles.topbar}`}>
        <button
          className="flex items-center bg-transparent border-none text-[color:var(--color-text-sidebar)] cursor-pointer p-2"
          onClick={() => setOpen(true)}
          aria-label="Apri menu"
        >
          <span className={styles.menuIcon}>☰</span>
        </button>
        <span className={styles.topbarTitle}>Birro Admin</span>
        <div className="w-10" />
      </div>

      {/* ── Desktop sidebar — always visible ── */}
      <aside className={`hidden fixed inset-y-0 left-0 z-50 overflow-y-auto flex-col ${styles.sidebar}`}>
        {sidebarContent}
      </aside>

      {/* ── Mobile drawer overlay ── */}
      {open && (
        <div
          className={`fixed inset-0 z-[190] ${styles.overlay}`}
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile drawer ── */}
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-[200] overflow-y-auto flex flex-col",
          styles.drawer,
          { [styles.drawerOpen]: open }
        )}
      >
        <button
          className={`hidden absolute top-4 right-4 bg-transparent border-none text-[1.1rem] cursor-pointer p-1 ${styles.closeBtn}`}
          onClick={close}
          aria-label="Chiudi menu"
        >
          ✕
        </button>
        {sidebarContent}
      </aside>
    </>
  )
}
