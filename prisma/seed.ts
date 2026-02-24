import "dotenv/config"
import { PrismaClient } from "../lib/generated/prisma"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL!,
})

const prisma = new PrismaClient({ adapter })

// The 14 allergens required by EU Regulation 1169/2011
const allergens = [
  { slug: "gluten",       nameIt: "Glutine",        nameEn: "Gluten" },
  { slug: "crustaceans",  nameIt: "Crostacei",      nameEn: "Crustaceans" },
  { slug: "eggs",         nameIt: "Uova",            nameEn: "Eggs" },
  { slug: "fish",         nameIt: "Pesce",           nameEn: "Fish" },
  { slug: "peanuts",      nameIt: "Arachidi",        nameEn: "Peanuts" },
  { slug: "soybeans",     nameIt: "Soia",            nameEn: "Soybeans" },
  { slug: "milk",         nameIt: "Latte",           nameEn: "Milk" },
  { slug: "nuts",         nameIt: "Frutta a guscio", nameEn: "Nuts" },
  { slug: "celery",       nameIt: "Sedano",          nameEn: "Celery" },
  { slug: "mustard",      nameIt: "Senape",          nameEn: "Mustard" },
  { slug: "sesame",       nameIt: "Sesamo",          nameEn: "Sesame" },
  { slug: "sulphites",    nameIt: "Solfiti",         nameEn: "Sulphites" },
  { slug: "lupin",        nameIt: "Lupini",          nameEn: "Lupin" },
  { slug: "molluscs",     nameIt: "Molluschi",       nameEn: "Molluscs" },
]

async function main() {
  console.log("Seeding allergens...")

  for (const allergen of allergens) {
    // upsert = insert if not exists, update if exists
    // This makes the seed safe to run multiple times without duplicates
    await prisma.allergen.upsert({
      where: { slug: allergen.slug },
      update: {},
      create: allergen,
    })
  }

  console.log("14 allergens seeded successfully.")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })