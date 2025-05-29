import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      username?: string;
      email: string;
      avatar?: string;
      role?: string | null;    // tambahkan role di sini
    };
    userToken?: string;
  }

  interface JWT {
    username?: string;
    email: string;
    avatar?: string;
    role?: string | null;     // juga di User (opsional)
    userToken?: string;
  }

  interface User {
    username?: string;
    email: string;
    avatar?: string;
    role?: string | null;     // juga di JWT
    userToken?: string;
  }
}
