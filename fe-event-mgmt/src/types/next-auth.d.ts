import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      username?: string;
      email: string;
      avatar?: string;
    };
    userToken?: string;
  }

  interface JWT {
    username?: string;
    email: string;
    avatar?: string;
    userToken?: string;
  }

  interface User {
    username?: string;
    email: string;
    avatar?: string;
    userToken?: string;
  }
}
