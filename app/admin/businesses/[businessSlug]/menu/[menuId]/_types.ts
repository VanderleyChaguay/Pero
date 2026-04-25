// app/admin/businesses/[businessSlug]/menu/[menuId]/_types.ts
// Shared types for the menu items management feature.

export type Allergen = {
  id:     string
  slug:   string
  nameIt: string
}

export type MenuItem = {
  id:          string
  name:        string
  description: string
  price:       number
  isAvailable: boolean
  ingredients: string[]
  allergens:   { allergen: Allergen }[]
}
