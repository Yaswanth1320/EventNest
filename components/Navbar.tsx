"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, Home, PlusCircle, Compass } from "lucide-react";
import { ModeToggle } from "./Toggler";
import AuthButtons from "./login-btn";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[93%] md:w-[70%] glass rounded-4xl font-mono">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-2 text-2xl font-bold tracking-tight hover:text-primary transition"
        >
          <Compass size={22} />
          <span>AroundU</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/" className={`flex items-center space-x-1 transition`}>
            <Home size={16} />
            <span>Home</span>
          </Link>
          <Link
            href="/create"
            className={`flex items-center space-x-1 transition`}
          >
            <PlusCircle size={16} />
            <span>Create</span>
          </Link>

          {/* Auth Section as component */}
          <AuthButtons />

          {/* Desktop ModeToggle */}
          <ModeToggle />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-white/10 dark:hover:bg-black/10 transition"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Links */}
      {isOpen && (
        <div className="md:hidden flex flex-col space-y-4 px-6 py-4 glass border-t rounded-b-2xl">
          <Link
            href="/"
            className={`flex items-center space-x-2`}
            onClick={() => setIsOpen(false)}
          >
            <Home size={16} />
            <span>Home</span>
          </Link>
          <Link
            href="/create"
            className={`flex items-center space-x-2`}
            onClick={() => setIsOpen(false)}
          >
            <PlusCircle size={16} />
            <span>Create</span>
          </Link>

          {/* Mobile Auth Section */}
          <AuthButtons />

          {/* Mobile ModeToggle */}
          <ModeToggle />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
