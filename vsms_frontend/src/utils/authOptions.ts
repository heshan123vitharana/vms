// next
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// project imports
import axios from 'utils/axios';

declare module 'next-auth' {
  interface User {
    accessToken?: string;
    role?: string;
    status?: string;
  }
  interface Session {
    user: {
      id?: string;
      name?: string;
      email?: string;
      role?: string;
      status?: string;
    };
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET_KEY,
  providers: [
    CredentialsProvider({
      id: 'login',
      name: 'login',
      credentials: {
        email: { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter Email' },
        password: { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter Password' }
      },
      async authorize(credentials) {
        try {
          const response = await axios.post('/account/login', {
            password: credentials?.password,
            email: credentials?.email
          });

          if (response.data && response.data.success) {
            const user = response.data.user;
            user.accessToken = response.data.serviceToken;
            return user;
          }
          return null;
        } catch (e: any) {
          const errorMessage = e?.response?.data?.message || e?.message || 'Invalid email or password';
          throw new Error(errorMessage);
        }
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user, account }) => {
      if (user) {
        token.accessToken = user.accessToken;
        token.id = user.id;
        token.role = user.role;
        token.status = user.status;
        token.provider = account?.provider;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (token && session.user) {
        session.id = token.id;
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.status = token.status as string;
        session.provider = token.provider;
        session.token = token;
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: Number(process.env.NEXT_APP_JWT_TIMEOUT!) || 86400 // Default 24 hours
  },
  jwt: {
    secret: process.env.NEXT_APP_JWT_SECRET
  },
  pages: {
    signIn: '/login'
  }
};
