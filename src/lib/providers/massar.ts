import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers"

export interface MassarProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  massarId: string
  role: "STUDENT" | "PARENT"
  class?: string
}

export function MassarProvider<P extends MassarProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "massar",
    name: "Massar",
    type: "oauth",
    wellKnown: `${process.env.MASSAR_ISSUER}/.well-known/openid-configuration`,
    authorization: {
      params: { scope: "openid email profile massar" },
    },
    clientId: process.env.MASSAR_CLIENT_ID!,
    clientSecret: process.env.MASSAR_CLIENT_SECRET!,
    profile(profile: P) {
      return {
        id: profile.massarId,
        massarId: profile.massarId,
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        role: profile.role,
        image: null,
      }
    },
  }
}
