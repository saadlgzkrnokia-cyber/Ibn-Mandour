"use client"

import { useState, useEffect, useCallback } from "react"
import { useTranslations } from "next-intl"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface Message {
  id: string
  sender: { id: string; firstName: string; lastName: string; role: string }
  receiver: { id: string; firstName: string; lastName: string; role: string }
  subject: string | null
  body: string
  readAt: string | null
  createdAt: string
}

export default function MessagesPage() {
  const t = useTranslations("nav")
  const c = useTranslations("common")
  const cm = useTranslations("messages")
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<{ id: string; firstName: string; lastName: string; role: string }[]>([])
  const [receiverId, setReceiverId] = useState("")
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [sending, setSending] = useState(false)
  const [selectedMsg, setSelectedMsg] = useState<Message | null>(null)

  const loadMessages = useCallback(async () => {
    try {
      const res = await fetch("/api/messages")
      const data = await res.json()
      setMessages(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadMessages() }, [loadMessages])

  useEffect(() => {
    fetch("/api/users").then(r => r.json()).then(setUsers).catch(() => {})
  }, [])

  async function sendMessage() {
    if (!receiverId || !body) return
    setSending(true)
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId, subject, body }),
      })
      if (!res.ok) throw new Error()
      toast.success(c("success"))
      setReceiverId("")
      setSubject("")
      setBody("")
      loadMessages()
    } catch {
      toast.error(c("error"))
    } finally {
      setSending(false)
    }
  }

  async function markRead(id: string) {
    await fetch(`/api/messages?id=${id}`, { method: "PUT" })
    setMessages(prev => prev.map(m => m.id === id ? { ...m, readAt: new Date().toISOString() } : m))
  }

  const unread = messages.filter(m => m.receiver.id === session?.user?.id && !m.readAt)
  const sent = messages.filter(m => m.sender.id === session?.user?.id)
  const received = messages.filter(m => m.receiver.id === session?.user?.id)

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif text-[#d4b45a]">{t("messages")}</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>{cm("newMessage")}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{cm("newMessage")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Select value={receiverId} onValueChange={(v) => v && setReceiverId(v)}>
                <SelectTrigger><SelectValue placeholder={cm("selectRecipient")} /></SelectTrigger>
                <SelectContent>
                  {users.filter(u => u.id !== session?.user?.id).map(u => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.firstName} {u.lastName} ({u.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input placeholder={cm("subject")} value={subject} onChange={e => setSubject(e.target.value)} />
              <Textarea placeholder={cm("messageBody")} value={body} onChange={e => setBody(e.target.value)} rows={5} />
              <Button onClick={sendMessage} disabled={sending}>
                {sending ? c("loading") : c("send")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-500">{c("loading")}</div>
      ) : (
        <div className="grid gap-6">
          {unread.length > 0 && (
            <div>
              <h2 className="text-lg font-medium text-white mb-3">{cm("unread")} ({unread.length})</h2>
              <div className="space-y-2">
                {unread.map(msg => (
                  <Card key={msg.id} className="bg-[#0f0f0f] border-[#d4b45a]/30 cursor-pointer" onClick={() => { setSelectedMsg(msg); markRead(msg.id) }}>
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#d4b45a]" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">
                          {msg.sender.firstName} {msg.sender.lastName}
                        </p>
                        {msg.subject && <p className="text-gray-400 text-sm truncate">{msg.subject}</p>}
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-lg font-medium text-white mb-3">{cm("conversations")}</h2>
            {received.filter(m => m.readAt).length === 0 && sent.length === 0 ? (
              <div className="text-center py-16 bg-[#0f0f0f] border border-[#1c1c1c] rounded-xl">
                <p className="text-gray-500">{c("noData")}</p>
              </div>
            ) : (
              <div className="space-y-2">
                {[...received.filter(m => m.readAt), ...sent]
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map(msg => (
                    <Card key={msg.id} className="bg-[#0f0f0f] border-[#1c1c1c] cursor-pointer" onClick={() => setSelectedMsg(msg)}>
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-300 font-medium truncate">
                            {msg.sender.id === session?.user?.id
                              ? `${cm("to")} ${msg.receiver.firstName} ${msg.receiver.lastName}`
                              : `${msg.sender.firstName} ${msg.sender.lastName}`}
                          </p>
                          {msg.subject && <p className="text-gray-500 text-sm truncate">{msg.subject}</p>}
                          <p className="text-gray-600 text-sm truncate">{msg.body}</p>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </span>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      <Dialog open={!!selectedMsg} onOpenChange={(open) => !open && setSelectedMsg(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedMsg?.sender.id === session?.user?.id
                ? `${cm("to")} ${selectedMsg?.receiver.firstName} ${selectedMsg?.receiver.lastName}`
                : `${selectedMsg?.sender.firstName} ${selectedMsg?.sender.lastName}`}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedMsg?.subject && <p className="font-medium text-white">{selectedMsg.subject}</p>}
            <p className="text-gray-300 whitespace-pre-wrap">{selectedMsg?.body}</p>
            <p className="text-xs text-gray-500">
              {selectedMsg && new Date(selectedMsg.createdAt).toLocaleString()}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
