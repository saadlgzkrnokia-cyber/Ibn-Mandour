"use client"

import { useEffect, useRef, useCallback } from "react"
import { io, Socket } from "socket.io-client"
import { useSession } from "next-auth/react"

type NotificationEvent = {
  id: string
  type: string
  title: string
  body?: string
  data?: any
  createdAt: string
}

type SocketEventMap = {
  "notification:new": (notification: NotificationEvent) => void
  "grade:created": (data: any) => void
  "attendance:marked": (data: any) => void
  "message:new": (data: any) => void
  "announcement:new": (data: any) => void
}

export function useSocket() {
  const socketRef = useRef<Socket | null>(null)
  const { data: session } = useSession()

  useEffect(() => {
    const userId = session?.user?.id
    if (!userId) return

    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001", {
      auth: { userId },
      transports: ["websocket", "polling"],
    })

    socket.on("connect", () => {
      socket.emit("join:room", `user:${userId}`)
    })

    socketRef.current = socket

    return () => {
      socket.disconnect()
    }
  }, [session?.user?.id])

  const on = useCallback(<K extends keyof SocketEventMap>(
    event: K,
    handler: SocketEventMap[K]
  ) => {
    socketRef.current?.on(event, handler as any)
    return () => {
      socketRef.current?.off(event, handler as any)
    }
  }, [])

  const emit = useCallback((event: string, data?: any) => {
    socketRef.current?.emit(event, data)
  }, [])

  return { socket: socketRef.current, on, emit }
}
