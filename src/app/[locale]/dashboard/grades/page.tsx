"use client"

import { useTranslations } from "next-intl"
import { useState, useEffect } from "react"

type Grade = {
  id: string
  subject: string
  type: string
  score: number
  maxScore: number
  coefficient: number
  semester: string
  comment: string | null
  createdAt: string
  student?: { user: { firstName: string; lastName: string } }
}

export default function GradesPage() {
  const t = useTranslations("grades")
  const c = useTranslations("common")
  const [grades, setGrades] = useState<Grade[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/grades")
      .then((r) => r.json())
      .then(setGrades)
      .finally(() => setLoading(false))
  }, [])

  const average = grades.length
    ? (grades.reduce((a, g) => a + (g.score / g.maxScore) * 20 * g.coefficient, 0) /
        grades.reduce((a, g) => a + g.coefficient, 0))
    : 0

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif text-[#d4b45a]">{t("title")}</h1>
          {grades.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              {t("average")}: <span className="text-[#d4b45a] font-semibold">{average.toFixed(2)}/20</span>
            </p>
          )}
        </div>
      </div>

      {loading ? (
          <p className="text-gray-500">{c("loading")}</p>
     ) : grades.length === 0 ? (
          <div className="text-center py-16 bg-[#0f0f0f] border border-[#1c1c1c] rounded-xl">
            <p className="text-gray-500">{c("noData")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {grades.map((grade) => (
            <div
              key={grade.id}
              className="bg-[#0f0f0f] border border-[#1c1c1c] rounded-xl p-4 sm:p-5
                         transition-all duration-300 hover:border-[rgba(0,98,51,0.15)] hover:translate-x-1"
            >
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="font-medium text-[#ececec]">{grade.subject}</h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                    <span className="uppercase">{grade.type}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-600" />
                    <span>{grade.semester}</span>
                    {grade.student && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-gray-600" />
                        <span>{grade.student.user.firstName} {grade.student.user.lastName}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-[#d4b45a]">
                    {grade.score}/{grade.maxScore}
                  </span>
                  <p className="text-xs text-gray-500">coeff {grade.coefficient}</p>
                </div>
              </div>
              {grade.comment && (
                <p className="text-sm text-gray-500 mt-2 pt-2 border-t border-[#1c1c1c]">{grade.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
