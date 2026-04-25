import "dotenv/config"
import { PrismaClient } from "../lib/generated/prisma/client"
import { PrismaPg }     from "@prisma/adapter-pg"

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL!,
})

const prisma = new PrismaClient({ adapter })

// ── Allergens (EU Regulation 1169/2011) ───────────────────────────────────────

const allergens = [
  { slug: "gluten",      nameIt: "Glutine",        nameEn: "Gluten"      },
  { slug: "crustaceans", nameIt: "Crostacei",       nameEn: "Crustaceans" },
  { slug: "eggs",        nameIt: "Uova",            nameEn: "Eggs"        },
  { slug: "fish",        nameIt: "Pesce",           nameEn: "Fish"        },
  { slug: "peanuts",     nameIt: "Arachidi",        nameEn: "Peanuts"     },
  { slug: "soybeans",    nameIt: "Soia",            nameEn: "Soybeans"    },
  { slug: "milk",        nameIt: "Latte",           nameEn: "Milk"        },
  { slug: "nuts",        nameIt: "Frutta a guscio", nameEn: "Nuts"        },
  { slug: "celery",      nameIt: "Sedano",          nameEn: "Celery"      },
  { slug: "mustard",     nameIt: "Senape",          nameEn: "Mustard"     },
  { slug: "sesame",      nameIt: "Sesamo",          nameEn: "Sesame"      },
  { slug: "sulphites",   nameIt: "Solfiti",         nameEn: "Sulphites"   },
  { slug: "lupin",       nameIt: "Lupini",          nameEn: "Lupin"       },
  { slug: "molluscs",    nameIt: "Molluschi",       nameEn: "Molluscs"    },
]

// ── Helper ────────────────────────────────────────────────────────────────────

