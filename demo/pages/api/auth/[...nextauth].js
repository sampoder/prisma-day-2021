import NextAuth from "next-auth"
import Providers from "next-auth/providers"
import Adapters from "next-auth/adapters"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

function GitHub(options) {
  return {
    id: "github",
    name: "GitHub",
    type: "oauth",
    version: "2.0",
    scope: "user",
    accessTokenUrl: "https://github.com/login/oauth/access_token",
    authorizationUrl: "https://github.com/login/oauth/authorize",
    profileUrl: "https://api.github.com/user",
    profile(profile) {
      return {
        id: profile.id,
        name: profile.login,
        email: profile.email,
        image: profile.avatar_url
      }
    },
    ...options,
  }
}

export default NextAuth({
  providers: [
   GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
  ],
  adapter: Adapters.Prisma.Adapter({ prisma}),
})