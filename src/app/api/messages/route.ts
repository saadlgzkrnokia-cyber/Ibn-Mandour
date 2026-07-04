import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notifyNewMessage } from "@/lib/notifications"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const conversation = searchParams.get("with")

  const where: any = {
    OR: [{ senderId: session.user.id }, { receiverId: session.user.id }],
  }
  if (conversation) {
    where.OR = [
      { senderId: session.user.id, receiverId: conversation },
      { senderId: conversation, receiverId: session.user.id },
    ]
  }

  const messages = await prisma.message.findMany({
    where,
    include: {
      sender: { select: { id: true, firstName: true, lastName: true, role: true } },
      receiver: { select: { id: true, firstName: true, lastName: true, role: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  })

  return NextResponse.json(messages)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { receiverId, subject, body: messageBody } = body

  if (!receiverId || !messageBody) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const message = await prisma.message.create({
    data: {
      senderId: session.user.id,
      receiverId,
      subject,
      body: messageBody,
      attachments: [],
    },
    include: {
      sender: { select: { id: true, firstName: true, lastName: true } },
      receiver: { select: { id: true, firstName: true, lastName: true } },
    },
  })

  notifyNewMessage(receiverId, session.user.name || "Utilisateur").catch(() => {})

  return NextResponse.json(message, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  await prisma.message.update({
    where: { id, receiverId: session.user.id },
    data: { readAt: new Date() },
  })

  return NextResponse.json({ success: true })
}
