"use client"

import { useTranslations } from "next-intl"
import { useState, useEffect } from "react"

type User = {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  language: string
  isActive: boolean
  createdAt: string
  studentProfile?: { massarClass: string; enrollmentYear: number } | null
  teacherProfile?: { subjects: string[]; classes: string[] } | null
}

const roleColors: Record<string, string> = {
  ADMIN: "bg-[rgba(139,28,32,0.12)] text-[#8b1c20]",
  TEACHER: "bg-[rgba(0,98,51,0.12)] text-[#00884a]",
  STUDENT: "bg-[rgba(212,180,90,0.12)] text-[#d4b45a]",
  PARENT: "bg-[rgba(100,100,100,0.12)] text-gray-400",
}

export default function AdminUsersPage() {
  const t = useTranslations("nav")
  const c = useTranslations("common")
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.json())
      .then(setUsers)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-serif text-[#d4b45a] mb-8">{t("admin")}</h1>

      {loading ? (
        <p className="text-gray-500">{c("loading")}</p>
      ) : (
        <div className="bg-[#0f0f0f] border border-[#1c1c1c] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1c1c1c] text-gray-500 text-xs uppercase">
                  <th className="text-left p-4 font-medium">Nom</th>
                  <th className="text-left p-4 font-medium">Email</th>
                  <th className="text-left p-4 font-medium">Rôle</th>
                  <th className="text-left p-4 font-medium hidden sm:table-cell">Classe / Matières</th>
                  <th className="text-left p-4 font-medium hidden md:table-cell">Statut</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-[#1c1c1c] hover:bg-[#0a0a0a] transition-colors">
                    <td className="p-4">
                      <span className="text-[#ececec] font-medium">{user.firstName} {user.lastName}</span>
                    </td>
                    <td className="p-4 text-gray-500">{user.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${roleColors[user.role] || ""}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 hidden sm:table-cell">
                      {user.studentProfile?.massarClass || user.teacherProfile?.subjects?.join(", ") || "—"}
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className={`text-xs ${user.isActive ? "text-[#00884a]" : "text-[#8b1c20]"}`}>
                        {user.isActive ? "Actif" : "Inactif"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
