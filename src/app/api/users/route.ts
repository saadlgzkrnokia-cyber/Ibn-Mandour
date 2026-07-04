import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const role = searchParams.get("role")

  const where: any = {}
  if (role) where.role = role

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true, email: true, firstName: true, lastName: true, role: true, language: true,
      isActive: true, createdAt: true,
      studentProfile: { select: { massarClass: true, enrollmentYear: true } },
      teacherProfile: { select: { subjects: true, classes: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  })

  return NextResponse.json(users)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { email, password, firstName, lastName, role, massarClass, subjects, classes } = body

  if (!email || !firstName || !lastName || !role) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return NextResponse.json({ error: "Email already exists" }, { status: 409 })

  const passwordHash = password ? await bcrypt.hash(password, 12) : null

  const user = await prisma.user.create({
    data: {
      email, passwordHash, firstName, lastName, role,
      ...(role === "STUDENT" && { studentProfile: { create: { massarClass: massarClass || "", enrollmentYear: new Date().getFullYear() } } }),
      ...(role === "TEACHER" && { teacherProfile: { create: { subjects: subjects || [], classes: classes || [] } } }),
      ...(role === "PARENT" && { parentProfile: { create: {} } }),
      ...(role === "ADMIN" && { adminProfile: { create: {} } }),
    },
    select: { id: true, email: true, firstName: true, lastName: true, role: true },
  })

  return NextResponse.json(user, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  await prisma.user.update({ where: { id }, data: { isActive: false } })
  return NextResponse.json({ success: true })
}
