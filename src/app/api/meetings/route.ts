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
  if (user?.role === "TEACHER" && user.teacherProfile) {
    where.teacherId = user.teacherProfile.id
  }

  const meetings = await prisma.teacherMeeting.findMany({
    where,
    include: { teacher: { include: { user: { select: { firstName: true, lastName: true } } } } },
    orderBy: { date: "desc" },
    take: 50,
  })

  return NextResponse.json(meetings)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { teacherProfile: true },
  })

  if (!user?.teacherProfile) {
    return NextResponse.json({ error: "Only teachers can create meetings" }, { status: 403 })
  }

  const body = await req.json()
  const { title, description, date, duration, meetLink, participants, attachments } = body

  if (!title || !date) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  // Auto-generate Google Meet link if not provided
  const meetingLink = meetLink || `https://meet.google.com/new`

  const meeting = await prisma.teacherMeeting.create({
    data: {
      teacherId: user.teacherProfile.id,
      title,
      description,
      date: new Date(date),
      duration: duration || 60,
      meetLink: meetingLink,
      participants: participants || [],
      attachments: attachments || [],
    },
    include: { teacher: { include: { user: { select: { firstName: true, lastName: true } } } } },
  })

  return NextResponse.json(meeting, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { teacherProfile: true },
  })
  if (!user?.teacherProfile) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  const body = await req.json()
  const meeting = await prisma.teacherMeeting.update({
    where: { id, teacherId: user.teacherProfile.id },
    data: {
      ...(body.title && { title: body.title }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.date && { date: new Date(body.date) }),
      ...(body.duration && { duration: body.duration }),
      ...(body.meetLink && { meetLink: body.meetLink }),
      ...(body.participants && { participants: body.participants }),
    },
  })

  return NextResponse.json(meeting)
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { teacherProfile: true },
  })
  if (!user?.teacherProfile) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  await prisma.teacherMeeting.delete({ where: { id, teacherId: user.teacherProfile.id } })
  return NextResponse.json({ success: true })
}
