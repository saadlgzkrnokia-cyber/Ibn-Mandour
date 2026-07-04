export interface ServerEvents {
  "notification:new": (notification: {
    id: string
    type: string
    title: string
    body?: string
    data?: any
    createdAt: string
  }) => void
  "grade:created": (grade: any) => void
  "grade:updated": (grade: any) => void
  "attendance:marked": (attendance: any) => void
  "message:new": (message: any) => void
  "event:reminder": (event: any) => void
  "announcement:new": (announcement: any) => void
  "schedule:updated": (schedule: any) => void
}

export interface ClientEvents {
  "notification:read": (notificationId: string) => void
  "notification:read-all": () => void
  "typing": (conversationId: string) => void
  "join:room": (room: string) => void
  "leave:room": (room: string) => void
}
