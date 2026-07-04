import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notifyGradeCreated } from "@/lib/notifications"

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { studentProfile: true, teacherProfile: true, parentProfile: { include: { children: true } } },
  })

  let grades: any[] = []

  if (user?.role === "STUDENT" && user.studentProfile) {
    grades = await prisma.grade.findMany({
      where: { studentId: user.studentProfile.id },
      orderBy: { createdAt: "desc" },
      take: 100,
    })
  } else if (user?.role === "TEACHER" && user.teacherProfile) {
    grades = await prisma.grade.findMany({
      where: { teacherId: session.user.id },
      include: { student: { include: { user: { select: { firstName: true, lastName: true } } } } },
      orderBy: { createdAt: "desc" },
      take: 200,
    })
  } else if (user?.role === "PARENT" && user.parentProfile) {
    const studentIds = user.parentProfile.children.map((c) => c.id)
    grades = await prisma.grade.findMany({
      where: { studentId: { in: studentIds } },
      include: { student: { include: { user: { select: { firstName: true, lastName: true } } } } },
      orderBy: { createdAt: "desc" },
      take: 200,
    })
  } else if (user?.role === "ADMIN") {
    grades = await prisma.grade.findMany({
      include: { student: { include: { user: { select: { firstName: true, lastName: true } } } } },
      orderBy: { createdAt: "desc" },
      take: 200,
    })
  }

  return NextResponse.json(grades)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user || !["ADMIN", "TEACHER"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { studentId, subject, type, score, maxScore, coefficient, semester, schoolYear, comment } = body

  if (!studentId || !subject || score === undefined) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const grade = await prisma.grade.create({
    data: {
      studentId,
      subject,
      type: type || "exam",
      score,
      maxScore: maxScore || 20,
      coefficient: coefficient || 1,
      semester: semester || "S1",
      schoolYear: schoolYear || "2025-2026",
      teacherId: session.user.id,
      comment,
    },
    include: { student: { include: { user: { select: { firstName: true, lastName: true, id: true } } } } },
  })

  notifyGradeCreated(grade.student.user.id, subject, score).catch(() => {})

  return NextResponse.json(grade, { status: 201 })
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
  const grade = await prisma.grade.update({
    where: { id, teacherId: session.user.id },
    data: {
      ...(body.subject && { subject: body.subject }),
      ...(body.type && { type: body.type }),
      ...(body.score !== undefined && { score: body.score }),
      ...(body.maxScore && { maxScore: body.maxScore }),
      ...(body.coefficient && { coefficient: body.coefficient }),
      ...(body.semester && { semester: body.semester }),
      ...(body.comment !== undefined && { comment: body.comment }),
    },
  })

  return NextResponse.json(grade)
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user || !["ADMIN", "TEACHER"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  await prisma.grade.delete({ where: { id, teacherId: session.user.id } })
  return NextResponse.json({ success: true })
}
