"use client";

import * as React from "react";
import { PortalSidebar } from "@/components/portal-sidebar";
import { DashboardFilters } from "@/components/dashboard-filters";
import { CamlogTable, type CamlogRow } from "@/components/camlog-table";
import { KpiCards } from "@/components/kpi-cards";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download, Home } from "lucide-react";
import camLogsData from "@/data/cam_logs_synthetic.json";

const tabs = [
  { label: "Camlog Overview", active: true },
];

function isError(row: CamlogRow): boolean {
  return (
    row.ERR === "Y" ||
    row.eventtype === "error" ||
    row.tag === "error" ||
    row.tag_eventtype === "error"
  );
}

export default function Page() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"ALL" | "OK" | "ERROR">("ALL");
  const [serviceFilter, setServiceFilter] = React.useState("ALL");
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);

  const filteredData = React.useMemo(() => {
    return (camLogsData as CamlogRow[])
      .filter((row) => {
        if (statusFilter === "ALL") return true;
        const hasError = isError(row);
        return statusFilter === "ERROR" ? hasError : !hasError;
      })
      .filter((row) => (serviceFilter === "ALL" ? true : row.CMLG_SERVICE_NAME === serviceFilter))
      .filter((row) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          row.CMLG_TRACE_ID.toLowerCase().includes(q) ||
          row.CMLG_ACTION.toLowerCase().includes(q) ||
          row.CMLG_SERVICE_NAME.toLowerCase().includes(q) ||
          row.CMLG_CORRELATION_ID.toLowerCase().includes(q) ||
          row.CMLG_ID.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        // Sort by timestamp, newest first
        return new Date(b.CMLG_TIMESTAMP).getTime() - new Date(a.CMLG_TIMESTAMP).getTime();
      });
  }, [searchQuery, statusFilter, serviceFilter]);

  const statistics = React.useMemo(() => {
    const total = filteredData.length;
    const errors = filteredData.filter((r) => isError(r)).length;
    const ok = total - errors;
    return { total, ok, errors };
  }, [filteredData]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <PortalSidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center justify-between border-b border-border bg-card px-4 py-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#" className="flex items-center gap-1.5 text-muted-foreground">
                  <Home className="h-3.5 w-3.5" />
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium text-foreground">
                  Camlog Monitor
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 bg-transparent"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 bg-transparent"
            >
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
          </div>
        </header>

        {/* Tabs */}
        <div className="border-b border-border bg-card px-4">
          <nav className="flex gap-0">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                type="button"
                className={`border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
                  tab.active
                    ? "border-[hsl(217,91%,40%)] text-[hsl(217,91%,40%)]"
                    : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <main className="flex flex-1 flex-col overflow-hidden px-4 py-3">
          <div className="flex flex-1 flex-col gap-3 overflow-hidden">
            {/* Filters */}
            <DashboardFilters
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              sourceFilter={serviceFilter}
              onSourceFilterChange={setServiceFilter}
              actionCodeFilter={serviceFilter}
              onActionCodeFilterChange={setServiceFilter}
            />

            {/* Section Title */}
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Event Statistics
              </h2>
            </div>

            {/* KPI Cards */}
            <KpiCards
              total={statistics.total}
              green={statistics.ok}
              red={statistics.errors}
              totalRecords={(camLogsData as CamlogRow[]).length}
            />

            {/* Table */}
            <CamlogTable
              data={filteredData}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
