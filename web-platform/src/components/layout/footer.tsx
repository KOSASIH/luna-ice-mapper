import React from "react";
import Link from "next/link";
import { Github, ExternalLink, ShieldCheck, Heart } from "lucide-react";
import { MISSION_INFO } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-800/80 bg-space-900/80 backdrop-blur-md py-10 z-10">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1 */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-wider text-white text-base">
                LUNA ICE MAPPER
              </span>
              <span className="text-xs font-mono text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-500/30">
                6U CubeSat
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-lg">
              {MISSION_INFO.vision}
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 pt-1">
              <span>Partners:</span>
              <span className="text-sky-300 font-semibold">{MISSION_INFO.leadCountry}</span>
              <span>×</span>
              <span className="text-sky-300 font-semibold">{MISSION_INFO.partner}</span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
              Quick Links
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <Link href="/" className="hover:text-sky-400 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/visualizer" className="hover:text-sky-400 transition-colors">
                  3D Lunar Map
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="hover:text-sky-400 transition-colors">
                  Telemetry Analytics
                </Link>
              </li>
              <li>
                <Link href="/data-portal" className="hover:text-sky-400 transition-colors">
                  PDS4 Science Datasets
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
              Open Source & License
            </h4>
            <p className="text-xs text-slate-400">
              Licensed under <span className="text-slate-200 font-mono">Apache-2.0</span>. Contributions welcomed from scientists worldwide.
            </p>
            <div className="pt-2">
              <a
                href={MISSION_INFO.githubRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-slate-700 bg-slate-800 text-xs font-mono text-slate-200 hover:bg-slate-700 hover:border-sky-500 transition-all"
              >
                <Github className="h-3.5 w-3.5 text-sky-400" />
                <span>GitHub Repository</span>
                <ExternalLink className="h-3 w-3 text-slate-400" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono gap-4">
          <p>© 2026 Luna Ice Mapper Mission Team. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> WCAG 2.1 AA Compliant
            </span>
            <span>Target Launch: Q4 2027</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
