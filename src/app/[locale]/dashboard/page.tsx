import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function DashboardHome() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const t = await getTranslations("dashboard")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      studentProfile: { include: { grades: { take: 5, orderBy: { createdAt: "desc" } }, attendance: { take: 10, orderBy: { date: "desc" } } } },
      teacherProfile: true,
      adminProfile: true,
    },
  })
  if (!user) redirect("/login")

  const isTeacherOrAdmin = ["TEACHER", "ADMIN"].includes(user.role)
  const grades = user?.studentProfile?.grades || []
  const attendance = user?.studentProfile?.attendance || []
  const presentCount = attendance.filter((a: any) => a.status === "present").length
  const attendanceRate = attendance.length ? Math.round((presentCount / attendance.length) * 100) : 0

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-serif text-[#d4b45a] mb-1">{t("title")}</h1>
      <p className="text-gray-500 mb-8">{t("welcome", { name: session.user.name })}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard value={grades.length} label={t("recentGrades")} color="from-[#006233] to-[#00884a]" />
        <StatCard value={`${attendanceRate}%`} label={t("attendanceSummary")} color="from-[#d4b45a] to-[#b8963a]" />
        <StatCard value="3" label={t("upcomingEvents")} color="from-[#8b1c20] to-[#6e1417]" />
        <StatCard value={isTeacherOrAdmin ? "Gérer" : "Consulter"} label={t("quickActions")} color="from-[#006233] to-[#00884a]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0f0f0f] border border-[#1c1c1c] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-serif text-[#d4b45a]">{t("recentGrades")}</h2>
            <Link href="/dashboard/grades" className="text-xs text-[#00884a] hover:text-[#d4b45a] transition-colors">Voir tout</Link>
          </div>
          {grades.length > 0 ? (
            <div className="space-y-3">
              {grades.map((grade: any) => (
                <div key={grade.id} className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-lg border border-[#1c1c1c] hover:border-[rgba(0,98,51,0.2)] hover:translate-x-1 transition-all">
                  <div>
                    <p className="text-sm font-medium text-[#ececec]">{grade.subject}</p>
                    <p className="text-xs text-gray-500">{grade.type}</p>
                  </div>
                  <span className="text-lg font-bold text-[#d4b45a]">{grade.score}/{grade.maxScore}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Aucune note</p>
          )}
        </div>

        <div className="bg-[#0f0f0f] border border-[#1c1c1c] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-serif text-[#d4b45a]">Annonces</h2>
            <Link href="/dashboard/announcements" className="text-xs text-[#00884a] hover:text-[#d4b45a] transition-colors">Voir tout</Link>
          </div>
          <p className="text-gray-500 text-sm">Aucune annonce</p>
        </div>
      </div>
    </div>
  )
}

function StatCard({ value, label, color }: { value: string | number; label: string; color: string }) {
  return (
    <div className="bg-[#0f0f0f] border border-[#1c1c1c] rounded-xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(212,180,90,0.1)]">
      <div className={`h-1 rounded-full bg-gradient-to-r ${color} mb-4 w-12`} />
      <p className="text-2xl font-bold text-[#d4b45a] font-serif">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  )
}
