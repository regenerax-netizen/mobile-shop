import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Only allow the admin email defined in env
      const adminEmail = process.env.ADMIN_EMAIL;
      return user.email === adminEmail;
    },
    async session({ session }) {
      return session;
    },
  },
  pages: {
    signIn: "/admin",
    error: "/admin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
