"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { RxDashboard } from "react-icons/rx";

export default function AuthButtons() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center space-x-2">
        <Link
          href="/dashboard"
          className="flex items-center space-x-1 transition"
        >
          <RxDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>
        {session.user?.image ? (
          <div className="flex gap-3 ml-2">
            <Link href="/profile">
              <Image
                src={session.user.image}
                alt={session.user?.name || "User"}
                width={20}
                height={20}
                className="rounded-full border border-gray-300 dark:border-gray-700 hover:scale-105 transition"
              />
            </Link>
            <button
              onClick={() => signOut()}
              className="focus:outline-none flex items-center"
              title="Sign out"
            >
              <LogOut className="w-3 h-3" />
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => signOut()}
            className="px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
          >
            Sign out
          </button>
        )}
      </div>
    );
  }

  return <button onClick={() => signIn()}>Sign in</button>;
}
