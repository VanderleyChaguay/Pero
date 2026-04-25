"use client"

import { useState }            from "react"
import Link                    from "next/link"
import { routes }              from "@/lib/routes"
import type { SerializedMenu } from "./MenuContent"
import styles                  from "./menu.module.css"

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatPrice(price: number): string {
  return new Intl.NumberFormat("it-IT", {
    style:                 "currency",
    currency:              "EUR",
    minimumFractionDigits: 2,
  }).format(price)
}

// ── Types ─────────────────────────────────────────────────────────────────────

type Props = {
  businessName: string
  menus:        SerializedMenu[]
}

// ── Component ─────────────────────────────────────────────────────────────────

export function MenuView({ businessName, menus }: Props) {
  const [selectedMenuId, setSelectedMenuId] = useState<string>(
    menus[0]?.id ?? ""
  )

  // ── Empty state ──────────────────────────────────────────────────────────────

  if (menus.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyEyebrow}>Il nostro menù</p>
        <h1 className={styles.emptyTitle}>
          Il menù è in <em>arrivo</em>.
        </h1>
        <p className={styles.emptyText}>
          Stiamo preparando qualcosa di speciale. Torna presto.
        </p>
        <Link href={routes.business.home("pero")} className={styles.backLink}>
          ← Torna alla home
        </Link>
      </div>
    )
  }

  const activeMenu = menus.find(m => m.id === selectedMenuId) ?? menus[0]

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <main className={styles.page}>

      {/* ── Page header ── */}
      <header className={styles.header}>
        <p className={styles.eyebrow}>Il nostro menù</p>
        <h1 className={styles.title}>{businessName}</h1>
        <p className={styles.subtitle}>
          Una selezione curata per ogni momento della serata.
        </p>
      </header>

      {/* ── Sticky menu navigation ── */}
      {/* key is menu.id — unique, stable, never collides across menus */}
      <nav className={styles.categoryNav} aria-label="Sezioni menù">
        <div className={styles.categoryInner}>
          {menus.map(menu => (
            <button
              key={menu.id}
              type="button"
              className={`${styles.categoryBtn} ${
                selectedMenuId === menu.id ? styles.categoryBtnActive : ""
              }`}
              onClick={() => setSelectedMenuId(menu.id)}
              aria-pressed={selectedMenuId === menu.id}
            >
              {menu.name}
            </button>
          ))}
        </div>
      </nav>

      {/* ── Items section ── */}
      <section className={styles.section}>
        <div className={styles.inner}>

          <p className={styles.sectionLabel}>{activeMenu.name}</p>

          {activeMenu.items.length === 0 ? (
            <div className={styles.emptyCategory}>
              <p className={styles.emptyCategoryTitle}>
                Stiamo preparando questa sezione.
              </p>
              <p className={styles.emptyCategoryText}>
                Le voci saranno disponibili a breve.
              </p>
            </div>
          ) : (
            // key on <ul> re-mounts on menu switch, resetting the fade-in animation.
            <ul className={styles.items} key={activeMenu.id}>
              {activeMenu.items.map(item => (
                <li
                  key={item.id}
                  className={`${styles.item} ${
                    !item.isAvailable ? styles.itemUnavailable : ""
                  }`}
                >

                  {/* Left column: name + description + allergens */}
                  <div className={styles.itemMain}>

                    <div className={styles.itemHeader}>
                      <span className={styles.itemName}>{item.name}</span>
                      {!item.isAvailable && (
                        <span className={styles.badgeUnavailable}>
                          Non disponibile
                        </span>
                      )}
                    </div>

                    {item.description && (
                      <p className={styles.itemDesc}>{item.description}</p>
                    )}

                    {item.allergens.length > 0 && (
                      <div
                        className={styles.allergens}
                        aria-label="Allergeni presenti"
                      >
                        {item.allergens.map(({ allergen }) => (
                          <span
                            key={allergen.slug}
                            className={styles.allergenTag}
                          >
                            {allergen.nameIt}
                          </span>
                        ))}
                      </div>
                    )}

                  </div>

                  {/* Right column: price */}
                  <span
                    className={styles.price}
                    aria-label={`Prezzo: ${formatPrice(item.price)}`}
                  >
                    {formatPrice(item.price)}
                  </span>

                </li>
              ))}
            </ul>
          )}

        </div>
      </section>

    </main>
  )
}
