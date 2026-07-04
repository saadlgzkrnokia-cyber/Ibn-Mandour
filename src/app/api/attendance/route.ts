import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { studentProfile: true, teacherProfile: true, parentProfile: { include: { children: true } } },
  })

  let records: any[] = []

  if (user?.role === "STUDENT" && user.studentProfile) {
    records = await prisma.attendance.findMany({
      where: { studentId: user.studentProfile.id },
      orderBy: { date: "desc" },
      take: 100,
    })
  } else if (user?.role === "TEACHER" && user.teacherProfile) {
    records = await prisma.attendance.findMany({
      where: { teacherId: session.user.id },
      include: { student: { include: { user: { select: { firstName: true, lastName: true } } } } },
      orderBy: { date: "desc" },
      take: 200,
    })
  } else if (user?.role === "PARENT" && user.parentProfile) {
    const studentIds = user.parentProfile.children.map((c) => c.id)
    records = await prisma.attendance.findMany({
      where: { studentId: { in: studentIds } },
      orderBy: { date: "desc" },
      take: 200,
    })
  } else if (user?.role === "ADMIN") {
    records = await prisma.attendance.findMany({
      include: { student: { include: { user: { select: { firstName: true, lastName: true } } } } },
      orderBy: { date: "desc" },
      take: 200,
    })
  }

  return NextResponse.json(records)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user || !["ADMIN", "TEACHER"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { studentId, date, status, subject, justification } = body

  if (!studentId || !date || !status) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const record = await prisma.attendance.create({
    data: {
      studentId,
      date: new Date(date),
      status,
      subject,
      teacherId: session.user.id,
      justification,
    },
    include: { student: { include: { user: { select: { firstName: true, lastName: true, id: true } } } } },
  })

  return NextResponse.json(record, { status: 201 })
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
  const record = await prisma.attendance.update({
    where: { id, teacherId: session.user.id },
    data: {
      ...(body.status && { status: body.status }),
      ...(body.justification !== undefined && { justification: body.justification }),
    },
  })

  return NextResponse.json(record)
}
