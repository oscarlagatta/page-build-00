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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Eye } from "lucide-react";
import { RawPayloadDrawer } from "./raw-payload-drawer";

export type CamlogRow = {
  CMLG_TIMESTAMP: string;
  CMLG_TRACE_ID: string;
  CMLG_ACTION: string;
  CMLG_SERVICE_NAME: string;
  CMLG_CORRELATION_ID: string;
  CMLG_ID: string;
  ERR: string;
  eventtype: string;
  tag: string;
  tag_eventtype: string;
  log_level: string;
  _raw: string;
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

function isError(row: CamlogRow): boolean {
  return (
    row.ERR === "Y" ||
    row.eventtype === "error" ||
    row.tag === "error" ||
    row.tag_eventtype === "error"
  );
}

export function CamlogTable({
  data,
  searchQuery,
  onSearchChange,
  itemsPerPage = 10,
  onItemsPerPageChange,
}: CamlogTableProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<CamlogRow | null>(null);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);

  const handleViewRaw = (row: CamlogRow, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRow(row);
    setDrawerOpen(true);
  };

  return (
    <>
      <div className="flex flex-1 flex-col overflow-hidden rounded-md border border-border bg-card">
        {/* Table Header */}
        <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-foreground">
              CAM Log Event Records
            </h3>
            <p className="text-sm text-muted-foreground">
              Real-time monitoring with error detection and detailed payload inspection
            </p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by Trace ID, Action, Service..."
              className="h-9 w-full bg-background pl-9 sm:w-[300px]"
            />
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-[hsl(217,91%,40%)] hover:bg-[hsl(217,91%,40%)]">
                <TableHead className="text-xs font-semibold text-white">
                  Timestamp
                </TableHead>
                <TableHead className="text-xs font-semibold text-white">
                  Trace ID
                </TableHead>
                <TableHead className="text-xs font-semibold text-white">
                  Action
                </TableHead>
                <TableHead className="text-xs font-semibold text-white">
                  Service
                </TableHead>
                <TableHead className="text-xs font-semibold text-white">
                  Correlation ID
                </TableHead>
                <TableHead className="text-xs font-semibold text-white">
                  CMLG ID
                </TableHead>
                <TableHead className="text-center text-xs font-semibold text-white">
                  Log Level
                </TableHead>
                <TableHead className="text-center text-xs font-semibold text-white">
                  Status
                </TableHead>
                <TableHead className="text-center text-xs font-semibold text-white">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
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
                  const hasError = isError(row);
                  return (
                    <TableRow
                      key={row.CMLG_ID}
                      className={`border-b border-border transition-colors ${
                        hasError ? "bg-red-50 hover:bg-red-100" : "bg-emerald-50 hover:bg-emerald-100"
                      }`}
                    >
                      <TableCell className="text-xs text-foreground">
                        {formatTimestamp(row.CMLG_TIMESTAMP)}
                      </TableCell>
                      <TableCell className="font-mono text-xs font-medium text-foreground">
                        {row.CMLG_TRACE_ID}
                      </TableCell>
                      <TableCell className="text-xs text-foreground">
                        {row.CMLG_ACTION}
                      </TableCell>
                      <TableCell className="text-xs text-foreground">
                        {row.CMLG_SERVICE_NAME}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {row.CMLG_CORRELATION_ID}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {row.CMLG_ID}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            row.log_level === "INFO"
                              ? "border-blue-300 bg-blue-50 text-blue-700"
                              : "border-gray-300 bg-gray-50 text-gray-700"
                          }`}
                        >
                          {row.log_level}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          className={`text-xs font-bold ${
                            hasError
                              ? "bg-red-500 text-white hover:bg-red-500"
                              : "bg-emerald-500 text-white hover:bg-emerald-500"
                          }`}
                        >
                          {hasError ? "Error" : "OK"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleViewRaw(row, e)}
                          className="h-7 gap-1.5 text-xs"
                        >
                          <Eye className="h-3 w-3" />
                          View Raw
                        </Button>
                      </TableCell>
                    </TableRow>
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
            <span>Data Source: Splunk Enterprise</span>
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
              Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of{" "}
              {data.length} event{data.length === 1 ? "" : "s"}
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
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
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

      {/* Raw Payload Drawer */}
      <RawPayloadDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        rawData={selectedRow?._raw || ""}
        recordId={selectedRow?.CMLG_ID || ""}
      />
    </>
  );
}
