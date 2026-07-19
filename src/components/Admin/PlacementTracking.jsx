"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  ADMIN_PAGE,
  ADMIN_HEADER_TITLE,
  ADMIN_SEARCH_INPUT,
  ADMIN_TABLE_WRAP,
} from "@/components/Admin/adminPageLayout";
import {
  getPlacementTracking,
  updatePlacementStatus,
} from "@/apiServices/adminApi";

/** DB value → display label for placement tracking */
const STATUS_OPTIONS = [
  { value: "Pending", label: "Applied" },
  { value: "Viewed", label: "Under Review" },
  { value: "Interview Scheduled", label: "Interview Scheduled" },
  { value: "Shortlisted", label: "Selected" },
  { value: "Rejected", label: "Rejected" },
  { value: "Hired", label: "Joined" },
];

function statusLabel(value) {
  return STATUS_OPTIONS.find((o) => o.value === value)?.label || value || "Applied";
}

const PlacementTracking = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getPlacementTracking({
        page,
        limit: 20,
        search,
        status,
        from,
        to,
      });
      setRecords(data?.records || []);
      setTotalPages(data?.totalPages || 1);
      setTotalCount(data?.totalCount || 0);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load placement tracking");
    } finally {
      setLoading(false);
    }
  }, [page, search, status, from, to]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusChange = async (applicationId, nextStatus) => {
    try {
      setUpdatingId(applicationId);
      await updatePlacementStatus(applicationId, nextStatus);
      setRecords((prev) =>
        prev.map((r) => (r._id === applicationId ? { ...r, status: nextStatus } : r))
      );
      toast.success("Status updated");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className={`${ADMIN_PAGE} flex flex-col`}>
      <div>
        <h1 className={ADMIN_HEADER_TITLE}>Placement Tracking</h1>
        <p className="text-sm text-slate-500 mt-1">
          Track job applications from institute (Nesgen) students after CSV import.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Filters</CardTitle>
          <CardDescription>{totalCount} placement record(s)</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="grid gap-1.5 lg:col-span-2">
            <Label>Search</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <input
                className={`${ADMIN_SEARCH_INPUT} pl-8`}
                placeholder="Student name, phone, email…"
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>Status</Label>
            <select
              className={ADMIN_SEARCH_INPUT}
              value={status}
              onChange={(e) => {
                setPage(1);
                setStatus(e.target.value);
              }}
            >
              <option value="">All statuses</option>
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-1.5">
            <Label>From</Label>
            <input
              type="date"
              className={ADMIN_SEARCH_INPUT}
              value={from}
              onChange={(e) => {
                setPage(1);
                setFrom(e.target.value);
              }}
            />
          </div>
          <div className="grid gap-1.5">
            <Label>To</Label>
            <input
              type="date"
              className={ADMIN_SEARCH_INPUT}
              value={to}
              onChange={(e) => {
                setPage(1);
                setTo(e.target.value);
              }}
            />
          </div>
        </CardContent>
      </Card>

      <div className={ADMIN_TABLE_WRAP}>
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        ) : records.length === 0 ? (
          <p className="text-center text-slate-500 py-12 text-sm">
            No institute student applications found for these filters.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Job Applied</TableHead>
                <TableHead>Shop Name</TableHead>
                <TableHead>Application Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((row) => (
                <TableRow key={row._id}>
                  <TableCell className="font-medium">{row.studentName}</TableCell>
                  <TableCell>{row.mobile}</TableCell>
                  <TableCell>{row.jobApplied}</TableCell>
                  <TableCell>{row.shopName}</TableCell>
                  <TableCell>
                    {row.applicationDate
                      ? new Date(row.applicationDate).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <select
                      className={`${ADMIN_SEARCH_INPUT} min-w-[160px]`}
                      value={row.status}
                      disabled={updatingId === row._id}
                      onChange={(e) => handleStatusChange(row._id, e.target.value)}
                      title={statusLabel(row.status)}
                    >
                      {STATUS_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between gap-3 pt-4 px-1">
            <p className="text-xs text-slate-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlacementTracking;
