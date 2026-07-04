import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })

  const where: any = {}
  if (user?.role === "STUDENT") where.OR = [{ target: "all" }, { target: "students" }]
  else if (user?.role === "PARENT") where.OR = [{ target: "all" }, { target: "parents" }]
  else if (user?.role === "TEACHER") where.OR = [{ target: "all" }, { target: "teachers" }]

  const events = await prisma.event.findMany({
    where,
    orderBy: { date: "asc" },
    take: 50,
  })

  return NextResponse.json(events)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user || !["ADMIN", "TEACHER"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { title, description, date, endDate, location, target } = body

  if (!title || !date) return NextResponse.json({ error: "Missing required fields" }, { status: 400 })

  const event = await prisma.event.create({
    data: {
      title, description, location, target: target || "all",
      date: new Date(date),
      endDate: endDate ? new Date(endDate) : null,
      createdBy: session.user.id,
    },
  })

  return NextResponse.json(event, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session?.user || !["ADMIN", "TEACHER"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  const body = await req.json()
  const event = await prisma.event.update({
    where: { id, createdBy: session.user.id },
    data: {
      ...(body.title && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.date && { date: new Date(body.date) }),
      ...(body.endDate !== undefined && { endDate: body.endDate ? new Date(body.endDate) : null }),
      ...(body.location !== undefined && { location: body.location }),
      ...(body.target && { target: body.target }),
    },
  })

  return NextResponse.json(event)
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user || !["ADMIN", "TEACHER"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  await prisma.event.delete({ where: { id, createdBy: session.user.id } })
  return NextResponse.json({ success: true })
}
