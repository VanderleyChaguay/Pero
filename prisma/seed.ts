import "dotenv/config"
import { PrismaClient } from "../lib/generated/prisma"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL!,
})

const prisma = new PrismaClient({ adapter })

// The 14 allergens required by EU Regulation 1169/2011
const allergens = [
  { slug: "gluten",      nameIt: "Glutine",         nameEn: "Gluten"      },
  { slug: "crustaceans", nameIt: "Crostacei",        nameEn: "Crustaceans" },
  { slug: "eggs",        nameIt: "Uova",             nameEn: "Eggs"        },
  { slug: "fish",        nameIt: "Pesce",            nameEn: "Fish"        },
  { slug: "peanuts",     nameIt: "Arachidi",         nameEn: "Peanuts"     },
  { slug: "soybeans",    nameIt: "Soia",             nameEn: "Soybeans"    },
  { slug: "milk",        nameIt: "Latte",            nameEn: "Milk"        },
  { slug: "nuts",        nameIt: "Frutta a guscio",  nameEn: "Nuts"        },
  { slug: "celery",      nameIt: "Sedano",           nameEn: "Celery"      },
  { slug: "mustard",     nameIt: "Senape",           nameEn: "Mustard"     },
  { slug: "sesame",      nameIt: "Sesamo",           nameEn: "Sesame"      },
  { slug: "sulphites",   nameIt: "Solfiti",          nameEn: "Sulphites"   },
  { slug: "lupin",       nameIt: "Lupini",           nameEn: "Lupin"       },
  { slug: "molluscs",    nameIt: "Molluschi",        nameEn: "Molluscs"    },
]

async function main() {
  console.log("Seeding allergens...")
  for (const allergen of allergens) {
    await prisma.allergen.upsert({
      where:  { slug: allergen.slug },
      update: {},
      create: allergen,
    })
  }
  console.log("✓ 14 allergens seeded")

  console.log("Seeding bar Però...")
  const pero = await prisma.bar.upsert({
    where:  { slug: "pero" },
    update: {},
    create: {
      id:           "pero-bar-001",
      slug:         "pero",
      name:         "Però",
      description:  "Un bar dove il tempo rallenta, il vino racconta storie e ogni cocktail è una scelta consapevole.",
      history:      "Però nasce da un'idea semplice: creare uno spazio dove la qualità non è un lusso ma una necessità. Nel cuore di Savona, in Via Baglietto, abbiamo aperto le porte a chi cercava qualcosa di diverso.",
      phone:        "",
      address:      "Via Baglietto 44r, Savona",
      logoUrl:      "/images/pero/PeroWithoutBackGround.png",
      primaryColor: "#6B1E2A",
    },
  })
  console.log("✓ Bar Però seeded")

  console.log("Seeding menus for Però...")
  await prisma.menu.upsert({
    where:  { id: "pero-menu-drinks" },
    update: {},
    create: { id: "pero-menu-drinks", barId: pero.id, category: "DRINKS", name: "Cocktail & Drinks", isActive: true },
  })
  await prisma.menu.upsert({
    where:  { id: "pero-menu-wine" },
    update: {},
    create: { id: "pero-menu-wine", barId: pero.id, category: "WINE", name: "Carta dei Vini", isActive: true },
  })
  await prisma.menu.upsert({
    where:  { id: "pero-menu-food" },
    update: {},
    create: { id: "pero-menu-food", barId: pero.id, category: "FOOD", name: "Cucina", isActive: true },
  })
  console.log("✓ Menus seeded")

  // ── Admin setup ──────────────────────────────────────────────────────────
  // The AdminUser must already exist in the database (created by the trigger
  // when the user registered in Supabase Auth).
  // We just need to make them SuperAdmin and grant access to Però.
  console.log("Setting up admin permissions...")

  const MAIN_ADMIN_ID = "6e74fdc4-8d8b-4d7f-b481-1d7f201daa0e" // <-- REPLACE with your actual admin user's ID from Supabase Auth

  // Make the main user a SuperAdmin
  await prisma.adminUser.update({
    where: { id: MAIN_ADMIN_ID },
    data:  { isSuperAdmin: true },
  })
  console.log("✓ SuperAdmin set")

  // Grant access to Però — upsert avoids duplicate errors on re-run
  await prisma.adminBarAccess.upsert({
    where: {
      userId_barId: {
        userId: MAIN_ADMIN_ID,
        barId:  pero.id,
      }
    },
    update: {},
    create: {
      userId:    MAIN_ADMIN_ID,
      barId:     pero.id,
      grantedBy: MAIN_ADMIN_ID,
    },
  })
  console.log("✓ Bar access granted")

  console.log("\n✅ Seed completed successfully")
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })