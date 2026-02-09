"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, Layers, Calendar } from "lucide-react";

type NewsletterStatus = "ALL" | "Draft" | "Submitted" | "Approved" | "Published";

interface NewsletterFiltersProps {
  statusFilter: NewsletterStatus;
  onStatusFilterChange: (value: NewsletterStatus) => void;
  dateFilterType: string;
  onDateFilterTypeChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
}

export function NewsletterFilters({
  statusFilter,
  onStatusFilterChange,
  dateFilterType,
  onDateFilterTypeChange,
  sortBy,
  onSortByChange,
}: NewsletterFiltersProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <div className="rounded-md border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[hsl(217,91%,40%)]" />
          <h3 className="text-sm font-semibold text-foreground">
            Dashboard Filters
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-7 text-xs"
        >
          {isCollapsed ? "Expand" : "Collapse"}
        </Button>
      </div>

      {!isCollapsed && (
        <div className="p-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Status Filter */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Layers className="h-3 w-3" />
                Status
              </label>
              <Select
                value={statusFilter}
                onValueChange={(v) =>
                  onStatusFilterChange(v as NewsletterStatus)
                }
              >
                <SelectTrigger className="h-9 bg-card text-foreground">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Submitted">Submitted</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Filter Type */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Calendar className="h-3 w-3" />
                Date Filter
              </label>
              <Select
                value={dateFilterType}
                onValueChange={onDateFilterTypeChange}
              >
                <SelectTrigger className="h-9 bg-card text-foreground">
                  <SelectValue placeholder="Filter by Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Dates</SelectItem>
                  <SelectItem value="created">Created Date</SelectItem>
                  <SelectItem value="submitted">Submitted Date</SelectItem>
                  <SelectItem value="approved">Approved Date</SelectItem>
                  <SelectItem value="published">Published Date</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Layers className="h-3 w-3" />
                Sort By
              </label>
              <Select value={sortBy} onValueChange={onSortByChange}>
                <SelectTrigger className="h-9 bg-card text-foreground">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_date_desc">
                    Created (Newest)
                  </SelectItem>
                  <SelectItem value="created_date_asc">
                    Created (Oldest)
                  </SelectItem>
                  <SelectItem value="updated_date_desc">
                    Updated (Newest)
                  </SelectItem>
                  <SelectItem value="updated_date_asc">
                    Updated (Oldest)
                  </SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="title">Title (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
