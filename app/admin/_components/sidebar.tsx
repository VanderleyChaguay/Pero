"use client"

// app/admin/_components/sidebar.tsx
// Responsive admin sidebar — fixed on desktop, drawer on mobile.
// Receives serialized user data from the Server Component layout.

import { useState }      from "react"
import Link              from "next/link"
import { usePathname }   from "next/navigation"
import { useRouter }     from "next/navigation"
import { createClient }  from "@/lib/supabase/client"
import { routes }        from "@/lib/routes"
import clsx              from "clsx"
import styles            from "./sidebar.module.css"

// ── Types ────────────────────────────────────────────────────────────────────

type Bar = {
  slug: string
  name: string
}

type Props = {
  user: {
    name:         string
    email:        string
    isSuperAdmin: boolean
    bars:         Bar[]
  }
}

// ── Nav item helper ──────────────────────────────────────────────────────────

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
      className={clsx(styles.navLink, { [styles.active]: active })}
    >
      <span className={styles.navIcon}>{icon}</span>
      <span>{label}</span>
    </Link>
  )
}

// ── Main sidebar component ───────────────────────────────────────────────────

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
    <div className={styles.sidebarInner}>

      {/* ── Brand ── */}
      <div className={styles.brand}>
        <span className={styles.brandName}>Birro</span>
        <span className={styles.brandLabel}>Admin Panel</span>
      </div>

      {/* ── Navigation ── */}
      <nav className={styles.nav}>

        {/* Dashboard — visible to all admins */}
        <NavLink href={routes.admin.dashboard} label="Dashboard" icon="⊞" onClick={close} />

        {/* Amministratori — visible to all admins */}
        <NavLink href={routes.admin.users} label="Amministratori" icon="◎" onClick={close} />

        {/* SuperAdmin-only section */}
        {user.isSuperAdmin && (
          <>
            <p className={styles.navSection}>Gestione globale</p>
            <NavLink href="/admin/bares" label="Locali" icon="⌂" onClick={close} />
          </>
        )}

        {/* Bar sections — one per bar the admin has access to */}
        {user.bars.map(bar => (
          <div key={bar.slug}>
            <p className={styles.navSection}>{bar.name}</p>
            <NavLink href={routes.admin.bar.menu(bar.slug)}     label="Menù"           icon="≡" onClick={close} />
            <NavLink href={routes.admin.bar.events(bar.slug)}   label="Eventi"         icon="◈" onClick={close} />
            <NavLink href={routes.admin.bar.settings(bar.slug)} label="Configurazione" icon="◉" onClick={close} />
          </div>
        ))}
      </nav>

      {/* ── User info + logout ── */}
      <div className={styles.userArea}>
        <div className={styles.userInfo}>
          <span className={styles.userName}>{user.name}</span>
          <span className={styles.userEmail}>{user.email}</span>
          {user.isSuperAdmin && (
            <span className={styles.superBadge}>Super Admin</span>
          )}
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          Esci
        </button>
      </div>

    </div>
  )

  return (
    <>
      {/* ── Mobile top bar ── */}
      <div className={styles.topbar}>
        <button
          className={styles.menuBtn}
          onClick={() => setOpen(true)}
          aria-label="Apri menu"
        >
          <span className={styles.menuIcon}>☰</span>
        </button>
        <span className={styles.topbarTitle}>Birro Admin</span>
        <div style={{ width: 40 }} />
      </div>

      {/* ── Desktop sidebar — always visible ── */}
      <aside className={styles.sidebar}>
        {sidebarContent}
      </aside>

      {/* ── Mobile drawer overlay ── */}
      {open && (
        <div className={styles.overlay} onClick={close} aria-hidden="true" />
      )}

      {/* ── Mobile drawer ── */}
      <aside className={clsx(styles.drawer, { [styles.drawerOpen]: open })}>
        <button
          className={styles.closeBtn}
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
