// Menu Preview component for Bar Però
// Shows a static preview of the 3 main menu categories
// Static content — no interactivity needed, Server Component

import Link    from "next/link"
import { routes } from "@/lib/routes"
import styles  from "./menuPreview.module.css"

// Placeholder data — will be replaced with real database data later
const MENU_PREVIEW = [
  {
    category: "Cocktail",
    items: [
      { name: "Negroni Sbagliato",  price: "9€"  },
      { name: "Spritz al Prosecco", price: "7€"  },
      { name: "Americano Rosso",    price: "8€"  },
    ],
  },
  {
    category: "Vini",
    items: [
      { name: "Barolo 2019",             price: "12€" },
      { name: "Brunello di Montalcino",  price: "15€" },
      { name: "Vermentino di Sardegna",  price: "9€"  },
    ],
  },
  {
    category: "Cucina",
    items: [
      { name: "Tagliere di salumi e formaggi", price: "14€" },
      { name: "Bruschette al pomodoro",        price: "7€"  },
      { name: "Carpaccio di manzo",            price: "13€" },
    ],
  },
]

export function PeroMenuPreview() {
  return (
    <section id="menu" className={styles.wrapper}>
      <div className={styles.inner}>

        <p className={styles.eyebrow}>Il nostro menù</p>
        <h2 className={styles.title}>
          Ogni scelta <em>racconta</em><br />qualcosa.
        </h2>

        <div className={styles.grid}>
          {MENU_PREVIEW.map(col => (
            <div key={col.category} className={styles.col}>
              <p className={styles.category}>{col.category}</p>
              <ul className={styles.items}>
                {col.items.map(item => (
                  <li key={item.name}>
                    <span>{item.name}</span>
                    <span className={styles.price}>{item.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <Link href={routes.business.menu("pero")} className={styles.btnGhost}>
            Vedi il menù completo
          </Link>
        </div>

      </div>
    </section>
  )
}
