// app/admin/utenti/_types.ts
// Shared types for the user management feature.

export type Business = {
  id:   string
  slug: string
  name: string
}

export type SearchResult = {
  id:             string
  name:           string
  email:          string
  isSuperAdmin:   boolean
  businessAccess: { business: { id: string; name: string } }[]
}

export type User = {
  id:             string
  name:           string
  email:          string
  isSuperAdmin:   boolean
  businessAccess: { business: Business }[]
}
