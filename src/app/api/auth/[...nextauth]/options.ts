import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnection from "@/lib/dbConnection";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: { username: string; password: string } | undefined,
      ): Promise<unknown> {
        await dbConnection();
        try {
          if (!credentials?.username || !credentials?.password) {
            throw new Error("Username and password are required");
          }

          const user = await UserModel.findOne({
            $or: [
              { username: credentials.username },
              { email: credentials.username },
            ],
          });

          if (!user) {
            throw new Error("User Not Found In This Email");
          }
          if (!user.isVerified) {
            throw new Error("First Verify Your Email Then SignIn");
          }
          const isCorrectPassword = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          if (!isCorrectPassword) {
            throw new Error("Invalid Email Or Password");
          }

          return user;
        } catch (error: unknown) {
          throw new Error(
            error instanceof Error ? error.message : "An error occurred",
          );
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user?.email;
        token.username = user?.username;
        token._id = user?._id;
        token.isVerified = user.isVerifield;
        token.isAcceptingMessage = user.isAcceptingMessages;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.email = token?.email;
        session.user.username = token?.username;
        session.user._id = token?._id;
        session.user.isVerified = token.isVerifield;
        session.user.isAcceptingMessage = token.isAcceptingMessages;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
