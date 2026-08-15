"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { MISSION_STATUS } from "@/lib/constants";
import {
  Compass,
  Activity,
  Box,
  Database,
  Bot,
  MapPin,
  Menu,
  X,
  Radio,
  FileText,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/", icon: Compass },
    { name: "3D Visualizer", href: "/visualizer", icon: Box },
    { name: "Analytics", href: "/analytics", icon: Activity },
    { name: "Data Portal", href: "/data-portal", icon: Database },
    { name: "Luna-AGI", href: "/luna-agi", icon: Bot },
    { name: "Artemis Sites", href: "/artemis", icon: MapPin },
    { name: "Docs", href: "/docs", icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-space-900/90 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-sky-500/40 bg-sky-950/60 transition-transform group-hover:scale-105 shadow-[0_0_15px_rgba(56,189,248,0.3)]">
            <Radio className="h-5 w-5 text-sky-400 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-wider text-white group-hover:text-sky-400 transition-colors flex items-center gap-1.5">
              LUNA ICE MAPPER <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-sky-950 border border-sky-500/30 text-sky-400">6U</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">BRIN × NASA CSLI</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  isActive
                    ? "bg-sky-950/80 text-sky-400 border border-sky-500/40 shadow-[0_0_10px_rgba(56,189,248,0.2)]"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? "text-sky-400" : "text-slate-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Status Badge & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <Badge variant="glow" className="font-mono text-[11px] gap-1.5 py-1 px-3">
              <span className="h-2 w-2 rounded-full bg-sky-400 animate-ping" />
              {MISSION_STATUS}
            </Badge>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-sky-400"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-space-900/95 backdrop-blur-2xl px-4 pt-2 pb-4 space-y-2 animate-fadeIn">
          <div className="py-2 border-b border-slate-800 mb-2 flex items-center justify-between">
            <Badge variant="glow" className="font-mono text-[10px]">
              {MISSION_STATUS}
            </Badge>
            <span className="text-xs text-slate-400 font-mono">Launch: Q4 2027</span>
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive
                    ? "bg-sky-950/80 text-sky-400 border border-sky-500/30 font-semibold"
                    : "text-slate-300 hover:bg-slate-800 text-slate-200"
                }`}
              >
                <Icon className="h-4 w-4 text-sky-400" />
                {item.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
