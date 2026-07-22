"use client";

import { useState, useEffect } from "react";
import { Download, FileSpreadsheet, FileText, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import { ADMIN_SEARCH_INPUT } from "@/components/Admin/adminPageLayout";
import { exportReport, getReportPreview } from "@/apiServices/adminApi";

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

  // Preview state
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewSegment, setPreviewSegment] = useState("");
  const [previewSearch, setPreviewSearch] = useState("");
  const [previewPage, setPreviewPage] = useState(1);
  const [previewFrom, setPreviewFrom] = useState("");
  const [previewTo, setPreviewTo] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewExporting, setPreviewExporting] = useState(false);
  const [previewData, setPreviewData] = useState({ headers: [], rows: [], totalCount: 0, totalPages: 1 });

  const updateCardFilter = (segId, key, value) => {
    setCardFilters((prev) => ({
      ...prev,
      [segId]: {
        ...prev[segId],
        [key]: value,
      },
    }));
  };

  const handleOpenPreview = (segmentId, { today = false, allTime = false } = {}) => {
    let fromVal = "";
    let toVal = "";
    if (today) {
      const todayStr = new Date().toLocaleDateString('en-CA');
      fromVal = todayStr;
      toVal = todayStr;
    } else if (!allTime) {
      fromVal = cardFilters[segmentId].from;
      toVal = cardFilters[segmentId].to;
    }

    setPreviewFrom(fromVal);
    setPreviewTo(toVal);
    setPreviewSegment(segmentId);
    setPreviewPage(1);
    setPreviewSearch("");
    setIsPreviewOpen(true);
  };

  useEffect(() => {
    if (isPreviewOpen && previewSegment) {
      fetchPreview();
    }
  }, [isPreviewOpen, previewSegment, previewPage, previewSearch, previewFrom, previewTo]);

  const fetchPreview = async () => {
    try {
      setPreviewLoading(true);
      const response = await getReportPreview({
        segment: previewSegment,
        search: previewSearch,
        page: previewPage,
        limit: 10,
        from: previewFrom,
        to: previewTo,
      });
      if (response?.data?.response) {
        setPreviewData(response.data.response);
      }
    } catch (error) {
      toast.error("Failed to fetch report preview");
      console.error(error);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleExportFromPreview = async () => {
    try {
      setPreviewExporting(true);
      const response = await exportReport({
        segment: previewSegment,
        format: "xlsx",
        search: previewSearch,
        from: previewFrom,
        to: previewTo,
      });
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const disposition = response.headers?.["content-disposition"] || "";
      const match = disposition.match(/filename="?([^"]+)"?/);
      const filename =
        match?.[1] ||
        `techpath-${previewSegment}-${Date.now()}.xlsx`;
      downloadBlob(blob, filename);
      toast.success("Excel report exported successfully");
    } catch (error) {
      toast.error("Failed to export Excel report");
      console.error(error);
    } finally {
      setPreviewExporting(false);
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
          Configure filters on each card to view reports.
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
                      onClick={() => handleOpenPreview(seg.id, { today: true })}
                    >
                      Today
                    </Button>
                    {isButtonVisible && (
                      <Button
                        size="sm"
                        className="flex-1 h-8 bg-indigo-600 hover:bg-indigo-700 text-white"
                        onClick={() => handleOpenPreview(seg.id, { allTime: filters.getAll })}
                      >
                        <Download className="h-3.5 w-3.5 mr-1" />
                        Preview
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Report Preview Sheet */}
      <Sheet open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <SheetContent className="sm:max-w-[850px] w-full flex flex-col h-full bg-white p-6">
          <SheetHeader className="pb-4 border-b border-slate-100 flex flex-row items-center justify-between gap-4">
            <div>
              <SheetTitle className="text-lg font-bold text-slate-800">
                {SEGMENTS.find((s) => s.id === previewSegment)?.title || "Report"} Preview
              </SheetTitle>
              <p className="text-xs text-slate-500 mt-1">
                Date Range: {previewFrom && previewTo ? `${previewFrom} to ${previewTo}` : "All Time"}
              </p>
            </div>
            <Button
              disabled={previewExporting || !previewData?.rows?.length}
              onClick={handleExportFromPreview}
              className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white font-semibold text-xs h-9 px-3 rounded-lg"
            >
              {previewExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileSpreadsheet className="h-4 w-4" />
              )}
              Export Excel
            </Button>
          </SheetHeader>

          {/* Search bar */}
          <div className="py-4">
            <div className="relative max-w-sm">
              <input
                type="text"
                placeholder="Search report records..."
                value={previewSearch}
                onChange={(e) => {
                  setPreviewPage(1);
                  setPreviewSearch(e.target.value);
                }}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="flex-1 min-h-0 border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
            {previewLoading ? (
              <div className="flex flex-col items-center justify-center h-full gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                <span className="text-xs text-slate-500 font-medium">Fetching preview records...</span>
              </div>
            ) : previewData?.rows?.length > 0 ? (
              <div className="h-full overflow-auto bg-white">
                <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                  <thead className="bg-slate-50 font-semibold text-slate-700 sticky top-0 z-10 border-b border-slate-200">
                    <tr>
                      {previewData.headers.map((h, i) => (
                        <th key={i} className="px-4 py-3 bg-slate-50">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200 text-slate-600">
                    {previewData.rows.map((row, rowIdx) => (
                      <tr key={rowIdx} className="hover:bg-slate-50/70 transition-colors">
                        {row.map((cell, cellIdx) => (
                          <td key={cellIdx} className="px-4 py-2.5 whitespace-nowrap">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <p className="text-sm font-semibold">No records found</p>
                <p className="text-xs">Adjust search parameters or filters to find data.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4 text-xs font-semibold">
            <span className="text-slate-500">
              Showing Page {previewPage} of {previewData?.totalPages || 1} ({previewData?.totalCount || 0} total records)
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3"
                disabled={previewPage <= 1 || previewLoading}
                onClick={() => setPreviewPage((p) => p - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3"
                disabled={previewPage >= (previewData?.totalPages || 1) || previewLoading}
                onClick={() => setPreviewPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ReportsSection;
