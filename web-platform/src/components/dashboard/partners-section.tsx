import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BUDGET_SUMMARY, DOCUMENTATION_LINKS, MISSION_INFO } from "@/lib/constants";
import { Handshake, FileText, DollarSign, CheckCircle2, FileCheck } from "lucide-react";

export function PartnersSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left: Partners & Budget */}
      <Card className="lg:col-span-2 border-slate-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Handshake className="h-5 w-5 text-sky-400" />
              <CardTitle className="text-lg font-bold">Partnerships & Financial Allocation</CardTitle>
            </div>
            <span className="font-mono text-xs text-emerald-400 font-bold">
              Total Budget: {BUDGET_SUMMARY.formattedTotal}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Key Partner Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="text-[10px] font-mono text-sky-400 uppercase">Lead Country Agency</div>
              <div className="text-sm font-bold text-white">{MISSION_INFO.leadCountry}</div>
              <p className="text-xs text-slate-400 pt-1">
                National Research and Innovation Agency of Indonesia leading spacecraft bus development, payload integration, and ground ops in Biak.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="text-[10px] font-mono text-sky-400 uppercase">US Space Agency Partner</div>
              <div className="text-sm font-bold text-white">{MISSION_INFO.partner}</div>
              <p className="text-xs text-slate-400 pt-1">
                Providing launch dispenser integration, NASA DSN deep-space communications tracking support, and scientific payload calibration assistance.
              </p>
            </div>
          </div>

          {/* Budget Breakdown Table */}
          <div>
            <h4 className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
              Budget Item Breakdown
            </h4>
            <div className="border border-slate-800 rounded-lg overflow-hidden">
              <table className="w-full text-xs text-left font-mono">
                <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5 text-right">Amount</th>
                    <th className="p-2.5 hidden sm:table-cell">Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-950/40">
                  {BUDGET_SUMMARY.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/50">
                      <td className="p-2.5 font-medium text-slate-200">{item.category}</td>
                      <td className="p-2.5 text-right font-bold text-sky-400">
                        {item.amount === 0 ? "$0 (NASA CSLI Grant)" : `$${item.amount.toLocaleString()}`}
                      </td>
                      <td className="p-2.5 text-slate-400 text-[11px] hidden sm:table-cell">{item.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Right: Documentation Links */}
      <Card className="border-slate-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-sky-400" />
            <CardTitle className="text-lg font-bold">Documentation & Standards</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {DOCUMENTATION_LINKS.map((doc) => (
            <div
              key={doc.id}
              className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-sky-500/40 transition-colors space-y-1"
            >
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <FileCheck className="h-3.5 w-3.5 text-sky-400" />
                  {doc.title}
                </h5>
                <Badge
                  variant={
                    doc.status === "completed"
                      ? "success"
                      : doc.status === "draft"
                      ? "cyan"
                      : "outline"
                  }
                  className="text-[9px] px-1.5 py-0"
                >
                  {doc.status}
                </Badge>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">{doc.description}</p>
              <div className="text-[10px] font-mono text-slate-500 pt-0.5">Version {doc.version}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
