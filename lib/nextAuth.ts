import { AuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import {prisma} from "../lib/prismadb"
export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
      GitHubProvider({
        clientId: (process.env.NODE_ENV === 'production' 
          ? process.env.GITHUB_CLIENT_ID_PROD 
          : process.env.GITHUB_CLIENT_ID_DEV) as string,
        clientSecret: (process.env.NODE_ENV === 'production'
          ? process.env.GITHUB_CLIENT_SECRET_PROD 
          : process.env.GITHUB_CLIENT_SECRET_DEV) as string,
      }),
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      }),
    ],
    pages:{
      signIn: '/sign-in'
    },
    secret: process.env.NEXTAUTH_SECRET,
  };