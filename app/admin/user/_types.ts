// app/admin/utenti/_types.ts
// Shared types for the user management feature.

export type Bar = {
  id:   string
  slug: string
  name: string
}

export type SearchResult = {
  id:           string
  name:         string
  email:        string
  isSuperAdmin: boolean
  barAccess:    { bar: { id: string; name: string } }[]
}

export type User = {
  id:           string
  name:         string
  email:        string
  isSuperAdmin: boolean
  barAccess:    { bar: Bar }[]
}
