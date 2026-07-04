import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/shell"
import { Providers } from "@/components/providers"
import { prisma } from "@/lib/prisma"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, firstName: true, lastName: true, role: true, email: true, avatar: true },
  })

  if (!user) redirect("/login")

  return (
    <Providers>
      <DashboardShell user={user}>{children}</DashboardShell>
    </Providers>
  )
}
