import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { logService, type GetLogsResponse } from "../services/logService";
import { LogsTable } from "../components/LogsTable";
import { PaginationControls } from "../components/PaginationControls";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AppDetailPage() {
  const { name } = useParams<{ name: string }>();
  const [data, setData] = useState<GetLogsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination state
  const [page, setPage] = useState(1);
  const [level, setLevel] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sortBy, setSortBy] = useState("createdAt"); // or "count"

  const fetchLogs = useCallback(async () => {
    if (!name) return;
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        level: level === "ALL" ? undefined : level,
        search: search || undefined,
        sortBy,
      };
      const res = await logService.getLogs(name, params);
      setData(res);
      setError(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Failed to fetch logs");
    } finally {
      setLoading(false);
    }
  }, [name, page, level, search, sortBy]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLogs();
  }, [fetchLogs]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link to="/dashboard" title="Back to Dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{name}</h1>
            <p className="text-muted-foreground text-sm">Application Logs</p>
          </div>
        </div>
        <Button variant="outline" onClick={fetchLogs} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="bg-card border rounded-lg p-4 mb-6 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full space-y-1">
          <label className="text-sm font-medium">Search Message</label>
          <Input
            placeholder="Search logs..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48 space-y-1">
          <label className="text-sm font-medium">Level</label>
          <Select
            value={level}
            onValueChange={(val) => {
              setLevel(val);
              setPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Levels</SelectItem>
              <SelectItem value="INFO">INFO</SelectItem>
              <SelectItem value="WARN">WARN</SelectItem>
              <SelectItem value="ERROR">ERROR</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-48 space-y-1">
          <label className="text-sm font-medium">Sort By</label>
          <Select
            value={sortBy}
            onValueChange={(val) => {
              setSortBy(val);
              setPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Most Recent</SelectItem>
              <SelectItem value="count">Most Occurred</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/15 text-destructive border-destructive/30 border p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <LogsTable logs={data?.logs || []} loading={loading} />

      {data && data.totalPages > 1 && (
        <PaginationControls
          currentPage={data.currentPage}
          totalPages={data.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
