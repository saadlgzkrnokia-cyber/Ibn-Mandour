import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Lycée Ibn Mandour",
  description: "Plateforme de gestion scolaire",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" dir="ltr" suppressHydrationWarning>
      <body className="min-h-screen bg-[#050505] text-[#ececec] antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var path = window.location.pathname;
                var match = path.match(/^\\/(ar|ar\\/)/);
                if (match) {
                  document.documentElement.dir = "rtl";
                  document.documentElement.lang = "ar";
                }
              })();
            `,
          }}
        />
        {children}
      </body>
    </html>
  )
}
