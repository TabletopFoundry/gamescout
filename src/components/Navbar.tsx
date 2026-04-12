"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/discover", label: "Discover" },
  { href: "/collection", label: "Collection" },
  { href: "/stats", label: "Stats" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-zinc-950/90 backdrop-blur border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🎲</span>
            <span className="text-xl font-bold text-white tracking-tight">
              Game<span className="text-emerald-400">Scout</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Link
            href="/quiz"
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-sm rounded-lg transition-colors"
          >
            Take Quiz
          </Link>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden border-t border-zinc-800 px-4 py-2 flex gap-1">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex-1 text-center px-2 py-2 rounded-lg text-xs font-medium transition-colors ${
              pathname === link.href
                ? "bg-zinc-800 text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
