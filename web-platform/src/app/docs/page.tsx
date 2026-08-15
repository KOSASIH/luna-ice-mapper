import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DOCUMENTATION_LINKS, MISSION_INFO } from "@/lib/constants";
import { FileText, Github, ExternalLink, Code, BookOpen } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="glow" className="font-mono text-xs">
            DOCUMENTATION & ARCHITECTURE
          </Badge>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          System Specifications & Documentation
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Comprehensive engineering specifications, PDS4 data formats, and API documentation for Luna Ice Mapper.
        </p>
      </div>

      {/* Docs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-slate-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-sky-400" />
              <CardTitle className="text-lg font-bold">Mission Control Documents</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {DOCUMENTATION_LINKS.map((doc) => (
              <div key={doc.id} className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white">{doc.title}</h4>
                  <Badge variant={doc.status === "completed" ? "success" : "cyan"} className="text-[10px]">
                    {doc.status}
                  </Badge>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{doc.description}</p>
                <div className="text-[10px] font-mono text-slate-500 pt-1">Version {doc.version}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* API & Open Source */}
        <div className="space-y-6">
          <Card className="border-slate-800">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Code className="h-5 w-5 text-sky-400" />
                <CardTitle className="text-lg font-bold">REST API Reference</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold text-[10px]">GET</span>
                  <span className="text-white font-bold">/api/telemetry</span>
                </div>
                <p className="text-slate-400 text-[11px] font-sans">Returns current live spacecraft bus and payload health metrics.</p>
              </div>

              <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold text-[10px]">GET</span>
                  <span className="text-white font-bold">/api/psr-regions</span>
                </div>
                <p className="text-slate-400 text-[11px] font-sans">List all mapped lunar south pole PSR crater coordinates & ice tonnage.</p>
              </div>

              <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-sky-950 text-sky-400 font-bold text-[10px]">POST</span>
                  <span className="text-white font-bold">/api/analyze-coordinates</span>
                </div>
                <p className="text-slate-400 text-[11px] font-sans">Calculate estimated regolith hydrogen and temperature for lat/lng.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Github className="h-5 w-5 text-sky-400" />
                <CardTitle className="text-lg font-bold">Open Source Repository</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-slate-300 leading-relaxed">
                All source code, CAD models, software algorithms, and scientific pipelines are published under the Apache-2.0 License.
              </p>
              <a
                href={MISSION_INFO.githubRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-500 text-slate-950 font-bold hover:bg-sky-400 transition-colors text-xs font-mono"
              >
                <Github className="h-4 w-4" />
                Visit GitHub Repository
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
