"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Login", href: "/login" },
    { name: "Sign Up", href: "/signup" },
  ];

  return (
    <header className="w-full bg-black shadow-sm fixed top-0 left-0 z-10">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        
        <Link href="/" className="text-2xl font-bold">
          <span className="text-green-500">Secure</span>
          <span className="text-gray-200">Pass</span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex gap-6 text-white text-md font-bold">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`hover:underline transition ${
                pathname === item.href ? "underline" : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
