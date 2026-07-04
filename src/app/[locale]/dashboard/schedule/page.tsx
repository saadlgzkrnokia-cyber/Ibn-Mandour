"use client"

import { useTranslations } from "next-intl"
import { useState, useEffect } from "react"

type ScheduleEntry = {
  id: string
  class: string
  subject: string
  dayOfWeek: number
  startTime: string
  endTime: string
  room: string | null
}

const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]

export default function SchedulePage() {
  const t = useTranslations("schedule")
  const [entries, setEntries] = useState<ScheduleEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/schedules")
      .then((r) => r.json())
      .then(setEntries)
      .finally(() => setLoading(false))
  }, [])

  const grouped = days.map((_, i) => ({
    day: i,
    entries: entries.filter((e) => e.dayOfWeek === i).sort((a, b) => a.startTime.localeCompare(b.startTime)),
  }))

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-serif text-[#d4b45a] mb-8">{t("title")}</h1>

      {loading ? (
        <p className="text-gray-500">{t("loading")}</p>
      ) : entries.length === 0 ? (
        <div className="text-center py-16 bg-[#0f0f0f] border border-[#1c1c1c] rounded-xl">
          <p className="text-gray-500">{t("noData")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {grouped.map(({ day, entries: dayEntries }) => (
            <div key={day} className="bg-[#0f0f0f] border border-[#1c1c1c] rounded-xl overflow-hidden">
              <div className="bg-[rgba(0,98,51,0.06)] px-4 py-3 border-b border-[#1c1c1c]">
                <h3 className="text-sm font-semibold text-[#d4b45a]">{t(days[day] as any)}</h3>
              </div>
              <div className="p-3 space-y-2 min-h-[200px]">
                {dayEntries.length === 0 ? (
                  <p className="text-xs text-gray-600 text-center py-4">—</p>
                ) : (
                  dayEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="bg-[#0a0a0a] border border-[#1c1c1c] rounded-lg p-3
                                 transition-all duration-200 hover:border-[rgba(212,180,90,0.1)]"
                    >
                      <p className="text-sm font-medium text-[#ececec]">{entry.subject}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {entry.startTime} — {entry.endTime}
                      </p>
                      {entry.room && <p className="text-xs text-gray-600 mt-0.5">Salle {entry.room}</p>}
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
