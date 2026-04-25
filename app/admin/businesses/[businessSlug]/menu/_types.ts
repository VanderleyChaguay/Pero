// app/admin/businesses/[businessSlug]/menu/_types.ts

export type MenuSummary = {
  id:       string
  name:     string
  isActive: boolean
  _count:   { items: number }
}
