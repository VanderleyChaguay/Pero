import { PrismaClient } from "../generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

// Prisma 7 requires a driver adapter — PrismaPg connects to PostgreSQL
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

// PrismaClient is attached to globalThis in development to prevent
// exhausting the database connection limit on every hot reload
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}