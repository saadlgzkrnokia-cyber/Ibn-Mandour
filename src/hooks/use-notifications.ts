import { create } from "zustand"
import { persist } from "zustand/middleware"

type Notification = {
  id: string
  type: string
  title: string
  body?: string
  read: boolean
  createdAt: string
}

type NotificationStore = {
  notifications: Notification[]
  unreadCount: number
  addNotification: (n: Notification) => void
  markRead: (id: string) => void
  markAllRead: () => void
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,
      addNotification: (n) =>
        set((state) => ({
          notifications: [n, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        })),
      markRead: (id) =>
        set((state) => {
          const notifications = state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          )
          return {
            notifications,
            unreadCount: notifications.filter((n) => !n.read).length,
          }
        }),
      markAllRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        })),
    }),
    { name: "notifications" }
  )
)
