// Shared TypeScript types for the entire application
// These mirror the Prisma schema models

export type Bar = {
  id:           string
  slug:         string
  name:         string
  description:  string
  history:      string
  phone:        string
  address:      string
  logoUrl:      string | null
  coverUrl:     string | null
  primaryColor: string
}

export type MenuCategory = "DRINKS" | "FOOD" | "WINE"

export type Allergen = {
  id:      string
  slug:    string
  nameIt:  string
  nameEn:  string
  iconUrl: string | null
}

export type MenuItem = {
  id:          string
  menuId:      string
  name:        string
  description: string
  price:       number
  imageUrl:    string | null
  isAvailable: boolean
  order:       number
  ingredients: string[]
  allergens:   Allergen[]
}

export type Menu = {
  id:       string
  barId:    string
  category: MenuCategory
  name:     string
  isActive: boolean
  items:    MenuItem[]
}

export type Event = {
  id:          string
  barId:       string
  title:       string
  description: string
  date:        string
  isPublished: boolean
  photos:      EventPhoto[]
}

export type EventPhoto = {
  id:      string
  eventId: string
  url:     string
  caption: string | null
  order:   number
}

export type AdminUser = {
  id:          string
  email:       string
  name:        string
  isSuperAdmin: boolean
}