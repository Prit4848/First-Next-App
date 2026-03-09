"use client";
import React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import { LayoutDashboard, LogOut, User as UserIcon } from "lucide-react"; // Nice icons for UX
import { usePathname } from "next/navigation";

const Navbar = () => {
  const { data: session } = useSession();
  const user = session?.user as User;
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/75 backdrop-blur-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center p-4 md:px-8">
        {/* Brand/Logo */}
        <a
          href="/"
          className="text-2xl font-extrabold tracking-tighter bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent hover:to-purple-400 transition-all duration-300 mb-4 md:mb-0"
        >
          True Feedback
        </a>

        <div className="flex items-center gap-6">
          {session ? (
            <div className="flex flex-col md:flex-row items-center gap-4">
              <Link href="/dashboard">
                <Button
                  variant={pathname === "/dashboard" ? "secondary" : "ghost"}
                  className={`text-slate-200 ${pathname === "/dashboard" ? "bg-slate-800" : "hover:bg-slate-900"}`}
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              {/* User Identity Chip */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 rounded-full border border-slate-800">
                <UserIcon className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-slate-200">
                  {user.username || user.email}
                </span>
              </div>

              <Button
                onClick={() => signOut()}
                variant="ghost"
                className="text-slate-300 hover:text-white hover:bg-red-900/20 transition-all"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <Link href="/sign-in">
              <Button
                variant="default"
                className="bg-white text-black hover:bg-slate-200 font-semibold px-6 shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-shadow"
              >
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
