import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "ZildX Secure Login",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // LOGIN BYPASS OWNER
        if (credentials.username === "ZILDJIAN" && credentials.password === "admin123") {
          return { id: "1", name: "ZILDJIAN", email: "owner@zildx.com", role: "owner" };
        }
        return null;
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.role = "owner"; // Force owner role
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET, // Wajib ada di Vercel Env
  pages: {
    signIn: '/', // Redirect ke halaman depan kalau belum login
  }
});

export { handler as GET, handler as POST };
