// src/components/NextAuthSessionProvider.js
"use client"; // Mark as a client component
import { SessionProvider } from "next-auth/react";

export default function NextAuthSessionProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
