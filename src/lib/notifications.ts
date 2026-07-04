import { prisma } from "./prisma"

type NotificationInput = {
  userId: string
  type: string
  title: string
  body?: string
  data?: any
}

export async function createNotification(input: NotificationInput) {
  const notification = await prisma.notification.create({
    data: {
      userId: input.userId,
      type: input.type,
      title: input.title,
      body: input.body,
      data: input.data || {},
      sentVia: [],
    },
  })

  try {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001"
    await fetch(`${socketUrl}/emit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        room: `user:${input.userId}`,
        event: "notification:new",
        data: {
          id: notification.id,
          type: input.type,
          title: input.title,
          body: input.body,
          data: input.data,
          createdAt: notification.createdAt.toISOString(),
        },
      }),
    }).catch(() => {})
  } catch {}

  return notification
}

export async function notifyGradeCreated(studentUserId: string, subject: string, score: number) {
  return createNotification({
    userId: studentUserId,
    type: "grade",
    title: "Nouvelle note",
    body: `Note en ${subject}: ${score}/20`,
    data: { subject, score },
  })
}

export async function notifyAttendanceMarked(studentUserId: string, status: string) {
  return createNotification({
    userId: studentUserId,
    type: "attendance",
    title: "Assiduité",
    body: `Présence marquée: ${status}`,
    data: { status },
  })
}

export async function notifyNewMessage(receiverId: string, senderName: string) {
  return createNotification({
    userId: receiverId,
    type: "message",
    title: "Nouveau message",
    body: `Message de ${senderName}`,
  })
}

export async function notifyNewAnnouncement(userId: string, title: string) {
  return createNotification({
    userId,
    type: "announcement",
    title: "Nouvelle annonce",
    body: title,
  })
}

export async function notifyMeetingScheduled(teacherUserId: string, title: string, date: Date) {
  return createNotification({
    userId: teacherUserId,
    type: "meeting",
    title: "Réunion planifiée",
    body: `${title} - ${date.toLocaleDateString()}`,
  })
}
