import NextAuth, { User as NextAuthUser, Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";

interface User extends NextAuthUser {
  id: string;
  username: string;
  avatar: string;
  userToken: string;
  role: string | null;
}

interface DecodedToken {
  id: string | number;
  role: string | null;
}

interface CustomSession extends Session {
  user: Session["user"] & {
    id: string;
    avatar: string;
    role: string | null;
  };
  userToken: string;
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials): Promise<User | null> {
        if (!credentials) return null;

        const user: User = {
          id: credentials.id as string,
          name: credentials.username as string,
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
    maxAge: 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.username;
        token.username = user.username;
        token.email = user.email;
        token.avatar = user.avatar;
        token.userToken = user.userToken;

        try {
          const decoded: DecodedToken = jwtDecode<DecodedToken>(
            user.userToken as string
          );

          token.id = decoded.id || 0;
          token.role = decoded.role || null;
        } catch (error) {
          console.error("Failed to decode JWT:", error);
          token.role = null;
          token.id = 0;
        }
      }
      return token;
    },
    async session({ token, session }) {
      session.user = {
        ...session.user,
        name:
          typeof token.name === "string"
            ? token.name
            : (token.username as string),
        id: `${token.id ?? ""}`,
        email: token.email as string,
        avatar: token.avatar as string,
        role: token.role as string | null,
      };
      const customSession = session as CustomSession;
      customSession.userToken = token.userToken as string;
      return customSession;
    },
  },
});
