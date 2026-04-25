"use server"

// app/admin/businesses/[businessSlug]/events/actions.ts
// Server Actions for event management.
// Every action verifies business access before touching the database.

import { prisma }                from "@/lib/prisma/prisma"
import { requireBusinessAccess } from "@/lib/admin/adminAuth"
import { revalidatePath }        from "next/cache"
import { redirect }              from "next/navigation"
import { routes }                from "@/lib/routes"

// ── Helpers ───────────────────────────────────────────────────────────────────

function revalidateEvents(businessSlug: string) {
  revalidatePath(`/admin/businesses/${businessSlug}/events`)
  revalidatePath(`/business/${businessSlug}/eventi`)
}

function parseEventFormData(formData: FormData) {
  const title         = (formData.get("title")         as string).trim()
  const description   = ((formData.get("description")  as string | null) ?? "").trim()
  const startDateRaw  = formData.get("startDate")       as string | null
  const endDateRaw    = formData.get("endDate")         as string | null
  const coverImageUrl = formData.get("coverImageUrl")   as string | null
  const status        = formData.get("status") === "PUBLISHED" ? "PUBLISHED" as const : "DRAFT" as const

  if (!title || !startDateRaw) return null

  const startDate = new Date(startDateRaw)
  if (isNaN(startDate.getTime())) return null

  let endDate: Date | null = null
  if (endDateRaw) {
    endDate = new Date(endDateRaw)
    if (isNaN(endDate.getTime())) return null
    if (endDate < startDate) return null
  }

  return {
    title,
    description,
    startDate,
    endDate,
    coverImageUrl: coverImageUrl || null,
    status,
  }
}

// ── Create ────────────────────────────────────────────────────────────────────

export async function createEvent(businessSlug: string, formData: FormData) {
  const { business } = await requireBusinessAccess(businessSlug)
  const data = parseEventFormData(formData)
  if (!data) return

  const event = await prisma.event.create({
    data: {
      businessId:    business.id,
      title:         data.title,
      description:   data.description,
      startDate:     data.startDate,
      endDate:       data.endDate,
      coverImageUrl: data.coverImageUrl,
      status:        data.status,
    },
  })

  revalidateEvents(businessSlug)
  redirect(routes.admin.business.editEvent(businessSlug, event.id))
}

// ── Update ────────────────────────────────────────────────────────────────────

export async function updateEvent(
  businessSlug: string,
  eventId:      string,
  formData:     FormData,
) {
  const { business } = await requireBusinessAccess(businessSlug)

  const existing = await prisma.event.findFirst({
    where:  { id: eventId, businessId: business.id },
    select: { id: true },
  })
  if (!existing) return

  const data = parseEventFormData(formData)
  if (!data) return

  await prisma.event.update({
    where: { id: eventId },
    data: {
      title:         data.title,
      description:   data.description,
      startDate:     data.startDate,
      endDate:       data.endDate,
      coverImageUrl: data.coverImageUrl,
      status:        data.status,
    },
  })

  revalidateEvents(businessSlug)
}

// ── Toggle status ─────────────────────────────────────────────────────────────

export async function toggleEventStatus(
  businessSlug:  string,
  eventId:       string,
  currentStatus: string,
) {
  const { business } = await requireBusinessAccess(businessSlug)

  const event = await prisma.event.findFirst({
    where:  { id: eventId, businessId: business.id },
    select: { id: true },
  })
  if (!event) return

  await prisma.event.update({
    where: { id: eventId },
    data:  { status: currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED" },
  })

  revalidateEvents(businessSlug)
}

// ── Delete ────────────────────────────────────────────────────────────────────

export async function deleteEvent(businessSlug: string, eventId: string) {
  const { business } = await requireBusinessAccess(businessSlug)

  const event = await prisma.event.findFirst({
    where:  { id: eventId, businessId: business.id },
    select: { id: true },
  })
  if (!event) return

  await prisma.$transaction(async (tx) => {
    await tx.eventPhoto.deleteMany({ where: { eventId } })
    await tx.event.delete({ where: { id: eventId } })
  })

  revalidateEvents(businessSlug)
  redirect(routes.admin.business.events(businessSlug))
}
