"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Search, ChevronRight } from "lucide-react";

export type CamlogStatus = "GREEN" | "RED";

export type CamlogRow = {
  actionCode: string;
  id: string;
  timestamp: string;
  status: CamlogStatus;
  source: string;
  metricType: string;
  value: string;
  target: string;
  leader: string;
};

interface CamlogTableProps {
  data: CamlogRow[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  itemsPerPage?: number;
  onItemsPerPageChange?: (value: number) => void;
}

function formatTimestamp(iso: string): string {
  try {
    const date = new Date(iso);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(date);
  } catch {
    return iso;
  }
}

function getStatusCellStyle(status: CamlogStatus) {
  if (status === "GREEN") {
    return "bg-emerald-100 text-emerald-800 font-semibold";
  }
  return "bg-red-100 text-red-800 font-semibold";
}

function getValueCellStyle(status: CamlogStatus) {
  if (status === "GREEN") {
    return "bg-emerald-50 text-emerald-700";
  }
  return "bg-red-50 text-red-700";
}

export function CamlogTable({
  data,
  searchQuery,
  onSearchChange,
  itemsPerPage = 10,
  onItemsPerPageChange,
}: CamlogTableProps) {
  const [showExpanded, setShowExpanded] = React.useState(false);
  const [expandedRows, setExpandedRows] = React.useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = React.useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);

  return (
    <div className="rounded-md border border-border bg-card">
      {/* Table Header */}
      <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Camlog Event Scorecard
          </h3>
          <p className="text-sm text-muted-foreground">
            Comprehensive view of all Camlog events with color-based status
            indicators and expandable detail rows
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={showExpanded}
              onCheckedChange={setShowExpanded}
              className="data-[state=checked]:bg-[hsl(217,91%,40%)]"
            />
            <span className="text-xs text-muted-foreground">
              Show details
            </span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search events..."
              className="h-9 w-full bg-background pl-9 sm:w-[240px]"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-[hsl(217,91%,40%)] hover:bg-[hsl(217,91%,40%)]">
              <TableHead className="text-xs font-semibold text-white">
                Action Code
              </TableHead>
              <TableHead className="text-xs font-semibold text-white">
                Event ID
              </TableHead>
              <TableHead className="text-xs font-semibold text-white">
                Metric Type
              </TableHead>
              <TableHead className="text-xs font-semibold text-white">
                T/L
              </TableHead>
              <TableHead className="text-xs font-semibold text-white">
                Source
              </TableHead>
              <TableHead className="text-center text-xs font-semibold text-white">
                Timestamp
              </TableHead>
              <TableHead className="text-center text-xs font-semibold text-white">
                Value
              </TableHead>
              <TableHead className="text-center text-xs font-semibold text-white">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-32 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Search className="h-8 w-8 text-muted-foreground/40" />
                    <p className="text-sm">
                      No events found. Try adjusting your filters.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => {
                const isExpanded = showExpanded || expandedRows.has(row.id);
                return (
                  <React.Fragment key={row.id}>
                    <TableRow className="cursor-pointer border-b border-border transition-colors hover:bg-muted/30" onClick={() => {
                      const newExpanded = new Set(expandedRows);
                      if (newExpanded.has(row.id)) {
                        newExpanded.delete(row.id);
                      } else {
                        newExpanded.add(row.id);
                      }
                      setExpandedRows(newExpanded);
                    }}>
                      <TableCell className="text-sm font-medium text-foreground">
                        <div className="flex items-center gap-1.5">
                          <ChevronRight className={`h-3 w-3 text-muted-foreground transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                          {row.actionCode}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {row.id}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {row.metricType}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        <div className="space-y-0.5">
                          <div>
                            {"T: "}
                            {row.target}
                          </div>
                          <div>
                            {"L: "}
                            {row.leader}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {row.source}
                      </TableCell>
                      <TableCell className="text-center text-xs text-muted-foreground">
                        {formatTimestamp(row.timestamp)}
                      </TableCell>
                      <TableCell
                        className={`text-center text-xs ${getValueCellStyle(row.status)}`}
                      >
                        {row.value}
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`inline-block rounded px-3 py-1 text-xs ${getStatusCellStyle(row.status)}`}
                        >
                          {row.status}
                        </span>
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow className="bg-muted/20">
                        <TableCell
                          colSpan={8}
                          className="border-b-2 border-border py-3 pl-10 text-xs text-muted-foreground"
                        >
                          <div className="flex gap-8">
                            <div>
                              <span className="font-medium text-foreground">
                                Full ID:{" "}
                              </span>
                              {row.id}
                            </div>
                            <div>
                              <span className="font-medium text-foreground">
                                Source:{" "}
                              </span>
                              {row.source}
                            </div>
                            <div>
                              <span className="font-medium text-foreground">
                                Target:{" "}
                              </span>
                              {row.target}
                            </div>
                            <div>
                              <span className="font-medium text-foreground">
                                Leader:{" "}
                              </span>
                              {row.leader}
                            </div>
                            <div>
                              <span className="font-medium text-foreground">
                                Metric Type:{" "}
                              </span>
                              {row.metricType}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer with Pagination */}
      <div className="flex flex-col gap-3 border-t border-border px-5 py-3 text-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="h-2 w-2 animate-pulse rounded-full bg-[hsl(217,91%,40%)]" />
          <span>
            Data Source: Splunk Enterprise (MVP uses mock data)
          </span>
        </div>
        
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex items-center gap-2">
            <span className="text-foreground">Items per page:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                const newValue = Number(e.target.value);
                onItemsPerPageChange?.(newValue);
                setCurrentPage(1);
              }}
              className="rounded border border-border bg-background px-2 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-[hsl(217,91%,40%)] focus:ring-offset-1"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
          
          <span className="text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} event{data.length === 1 ? "" : "s"}
          </span>
          
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="rounded border border-border bg-background px-2 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              First
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="rounded border border-border bg-background px-2 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-2 text-xs font-medium text-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="rounded border border-border bg-background px-2 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="rounded border border-border bg-background px-2 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              Last
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