async function seedItem(
  id:            string,
  menuId:        string,
  order:         number,
  name:          string,
  description:   string,
  price:         number,
  ingredients:   string[],
  allergenSlugs: string[],
  allergenMap:   Record<string, string>,
) {
  const item = await prisma.menuItem.upsert({
    where:  { id },
    update: {},
    create: { id, menuId, name, description, price, ingredients, isAvailable: true, order },
  })

  for (const slug of allergenSlugs) {
    const allergenId = allergenMap[slug]
    if (!allergenId) continue
    await prisma.menuItemAllergen.upsert({
      where:  { menuItemId_allergenId: { menuItemId: item.id, allergenId } },
      update: {},
      create: { menuItemId: item.id, allergenId },
    })
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {

  // ── Allergens ──────────────────────────────────────────────────────────────
  console.log("Seeding allergens...")
  for (const allergen of allergens) {
    await prisma.allergen.upsert({
      where:  { slug: allergen.slug },
      update: {},
      create: allergen,
    })
  }
  const allergenList = await prisma.allergen.findMany({ select: { id: true, slug: true } })
  const allergenMap  = Object.fromEntries(allergenList.map(a => [a.slug, a.id]))
  console.log("✓ 14 allergeni")

  // ── Business ───────────────────────────────────────────────────────────────
  console.log("Seeding business Però...")
  const pero = await prisma.business.upsert({
    where:  { slug: "pero" },
    update: {},
    create: {
      id:           "pero-business-001",
      slug:         "pero",
      name:         "Però",
      description:  "Un locale dove il tempo rallenta, il vino racconta storie e ogni cocktail è una scelta consapevole.",
      history:      "Però nasce da un'idea semplice: creare uno spazio dove la qualità non è un lusso ma una necessità. Nel cuore di Savona, in Via Baglietto, abbiamo aperto le porte a chi cercava qualcosa di diverso.",
      phone:        "",
      address:      "Via Baglietto 44r, Savona",
      logoUrl:      "/images/pero/PeroWithoutBackGround.png",
      primaryColor: "#6B1E2A",
    },
  })
  console.log("✓ Business Però")

  // ── Menus ──────────────────────────────────────────────────────────────────
  console.log("Seeding menus...")
  await prisma.menu.upsert({
    where:  { id: "pero-menu-drinks" },
    update: {},
    create: { id: "pero-menu-drinks", businessId: pero.id, name: "Cocktail & Drinks", isActive: true },
  })
  await prisma.menu.upsert({
    where:  { id: "pero-menu-wine" },
    update: {},
    create: { id: "pero-menu-wine",   businessId: pero.id, name: "Carta dei Vini",    isActive: true },
  })
  await prisma.menu.upsert({
    where:  { id: "pero-menu-food" },
    update: {},
    create: { id: "pero-menu-food",   businessId: pero.id, name: "Cucina",            isActive: true },
  })
  console.log("✓ 3 menù")

  // ── Menu items ─────────────────────────────────────────────────────────────
  console.log("Seeding menu items...")

  // Cocktail & Drinks
  await seedItem(
    "pero-item-negroni",
    "pero-menu-drinks", 1,
    "Negroni",
    "Gin, vermouth rosso, Campari. Servito su ghiaccio con scorza d'arancia.",
    9.00,
    ["gin", "vermouth rosso", "Campari", "scorza d'arancia"],
    ["sulphites"],
    allergenMap,
  )
  await seedItem(
    "pero-item-spritz",
    "pero-menu-drinks", 2,
    "Spritz Però",
    "Prosecco, bitter artigianale, acqua frizzante. Guarnito con oliva e fetta d'arancia.",
    7.00,
    ["prosecco", "bitter", "acqua frizzante", "arancia"],
    ["sulphites"],
    allergenMap,
  )
  await seedItem(
    "pero-item-moscow-mule",
    "pero-menu-drinks", 3,
    "Moscow Mule",
    "Vodka, ginger beer artigianale, succo di lime fresco. Servito in tazza di rame.",
    8.50,
    ["vodka", "ginger beer", "lime"],
    [],
    allergenMap,
  )

  // Carta dei Vini
  await seedItem(
    "pero-item-vermentino",
    "pero-menu-wine", 1,
    "Vermentino di Sardegna DOC",
    "Bianco fresco e sapido, note di agrumi e fiori bianchi. Produttore: Cantina di Gallura.",
    6.00,
    ["uve Vermentino"],
    ["sulphites"],
    allergenMap,
  )
  await seedItem(
    "pero-item-rossese",
    "pero-menu-wine", 2,
    "Rossese di Dolceacqua DOC",
    "Rosso leggero e profumato, note di frutti rossi e spezie delicate. Vigneto Rivera Ligure.",
    7.00,
    ["uve Rossese"],
    ["sulphites"],
    allergenMap,
  )
  await seedItem(
    "pero-item-prosecco",
    "pero-menu-wine", 3,
    "Prosecco Superiore DOCG",
    "Bollicine fini e persistenti, perlage elegante con sentori di mela e pera.",
    5.50,
    ["uve Glera"],
    ["sulphites"],
    allergenMap,
  )

  // Cucina
  await seedItem(
    "pero-item-bruschetta",
    "pero-menu-food", 1,
    "Bruschetta al Pomodoro e Basilico",
    "Pane di Altamura tostato, pomodoro datterino, aglio, basilico fresco e olio extravergine.",
    5.00,
    ["pane di Altamura", "pomodoro datterino", "aglio", "basilico", "olio EVO"],
    ["gluten"],
    allergenMap,
  )
  await seedItem(
    "pero-item-tagliere",
    "pero-menu-food", 2,
    "Tagliere Misto",
    "Selezione di salumi artigianali, formaggi stagionati e freschi, miele di acacia e grissini.",
    14.00,
    ["salumi misti", "formaggi misti", "miele d'acacia", "grissini"],
    ["gluten", "milk"],
    allergenMap,
  )
  await seedItem(
    "pero-item-polpette",
    "pero-menu-food", 3,
    "Polpette di Manzo al Sugo",
    "Polpette di manzo e maiale con pomodoro San Marzano, prezzemolo e pane raffermo. Servite con pane.",
    10.00,
    ["manzo", "maiale", "pomodoro San Marzano", "uova", "pane raffermo", "prezzemolo"],
    ["gluten", "eggs", "milk"],
    allergenMap,
  )

  console.log("✓ 9 voci (3 per menù)")

  // ── Admin setup ────────────────────────────────────────────────────────────
  console.log("Setting up admin permissions...")

  const MAIN_ADMIN_ID = "1bf6a749-73e2-4982-8b34-839052e19d3d"

  await prisma.adminUser.upsert({
    where:  { id: MAIN_ADMIN_ID },
    update: { isSuperAdmin: true },
    create: {
      id:          MAIN_ADMIN_ID,
      email:       "yovaelocone@gmail.com", // <--- METTI LA TUA EMAIL REALE QUI
      name:        "Super Admin",
      isSuperAdmin: true,
    },
  })

  await prisma.adminBusinessAccess.upsert({
    where: {
      userId_businessId: { userId: MAIN_ADMIN_ID, businessId: pero.id },
    },
    update: {},
    create: {
      userId:     MAIN_ADMIN_ID,
      businessId: pero.id,
      grantedBy:  MAIN_ADMIN_ID,
    },
  })
  console.log("✓ Permessi admin")

  console.log("\n✅ Seed completato con successo")
}

main()
  .then(async ()  => { await prisma.$disconnect() })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
