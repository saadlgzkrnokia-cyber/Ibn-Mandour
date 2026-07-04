const RESEND_API_KEY = process.env.RESEND_API_KEY

type EmailInput = {
  to: string
  subject: string
  html: string
}

export async function sendEmail(input: EmailInput) {
  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set — skipping email")
    return
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Lycée Ibn Mandour <noreply@ibnmandour.ma>",
        to: input.to,
        subject: input.subject,
        html: input.html,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error("Resend error:", err)
    }
  } catch (e) {
    console.error("Failed to send email:", e)
  }
}

export function gradeEmailHtml(studentName: string, subject: string, score: number): string {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color: #d4b45a;">Nouvelle note - Lycée Ibn Mandour</h2>
      <p>Bonjour ${studentName},</p>
      <p>Une nouvelle note a été ajoutée :</p>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px; border: 1px solid #ddd;">Matière</td><td style="padding: 8px; border: 1px solid #ddd;">${subject}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd;">Note</td><td style="padding: 8px; border: 1px solid #ddd;">${score}/20</td></tr>
      </table>
    </div>
  `
}
