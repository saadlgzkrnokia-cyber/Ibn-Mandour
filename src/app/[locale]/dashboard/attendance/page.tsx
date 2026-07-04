"use client"

import { useTranslations } from "next-intl"
import { useState, useEffect } from "react"

type Attendance = {
  id: string
  date: string
  status: string
  subject: string | null
  justification: string | null
  student?: { user: { firstName: string; lastName: string } }
}

const statusColors: Record<string, string> = {
  present: "bg-[rgba(0,98,51,0.12)] text-[#00884a]",
  absent: "bg-[rgba(139,28,32,0.12)] text-[#8b1c20]",
  late: "bg-[rgba(212,180,90,0.12)] text-[#d4b45a]",
  excused: "bg-[rgba(0,98,51,0.06)] text-gray-400",
}

export default function AttendancePage() {
  const t = useTranslations("attendance")
  const c = useTranslations("common")
  const [records, setRecords] = useState<Attendance[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/attendance")
      .then((r) => r.json())
      .then(setRecords)
      .finally(() => setLoading(false))
  }, [])

  const presentCount = records.filter((r) => r.status === "present").length
  const rate = records.length ? Math.round((presentCount / records.length) * 100) : 0

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif text-[#d4b45a]">{t("title")}</h1>
          {records.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              {t("rate")}: <span className="text-[#00884a] font-semibold">{rate}%</span>
            </p>
          )}
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">{c("loading")}</p>
      ) : records.length === 0 ? (
        <div className="text-center py-16 bg-[#0f0f0f] border border-[#1c1c1c] rounded-xl">
          <p className="text-gray-500">{c("noData")}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {records.map((record) => (
            <div
              key={record.id}
              className="bg-[#0f0f0f] border border-[#1c1c1c] rounded-xl p-4
                         flex items-center justify-between flex-wrap gap-3
                         transition-all duration-300 hover:border-[rgba(0,98,51,0.15)]"
            >
              <div className="flex items-center gap-4">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase ${statusColors[record.status] || ""}`}>
                  {t(record.status as any)}
                </span>
                <div>
                  <p className="text-sm text-[#ececec]">
                    {new Date(record.date).toLocaleDateString()}
                    {record.subject && <span className="text-gray-500"> — {record.subject}</span>}
                  </p>
                  {record.justification && (
                    <p className="text-xs text-gray-500 mt-0.5">{t("justification")}: {record.justification}</p>
                  )}
                </div>
              </div>
              {record.student && (
                <span className="text-xs text-gray-500">
                  {record.student.user.firstName} {record.student.user.lastName}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
