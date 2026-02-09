"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronUp, Filter, Calendar, User, Tag, Layers, Database } from "lucide-react";

type CamlogStatus = "OK" | "ERROR";

interface DashboardFiltersProps {
  statusFilter: "ALL" | CamlogStatus;
  onStatusFilterChange: (value: "ALL" | CamlogStatus) => void;
  sourceFilter: string;
  onSourceFilterChange: (value: string) => void;
  actionCodeFilter: string;
  onActionCodeFilterChange: (value: string) => void;
}

export function DashboardFilters({
  statusFilter,
  onStatusFilterChange,
  sourceFilter,
  onSourceFilterChange,
  actionCodeFilter,
  onActionCodeFilterChange,
}: DashboardFiltersProps) {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className="rounded-md border border-border bg-card">
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="flex w-full items-center justify-between px-5 py-3"
      >
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">
            Dashboard Filters
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {collapsed ? "Expand" : "Collapse"}
          </span>
          {collapsed ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {!collapsed && (
        <div className="border-t border-border px-5 py-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            {/* Service Name Filter */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Tag className="h-3 w-3" />
                Service Name
              </label>
              <Select
                value={actionCodeFilter}
                onValueChange={onActionCodeFilterChange}
              >
                <SelectTrigger className="h-9 bg-card text-foreground">
                  <SelectValue placeholder="All Services" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Services</SelectItem>
                  <SelectItem value="APIPaymentsControllerV2">APIPaymentsControllerV2</SelectItem>
                  <SelectItem value="Approvals">Approvals</SelectItem>
                  <SelectItem value="GPOTxnEventListener">GPOTxnEventListener</SelectItem>
                  <SelectItem value="OPHConfigCheck">OPHConfigCheck</SelectItem>
                  <SelectItem value="Orchestration">Orchestration</SelectItem>
                  <SelectItem value="PaymentRetrieval">PaymentRetrieval</SelectItem>
                  <SelectItem value="PubsubService">PubsubService</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Layers className="h-3 w-3" />
                Status
              </label>
              <Select
                value={statusFilter}
                onValueChange={(v) =>
                  onStatusFilterChange(v as "ALL" | CamlogStatus)
                }
              >
                <SelectTrigger className="h-9 bg-card text-foreground">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Events</SelectItem>
                  <SelectItem value="OK">OK Only</SelectItem>
                  <SelectItem value="ERROR">Errors Only</SelectItem>
                </SelectContent>
              </Select>
            </div>


          </div>
        </div>
      )}
    </div>
  );
}
