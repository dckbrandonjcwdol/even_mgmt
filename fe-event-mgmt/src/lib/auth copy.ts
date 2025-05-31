import NextAuth, { User as NextAuthUser } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";

interface User extends NextAuthUser {
  username: string;
  avatar: string;
  userToken: string;
  role: string | null;
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials): Promise<User | null> {
        if (!credentials) return null;

        const user: User = {
          name: credentials.username as string, // digunakan untuk session
          username: credentials.username as string,
          email: credentials.email as string,
          avatar: credentials.avatar as string,
          userToken: credentials.userToken as string,
          role: typeof credentials.role === "string" ? credentials.role : null,
        };

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hour
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.name = user.username;
        token.username = user.username;
        token.email = user.email;
        token.avatar = user.avatar;
        token.userToken = user.userToken;

        try {
          // const decoded: any = jwtDecode(user.userToken);
          const decoded: any = jwtDecode(user.userToken as string);

          
          token.role = decoded.role || null;
        } catch (error) {
          console.error("Failed to decode JWT:", error);
          token.role = null;
        }
      }
      return token;
    },
    async session({ token, session }) {
      session.user = {
        ...session.user,
        name: typeof token.name === "string" ? token.name : (token.username as string),
        email: token.email as string,
        avatar: token.avatar as string,
        role: token.role as string | null,
      };
      (session as any).userToken = token.userToken;
      return session;
    },
  },
});