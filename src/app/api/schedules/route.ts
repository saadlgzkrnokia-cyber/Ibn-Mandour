import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const classId = searchParams.get("class")
  const dayOfWeek = searchParams.get("dayOfWeek")

  const where: any = {}
  if (classId) where.class = classId
  if (dayOfWeek) where.dayOfWeek = Number(dayOfWeek)

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { studentProfile: true, teacherProfile: true },
  })

  if (user?.role === "STUDENT" && user.studentProfile) {
    where.class = user.studentProfile.massarClass
  }
  if (user?.role === "TEACHER" && user.teacherProfile) {
    where.class = { in: user.teacherProfile.classes }
  }

  const schedules = await prisma.scheduleEntry.findMany({
    where,
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  })

  return NextResponse.json(schedules)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { class: className, subject, teacherId, dayOfWeek, startTime, endTime, room, semester, schoolYear } = body

  if (!className || !subject || !teacherId || dayOfWeek === undefined || !startTime || !endTime || !semester || !schoolYear) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const entry = await prisma.scheduleEntry.create({
    data: { class: className, subject, teacherId, dayOfWeek: Number(dayOfWeek), startTime, endTime, room, semester, schoolYear, createdBy: session.user.id },
  })

  return NextResponse.json(entry, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  const body = await req.json()
  const entry = await prisma.scheduleEntry.update({ where: { id }, data: body })
  return NextResponse.json(entry)
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  await prisma.scheduleEntry.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
