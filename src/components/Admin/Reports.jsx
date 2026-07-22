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
  const [cardFilters, setCardFilters] = useState(
    SEGMENTS.reduce((acc, seg) => {
      acc[seg.id] = { from: "", to: "", getAll: false };
      return acc;
    }, {})
  );
  const [loadingKey, setLoadingKey] = useState(null);

  const updateCardFilter = (segId, key, value) => {
    setCardFilters((prev) => ({
      ...prev,
      [segId]: {
        ...prev[segId],
        [key]: value,
      },
    }));
  };

  const handleDownload = async (segment, format) => {
    const key = `${segment}-${format}`;
    const filters = cardFilters[segment];
    const from = filters.getAll ? "" : filters.from;
    const to = filters.getAll ? "" : filters.to;

    try {
      setLoadingKey(key);
      const response = await exportReport({
        segment,
        format,
        search: "",
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

  const handleDownloadToday = async (segment) => {
    const key = `${segment}-today`;
    const todayStr = new Date().toLocaleDateString('en-CA');
    try {
      setLoadingKey(key);
      const response = await exportReport({
        segment,
        format: "xlsx",
        search: "",
        from: todayStr,
        to: todayStr,
      });
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const disposition = response.headers?.["content-disposition"] || "";
      const match = disposition.match(/filename="?([^"]+)"?/);
      const filename =
        match?.[1] ||
        `techpath-${segment}-today-${Date.now()}.xlsx`;
      downloadBlob(blob, filename);
      toast.success(`${SEGMENTS.find((s) => s.id === segment)?.title || "Report"} for Today downloaded`);
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
          Configure filters on each card to download reports.
        </p>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {SEGMENTS.map((seg) => {
            const filters = cardFilters[seg.id];
            const isButtonVisible = filters.getAll || (filters.from && filters.to);

            return (
              <Card key={seg.id} className="flex flex-col shadow-none border border-slate-200 bg-white hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2 text-slate-800">
                    <Download className="h-4 w-4 text-indigo-600" />
                    {seg.title}
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">{seg.description}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto space-y-3 pt-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">From</label>
                      <input
                        type="date"
                        disabled={filters.getAll}
                        value={filters.from}
                        onChange={(e) => updateCardFilter(seg.id, "from", e.target.value)}
                        className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-white disabled:opacity-50 disabled:bg-slate-50 h-[30px]"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">To</label>
                      <input
                        type="date"
                        disabled={filters.getAll}
                        value={filters.to}
                        onChange={(e) => updateCardFilter(seg.id, "to", e.target.value)}
                        className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-white disabled:opacity-50 disabled:bg-slate-50 h-[30px]"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 py-0.5">
                    <input
                      type="checkbox"
                      id={`get-all-${seg.id}`}
                      checked={filters.getAll}
                      onChange={(e) => updateCardFilter(seg.id, "getAll", e.target.checked)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                    />
                    <label htmlFor={`get-all-${seg.id}`} className="text-xs text-slate-600 cursor-pointer select-none font-medium">
                      Get all data (ignore date)
                    </label>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100 h-8"
                      disabled={loadingKey === `${seg.id}-today`}
                      onClick={() => handleDownloadToday(seg.id)}
                    >
                      {loadingKey === `${seg.id}-today` ? (
                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      ) : null}
                      Today
                    </Button>
                    {isButtonVisible && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8"
                          disabled={loadingKey === `${seg.id}-csv`}
                          onClick={() => handleDownload(seg.id, "csv")}
                        >
                          {loadingKey === `${seg.id}-csv` ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                          ) : (
                            <FileText className="h-3.5 w-3.5 mr-1" />
                          )}
                          CSV
                        </Button>
                        <Button
                          size="sm"
                          className="h-8"
                          disabled={loadingKey === `${seg.id}-xlsx`}
                          onClick={() => handleDownload(seg.id, "xlsx")}
                        >
                          {loadingKey === `${seg.id}-xlsx` ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                          ) : (
                            <FileSpreadsheet className="h-3.5 w-3.5 mr-1" />
                          )}
                          Excel
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReportsSection;
