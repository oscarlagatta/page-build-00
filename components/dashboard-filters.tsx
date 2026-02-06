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

type CamlogStatus = "GREEN" | "RED";

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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {/* Reporting Period */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Calendar className="h-3 w-3" />
                Reporting Period
              </label>
              <Select defaultValue="all">
                <SelectTrigger className="h-9 bg-card text-foreground">
                  <SelectValue placeholder="All Months" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Months</SelectItem>
                  <SelectItem value="jan">January 2026</SelectItem>
                  <SelectItem value="feb">February 2026</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Code Filter */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Tag className="h-3 w-3" />
                Action Code
              </label>
              <Select
                value={actionCodeFilter}
                onValueChange={onActionCodeFilterChange}
              >
                <SelectTrigger className="h-9 bg-card text-foreground">
                  <SelectValue placeholder="All Action Codes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Action Codes</SelectItem>
                  <SelectItem value="AC-102">AC-102</SelectItem>
                  <SelectItem value="AC-221">AC-221</SelectItem>
                  <SelectItem value="AC-310">AC-310</SelectItem>
                  <SelectItem value="AC-155">AC-155</SelectItem>
                  <SelectItem value="AC-421">AC-421</SelectItem>
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
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="GREEN">Green Only</SelectItem>
                  <SelectItem value="RED">Red Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Source */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Database className="h-3 w-3" />
                Source
              </label>
              <Select
                value={sourceFilter}
                onValueChange={onSourceFilterChange}
              >
                <SelectTrigger className="h-9 bg-card text-foreground">
                  <SelectValue placeholder="All Sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Sources</SelectItem>
                  <SelectItem value="Splunk">Splunk</SelectItem>
                  <SelectItem value="DataMart">DataMart</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Leader */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <User className="h-3 w-3" />
                Leader
              </label>
              <Select defaultValue="all">
                <SelectTrigger className="h-9 bg-card text-foreground">
                  <SelectValue placeholder="All Leaders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Leaders</SelectItem>
                  <SelectItem value="ops">Operations</SelectItem>
                  <SelectItem value="eng">Engineering</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
