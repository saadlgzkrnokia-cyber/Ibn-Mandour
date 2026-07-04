import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { teacherProfile: true },
  })

  const where: any = {}
  if (user?.role === "TEACHER") {
    where.OR = [{ target: "all" }, { target: "teachers" }, { target: { startsWith: "class:" }, authorId: session.user.id }]
  } else if (user?.role === "STUDENT") {
    where.OR = [{ target: "all" }, { target: "students" }]
  } else if (user?.role === "PARENT") {
    where.OR = [{ target: "all" }, { target: "parents" }]
  }

  const announcements = await prisma.announcement.findMany({
    where,
    include: { author: { select: { firstName: true, lastName: true, role: true } } },
    orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
    take: 50,
  })

  return NextResponse.json(announcements)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user || !["ADMIN", "TEACHER"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { title, body: content, target, pinned } = body

  if (!title || !content) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const announcement = await prisma.announcement.create({
    data: {
      title,
      body: content,
      target: target || "all",
      authorId: session.user.id,
      pinned: pinned || false,
    },
    include: { author: { select: { firstName: true, lastName: true, role: true } } },
  })

  return NextResponse.json(announcement, { status: 201 })
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
  const announcement = await prisma.announcement.update({
    where: { id, authorId: session.user.id },
    data: {
      ...(body.title && { title: body.title }),
      ...(body.body && { body: body.body }),
      ...(body.target && { target: body.target }),
      ...(body.pinned !== undefined && { pinned: body.pinned }),
    },
  })

  return NextResponse.json(announcement)
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user || !["ADMIN", "TEACHER"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  await prisma.announcement.delete({ where: { id, authorId: session.user.id } })
  return NextResponse.json({ success: true })
}
