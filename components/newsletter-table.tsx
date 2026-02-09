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
import { Search, Eye, Edit, ChevronDown, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";

export type Newsletter = {
  id: string;
  title: string;
  status: "Draft" | "Submitted" | "Approved" | "Published";
  created_by: string;
  created_date: string;
  updated_by: string;
  updated_date: string;
  submitted_date: string | null;
  approved_date: string | null;
  published_date: string | null;
  content: string;
};

interface NewsletterTableProps {
  data: Newsletter[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  itemsPerPage?: number;
  onItemsPerPageChange?: (value: number) => void;
  onView: (newsletter: Newsletter) => void;
  onEdit: (newsletter: Newsletter) => void;
}

function formatTimestamp(iso: string | null): string {
  if (!iso) return "N/A";
  try {
    const date = new Date(iso);
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
  } catch {
    return iso;
  }
}

function getStatusColor(status: Newsletter["status"]) {
  switch (status) {
    case "Draft":
      return "border-gray-300 bg-gray-50 text-gray-700";
    case "Submitted":
      return "border-blue-300 bg-blue-50 text-blue-700";
    case "Approved":
      return "border-emerald-300 bg-emerald-50 text-emerald-700";
    case "Published":
      return "border-green-500 bg-green-100 text-green-800";
    default:
      return "border-gray-300 bg-gray-50 text-gray-700";
  }
}

export function NewsletterTable({
  data,
  searchQuery,
  onSearchChange,
  itemsPerPage = 10,
  onItemsPerPageChange,
  onView,
  onEdit,
}: NewsletterTableProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [expandedRows, setExpandedRows] = React.useState<Set<string>>(new Set());

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);

  const toggleRowExpansion = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-md border border-border bg-card">
      {/* Table Header */}
      <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Newsletter Management
          </h3>
          <p className="text-sm text-muted-foreground">
            Create, manage, and publish monthly newsletters
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title, author, or ID..."
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
                Title
              </TableHead>
              <TableHead className="text-center text-xs font-semibold text-white">
                Status
              </TableHead>
              <TableHead className="text-xs font-semibold text-white">
                Created By
              </TableHead>
              <TableHead className="text-xs font-semibold text-white">
                Created Date
              </TableHead>
              <TableHead className="text-xs font-semibold text-white">
                Updated By
              </TableHead>
              <TableHead className="text-xs font-semibold text-white">
                Updated Date
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
                  colSpan={7}
                  className="h-32 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Search className="h-8 w-8 text-muted-foreground/40" />
                    <p className="text-sm">
                      No newsletters found. Try adjusting your filters.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((newsletter) => {
                const isExpanded = expandedRows.has(newsletter.id);
                
                return (
                  <React.Fragment key={newsletter.id}>
                    <TableRow
                      onClick={() => toggleRowExpansion(newsletter.id)}
                      className="cursor-pointer border-b border-border transition-colors hover:bg-muted/30"
                    >
                      <TableCell className="text-sm font-medium text-foreground">
                        <div className="flex items-center gap-2">
                          <ChevronDown
                            className={`h-3.5 w-3.5 shrink-0 transition-transform ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                          <div className="flex flex-col gap-0.5">
                            <span>{newsletter.title}</span>
                            <span className="font-mono text-xs text-muted-foreground">
                              {newsletter.id}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="outline"
                          className={`text-xs ${getStatusColor(newsletter.status)}`}
                        >
                          {newsletter.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-foreground">
                        {newsletter.created_by}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatTimestamp(newsletter.created_date)}
                      </TableCell>
                      <TableCell className="text-sm text-foreground">
                        {newsletter.updated_by}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatTimestamp(newsletter.updated_date)}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onView(newsletter);
                            }}
                            className="h-7 gap-1.5 text-xs"
                          >
                            <Eye className="h-3 w-3" />
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(newsletter);
                            }}
                            className="h-7 gap-1.5 text-xs"
                          >
                            <Edit className="h-3 w-3" />
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    
                    {isExpanded && (
                      <TableRow className="bg-muted/20">
                        <TableCell colSpan={7} className="p-0">
                          <div className="border-t border-border/50 px-6 py-4">
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                              <div>
                                <span className="text-xs font-medium text-muted-foreground">
                                  Submitted Date
                                </span>
                                <p className="mt-1 text-sm text-foreground">
                                  {formatTimestamp(newsletter.submitted_date)}
                                </p>
                              </div>
                              <div>
                                <span className="text-xs font-medium text-muted-foreground">
                                  Approved Date
                                </span>
                                <p className="mt-1 text-sm text-foreground">
                                  {formatTimestamp(newsletter.approved_date)}
                                </p>
                              </div>
                              <div>
                                <span className="text-xs font-medium text-muted-foreground">
                                  Published Date
                                </span>
                                <p className="mt-1 text-sm text-foreground">
                                  {formatTimestamp(newsletter.published_date)}
                                </p>
                              </div>
                            </div>
                            <div className="mt-4">
                              <span className="text-xs font-medium text-muted-foreground">
                                Content Preview
                              </span>
                              <p className="mt-1 text-sm text-foreground">
                                {newsletter.content}
                              </p>
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
          <span>Newsletter Database</span>
        </div>

        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex items-center gap-2">
            <span className="text-foreground">Rows per page:</span>
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

          <span className="text-xs font-medium text-foreground">
            Page {currentPage} of {totalPages}
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              title="First page"
              className="flex h-7 w-7 items-center justify-center rounded border border-border bg-background text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              title="Previous page"
              className="flex h-7 w-7 items-center justify-center rounded border border-border bg-background text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              title="Next page"
              className="flex h-7 w-7 items-center justify-center rounded border border-border bg-background text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              title="Last page"
              className="flex h-7 w-7 items-center justify-center rounded border border-border bg-background text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>

          <span className="text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(endIndex, data.length)} of{" "}
            {data.length}
          </span>
        </div>
      </div>
    </div>
  );
}
