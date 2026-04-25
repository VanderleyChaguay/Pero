// app/admin/businesses/[businessSlug]/events/_types.ts

export type EventStatus = "DRAFT" | "PUBLISHED"

export type EventSummary = {
  id:            string
  title:         string
  startDate:     string   // UTC ISO string — serialized for RSC → client boundary
  endDate:       string | null
  coverImageUrl: string | null
  status:        EventStatus
  createdAt:     string
}

export type EventDetail = EventSummary & {
  description: string
}
