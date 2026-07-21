"use client";

import { useState } from "react";
import { Download, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ADMIN_SEARCH_INPUT } from "@/components/Admin/adminPageLayout";
import { exportReport } from "@/apiServices/adminApi";

const SEGMENTS = [
  {
    id: "employers",
    title: "Employers",
    description: "All registered employers with contact details and status.",
  },
  {
    id: "students",
    title: "Students",
    description: "Institute / Nesgen students imported via CSV.",
  },
  {
    id: "newly-applied",
    title: "Newly Applied Candidates",
    description: "Job applications within the selected date range.",
  },
  {
    id: "active-users",
    title: "Active Users",
    description: "Users who are not blocked.",
  },
  {
    id: "new-registrations",
    title: "New Registrations",
    description: "Users registered within the selected date range.",
  },
];

function downloadBlob(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

/** Reports & Downloads panel — embedded on Dashboard */
export const ReportsSection = () => {
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loadingKey, setLoadingKey] = useState(null);

  const handleDownload = async (segment, format) => {
    const key = `${segment}-${format}`;
    try {
      setLoadingKey(key);
      const response = await exportReport({
        segment,
        format,
        search,
        from,
        to,
      });
      const blob = new Blob([response.data], {
        type:
          format === "csv"
            ? "text/csv;charset=utf-8"
            : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const disposition = response.headers?.["content-disposition"] || "";
      const match = disposition.match(/filename="?([^"]+)"?/);
      const filename =
        match?.[1] ||
        `techpath-${segment}-${Date.now()}.${format === "csv" ? "csv" : "xlsx"}`;
      downloadBlob(blob, filename);
      toast.success(`${SEGMENTS.find((s) => s.id === segment)?.title || "Report"} downloaded`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to download report");
    } finally {
      setLoadingKey(null);
    }
  };

  return (
    <div id="reports" className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 pt-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Download className="w-4 h-4 text-indigo-600" />
          <h2 className="text-base font-semibold text-slate-900">Reports & Downloads</h2>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Export segmented reports as CSV or Excel. Filters below apply to every download.
        </p>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid gap-4 sm:grid-cols-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="grid gap-1.5">
            <Label htmlFor="report-search">Search</Label>
            <input
              id="report-search"
              className={ADMIN_SEARCH_INPUT}
              placeholder="Name, email, phone…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="report-from">From date</Label>
            <input
              id="report-from"
              type="date"
              className={ADMIN_SEARCH_INPUT}
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="report-to">To date</Label>
            <input
              id="report-to"
              type="date"
              className={ADMIN_SEARCH_INPUT}
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {SEGMENTS.map((seg) => (
            <Card key={seg.id} className="flex flex-col shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Download className="h-3.5 w-3.5 text-indigo-600" />
                  {seg.title}
                </CardTitle>
                <CardDescription className="text-xs">{seg.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto flex flex-wrap gap-2 pt-0">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={loadingKey === `${seg.id}-csv`}
                  onClick={() => handleDownload(seg.id, "csv")}
                >
                  {loadingKey === `${seg.id}-csv` ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  ) : (
                    <FileText className="h-4 w-4 mr-1" />
                  )}
                  CSV
                </Button>
                <Button
                  size="sm"
                  disabled={loadingKey === `${seg.id}-xlsx`}
                  onClick={() => handleDownload(seg.id, "xlsx")}
                >
                  {loadingKey === `${seg.id}-xlsx` ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  ) : (
                    <FileSpreadsheet className="h-4 w-4 mr-1" />
                  )}
                  Excel
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsSection;
