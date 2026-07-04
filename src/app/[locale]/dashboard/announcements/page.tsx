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

interface Announcement {
  id: string
  title: string
  body: string
  target: string
  pinned: boolean
  author: { firstName: string; lastName: string; role: string }
  createdAt: string
}

export default function AnnouncementsPage() {
  const t = useTranslations("nav")
  const c = useTranslations("common")
  const ca = useTranslations("announcements")
  const { data: session } = useSession()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [target, setTarget] = useState("all")
  const [pinned, setPinned] = useState(false)
  const [saving, setSaving] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  const canManage = session?.user && ["ADMIN", "TEACHER"].includes(session.user.role)

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/announcements")
      setAnnouncements(await res.json())
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function create() {
    if (!title || !body) return
    setSaving(true)
    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, target, pinned }),
      })
      if (!res.ok) throw new Error()
      toast.success(c("success"))
      setTitle("")
      setBody("")
      setTarget("all")
      setPinned(false)
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
      await fetch(`/api/announcements?id=${id}`, { method: "DELETE" })
      toast.success(c("success"))
      load()
    } catch {
      toast.error(c("error"))
    }
  }

  async function togglePin(id: string, current: boolean) {
    try {
      await fetch(`/api/announcements?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pinned: !current }),
      })
      load()
    } catch {
      toast.error(c("error"))
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif text-[#d4b45a]">{t("announcements")}</h1>
        {canManage && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>{ca("publish")}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{ca("publish")}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input placeholder={ca("title")} value={title} onChange={e => setTitle(e.target.value)} />
                <Textarea placeholder={ca("body")} value={body} onChange={e => setBody(e.target.value)} rows={5} />
                <Select value={target} onValueChange={(v) => v && setTarget(v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{ca("targetAll")}</SelectItem>
                    <SelectItem value="students">{ca("targetStudents")}</SelectItem>
                    <SelectItem value="teachers">{ca("targetTeachers")}</SelectItem>
                    <SelectItem value="parents">{ca("targetParents")}</SelectItem>
                  </SelectContent>
                </Select>
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <input type="checkbox" checked={pinned} onChange={e => setPinned(e.target.checked)} />
                  {ca("pin")}
                </label>
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
      ) : announcements.length === 0 ? (
        <div className="text-center py-16 bg-[#0f0f0f] border border-[#1c1c1c] rounded-xl">
          <p className="text-gray-500">{c("noData")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map(a => (
            <Card key={a.id} className={`bg-[#0f0f0f] border ${a.pinned ? "border-[#d4b45a]/50" : "border-[#1c1c1c]"}`}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {a.pinned && <Badge variant="outline" className="text-[#d4b45a] border-[#d4b45a]/50">{ca("pinned")}</Badge>}
                    <CardTitle className="text-white text-lg">{a.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-1">
                    {canManage && (
                      <>
                        <Button variant="ghost" size="sm" onClick={() => togglePin(a.id, a.pinned)}>
                          📌
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => remove(a.id)} className="text-red-400">
                          ✕
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  {a.author.firstName} {a.author.lastName} · {new Date(a.createdAt).toLocaleDateString()} · {ca(`target_${a.target}` as any) || a.target}
                </p>
              </CardHeader>
              <CardContent>
                <p className={`text-gray-400 ${expanded !== a.id ? "line-clamp-3" : ""}`}>{a.body}</p>
                {a.body.length > 200 && (
                  <button
                    className="text-[#d4b45a] text-sm mt-1"
                    onClick={() => setExpanded(expanded === a.id ? null : a.id)}
                  >
                    {expanded === a.id ? c("showLess") : c("showMore")}
                  </button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
