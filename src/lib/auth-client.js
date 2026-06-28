import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "https://resell-hub-rho.vercel.app",
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;