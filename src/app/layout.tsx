import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Lycée Ibn Mandour",
  description: "Plateforme de gestion scolaire",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#050505] text-white">
        {children}
      </body>
    </html>
  )
}
