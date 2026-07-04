"use client"

import { useState, useEffect, useCallback } from "react"
import { useTranslations } from "next-intl"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface EventItem {
  id: string
  title: string
  description: string | null
  date: string
  endDate: string | null
  location: string | null
  target: string
  createdAt: string
}

export default function EventsPage() {
  const t = useTranslations("nav")
  const c = useTranslations("common")
  const ce = useTranslations("events")
  const { data: session } = useSession()
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [location, setLocation] = useState("")
  const [target, setTarget] = useState("all")
  const [saving, setSaving] = useState(false)
  const [view, setView] = useState<"list" | "calendar">("list")

  const canManage = session?.user && ["ADMIN", "TEACHER"].includes(session.user.role)

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/events")
      setEvents(await res.json())
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
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, date, endDate: endDate || undefined, location, target }),
      })
      if (!res.ok) throw new Error()
      toast.success(c("success"))
      setTitle("")
      setDescription("")
      setDate("")
      setEndDate("")
      setLocation("")
      setTarget("all")
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
      await fetch(`/api/events?id=${id}`, { method: "DELETE" })
      toast.success(c("success"))
      load()
    } catch {
      toast.error(c("error"))
    }
  }

  // Group by month
  const grouped = events.reduce<Record<string, EventItem[]>>((acc, ev) => {
    const month = new Date(ev.date).toLocaleDateString(undefined, { year: "numeric", month: "long" })
    if (!acc[month]) acc[month] = []
    acc[month].push(ev)
    return acc
  }, {})

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif text-[#d4b45a]">{t("events")}</h1>
        <div className="flex items-center gap-2">
          <Button variant={view === "list" ? "default" : "outline"} size="sm" onClick={() => setView("list")}>
            {ce("listView")}
          </Button>
          <Button variant={view === "calendar" ? "default" : "outline"} size="sm" onClick={() => setView("calendar")}>
            {ce("calendarView")}
          </Button>
          {canManage && (
            <Dialog>
              <DialogTrigger asChild>
                <Button>{ce("addEvent")}</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{ce("addEvent")}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input placeholder={ce("title")} value={title} onChange={e => setTitle(e.target.value)} />
                  <Textarea placeholder={ce("description")} value={description} onChange={e => setDescription(e.target.value)} rows={3} />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-500">{ce("date")}</label>
                      <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">{ce("endDate")}</label>
                      <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                    </div>
                  </div>
                  <Input placeholder={ce("location")} value={location} onChange={e => setLocation(e.target.value)} />
                  <Select value={target} onValueChange={(v) => v && setTarget(v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{ce("targetAll")}</SelectItem>
                      <SelectItem value="students">{ce("targetStudents")}</SelectItem>
                      <SelectItem value="teachers">{ce("targetTeachers")}</SelectItem>
                      <SelectItem value="parents">{ce("targetParents")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={create} disabled={saving}>
                    {saving ? c("loading") : c("save")}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-500">{c("loading")}</div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 bg-[#0f0f0f] border border-[#1c1c1c] rounded-xl">
          <p className="text-gray-500">{c("noData")}</p>
        </div>
      ) : view === "calendar" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map(ev => {
            const d = new Date(ev.date)
            return (
              <Card key={ev.id} className="bg-[#0f0f0f] border-[#1c1c1c]">
                <CardHeader className="pb-2">
                  <div className="text-center mb-2">
                    <div className="text-2xl font-bold text-[#d4b45a]">{d.getDate()}</div>
                    <div className="text-xs text-gray-500">{d.toLocaleDateString(undefined, { month: "short", year: "numeric" })}</div>
                  </div>
                  <CardTitle className="text-white text-base text-center">{ev.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-1">
                  {ev.description && <p className="text-gray-400 text-sm">{ev.description}</p>}
                  {ev.location && <p className="text-gray-500 text-xs">📍 {ev.location}</p>}
                  {canManage && (
                    <Button variant="ghost" size="sm" onClick={() => remove(ev.id)} className="text-red-400 mt-2">
                      ✕ {c("delete")}
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([month, monthEvents]) => (
            <div key={month}>
              <h2 className="text-lg font-medium text-[#d4b45a] mb-3">{month}</h2>
              <div className="space-y-2">
                {monthEvents.map(ev => (
                  <Card key={ev.id} className="bg-[#0f0f0f] border border-[#1c1c1c]">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="text-center min-w-[48px]">
                        <div className="text-xl font-bold text-[#d4b45a]">{new Date(ev.date).getDate()}</div>
                        <div className="text-xs text-gray-500">{new Date(ev.date).toLocaleDateString(undefined, { month: "short" })}</div>
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{ev.title}</p>
                        {ev.description && <p className="text-gray-400 text-sm">{ev.description}</p>}
                        {ev.location && <p className="text-gray-500 text-xs mt-1">📍 {ev.location}</p>}
                      </div>
                      {canManage && (
                        <Button variant="ghost" size="sm" onClick={() => remove(ev.id)} className="text-red-400">
                          ✕
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
