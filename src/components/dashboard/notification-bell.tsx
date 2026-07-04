"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { io } from "socket.io-client"

export function NotificationBell() {
  const c = useTranslations("common")
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter((n) => !n.read).length

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications")
      setNotifications(await res.json())
    } catch {}
  }, [])

  useEffect(() => {
    load()
    const interval = setInterval(load, 30000)
    return () => clearInterval(interval)
  }, [load])

  useEffect(() => {
    const userId = session?.user?.id
    if (!userId) return
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001", {
      auth: { userId },
      transports: ["websocket", "polling"],
    })
    socket.on("connect", () => socket.emit("join:room", `user:${userId}`))
    socket.on("notification:new", (n: any) => {
      setNotifications((prev) => [{ ...n, read: false }, ...prev])
    })
    return () => { socket.disconnect() }
  }, [session?.user?.id])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  async function markRead(id: string) {
    await fetch("/api/notifications", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  async function markAllRead() {
    await fetch("/api/notifications", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    })
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-gray-500 hover:text-[#d4b45a] transition-colors"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-[#0a0a0a] border border-[#1c1c1c] rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#1c1c1c]">
            <span className="text-sm text-gray-400 font-medium">
              {unreadCount > 0 ? `${unreadCount} non lu${unreadCount > 1 ? "s" : ""}` : "Aucune notification"}
            </span>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs text-[#d4b45a] hover:underline">
                Tout marquer lu
              </button>
            )}
          </div>
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-gray-500 text-sm">{c("noData")}</div>
          ) : (
            notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`w-full text-left px-4 py-3 border-b border-[#1c1c1c] hover:bg-[#0f0f0f] transition-colors ${
                  !n.read ? "bg-[rgba(212,180,90,0.04)]" : ""
                }`}
              >
                <p className={`text-sm ${!n.read ? "text-white font-medium" : "text-gray-400"}`}>
                  {n.title}
                </p>
                {n.body && <p className="text-xs text-gray-500 mt-0.5">{n.body}</p>}
                <p className="text-[10px] text-gray-600 mt-1">
                  {new Date(n.createdAt).toLocaleDateString()}
                </p>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
