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
import { toast } from "sonner"

interface Meeting {
  id: string
  teacher: { user: { firstName: string; lastName: string } }
  title: string
  description: string | null
  date: string
  duration: number
  meetLink: string
  participants: string[]
  attachments: string[]
  createdAt: string
}

export default function MeetingsPage() {
  const t = useTranslations("nav")
  const c = useTranslations("common")
  const cm = useTranslations("meetings")
  const { data: session } = useSession()
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [duration, setDuration] = useState("60")
  const [meetLink, setMeetLink] = useState("")
  const [saving, setSaving] = useState(false)

  const isTeacher = session?.user?.role === "TEACHER"

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/meetings")
      setMeetings(await res.json())
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function create() {
    if (!title || !date) return
    setSaving(true)
    try {
      const res = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, date, duration: parseInt(duration), meetLink: meetLink || undefined }),
      })
      if (!res.ok) throw new Error()
      toast.success(c("success"))
      setTitle("")
      setDescription("")
      setDate("")
      setDuration("60")
      setMeetLink("")
      load()
    } catch {
      toast.error(c("error"))
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: string) {
    if (!confirm(c("confirm"))) return
    try {
      await fetch(`/api/meetings?id=${id}`, { method: "DELETE" })
      toast.success(c("success"))
      load()
    } catch {
      toast.error(c("error"))
    }
  }

  const upcoming = meetings.filter(m => new Date(m.date) >= new Date())
  const past = meetings.filter(m => new Date(m.date) < new Date())

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif text-[#d4b45a]">{t("meetings")}</h1>
        {isTeacher && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>{cm("schedule")}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{cm("schedule")}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input placeholder={cm("meetingTitle")} value={title} onChange={e => setTitle(e.target.value)} />
                <Textarea placeholder={cm("description")} value={description} onChange={e => setDescription(e.target.value)} rows={3} />
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-500">{cm("dateTime")}</label>
                    <Input type="datetime-local" value={date} onChange={e => setDate(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">{cm("duration")}</label>
                    <Input type="number" value={duration} onChange={e => setDuration(e.target.value)} min="15" step="15" />
                  </div>
                </div>
                <Input placeholder={cm("meetLinkOptional")} value={meetLink} onChange={e => setMeetLink(e.target.value)} />
                <p className="text-xs text-gray-500">{cm("autoGenerateHint")}</p>
                <Button onClick={create} disabled={saving}>
                  {saving ? c("loading") : c("save")}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-500">{c("loading")}</div>
      ) : meetings.length === 0 ? (
        <div className="text-center py-16 bg-[#0f0f0f] border border-[#1c1c1c] rounded-xl">
          <p className="text-gray-500">{c("noData")}</p>
        </div>
      ) : (
        <div className="space-y-8">
          {upcoming.length > 0 && (
            <div>
              <h2 className="text-lg font-medium text-white mb-3">{cm("upcoming")}</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {upcoming.map(m => (
                  <Card key={m.id} className="bg-[#0f0f0f] border-[#d4b45a]/30">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-white">{m.title}</CardTitle>
                        <Badge className="bg-[#d4b45a]/20 text-[#d4b45a]">{m.duration}min</Badge>
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(m.date).toLocaleString()}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {m.description && <p className="text-gray-400 text-sm">{m.description}</p>}
                      <a
                        href={m.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#d4b45a] hover:underline text-sm"
                      >
                        🔗 {cm("joinMeet")}
                      </a>
                      {isTeacher && (
                        <Button variant="ghost" size="sm" onClick={() => remove(m.id)} className="text-red-400 block mt-2">
                          {c("delete")}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {past.length > 0 && (
            <div>
              <h2 className="text-lg font-medium text-white mb-3">{cm("past")}</h2>
              <div className="space-y-2">
                {past.map(m => (
                  <Card key={m.id} className="bg-[#0f0f0f] border-[#1c1c1c] opacity-70">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-gray-300 font-medium">{m.title}</p>
                        <p className="text-xs text-gray-500">{new Date(m.date).toLocaleString()}</p>
                      </div>
                      <Badge variant="outline" className="text-gray-500">{cm("ended")}</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
