// app/admin/businesses/[businessSlug]/menu/_types.ts
// Shared types and constants for the menu management feature.

export type MenuSummary = {
  id:       string
  name:     string
  category: string
  isActive: boolean
  _count:   { items: number }
}

export const CATEGORY_LABELS: Record<string, string> = {
  DRINKS: "Drinks",
  WINE:   "Vini",
  FOOD:   "Cucina",
}
