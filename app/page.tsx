"use client";

import * as React from "react";
import { PortalSidebar } from "@/components/portal-sidebar";
import { DashboardFilters } from "@/components/dashboard-filters";
import { CamlogTable } from "@/components/camlog-table";
import type { CamlogRow, CamlogStatus } from "@/components/camlog-table";
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

const mockData: CamlogRow[] = [
  { actionCode: "AC-102", id: "WTX-884120", timestamp: "2026-02-06T13:42:10Z", status: "GREEN", source: "Splunk", metricType: "Performance", value: "3339.73", target: "0.00", leader: "0.00" },
  { actionCode: "AC-221", id: "WTX-884121", timestamp: "2026-02-06T13:45:02Z", status: "RED", source: "DataMart", metricType: "Operational", value: "1.41%", target: "2.00%", leader: "2.50%" },
  { actionCode: "AC-102", id: "WTX-884122", timestamp: "2026-02-06T13:47:55Z", status: "GREEN", source: "Splunk", metricType: "Performance", value: "686.39", target: "0.00", leader: "0.00" },
  { actionCode: "AC-310", id: "WTX-884123", timestamp: "2026-02-06T13:50:09Z", status: "GREEN", source: "DataMart", metricType: "Operational", value: "0.76%", target: "1.00%", leader: "1.50%" },
  { actionCode: "AC-155", id: "WTX-884124", timestamp: "2026-02-06T13:52:31Z", status: "RED", source: "Splunk", metricType: "Performance", value: "57.14%", target: "46.50%", leader: "52.00%" },
  { actionCode: "AC-102", id: "WTX-884125", timestamp: "2026-02-06T13:55:08Z", status: "GREEN", source: "DataMart", metricType: "Operational", value: "0.00", target: "3.00", leader: "4.00" },
  { actionCode: "AC-421", id: "WTX-884126", timestamp: "2026-02-06T13:58:44Z", status: "GREEN", source: "Splunk", metricType: "Performance", value: "100.00%", target: "80.50%", leader: "73.00%" },
  { actionCode: "AC-221", id: "WTX-884127", timestamp: "2026-02-06T14:01:19Z", status: "RED", source: "DataMart", metricType: "Operational", value: "NDTR", target: "45.00%", leader: "0.00%" },
  { actionCode: "AC-310", id: "WTX-884128", timestamp: "2026-02-06T14:04:52Z", status: "GREEN", source: "Splunk", metricType: "Performance", value: "444.12", target: "0.00", leader: "0.00" },
  { actionCode: "AC-102", id: "WTX-884129", timestamp: "2026-02-06T14:07:28Z", status: "GREEN", source: "DataMart", metricType: "Operational", value: "91.84%", target: "83.50%", leader: "81.00%" },
  { actionCode: "AC-155", id: "WTX-884130", timestamp: "2026-02-06T14:10:15Z", status: "GREEN", source: "Splunk", metricType: "Performance", value: "5880.73", target: "0.00", leader: "0.00" },
  { actionCode: "AC-421", id: "WTX-884131", timestamp: "2026-02-06T14:13:42Z", status: "RED", source: "DataMart", metricType: "Operational", value: "NDTR", target: "95.00%", leader: "90.00%" },
  { actionCode: "AC-310", id: "WTX-884132", timestamp: "2026-02-06T14:16:30Z", status: "GREEN", source: "Splunk", metricType: "Performance", value: "100.00%", target: "96.00%", leader: "91.50%" },
  { actionCode: "AC-102", id: "WTX-884133", timestamp: "2026-02-06T14:19:55Z", status: "GREEN", source: "DataMart", metricType: "Operational", value: "100.00%", target: "85.00%", leader: "80.00%" },
  { actionCode: "AC-221", id: "WTX-884134", timestamp: "2026-02-06T14:22:18Z", status: "RED", source: "Splunk", metricType: "Performance", value: "0.00", target: "0.00", leader: "2.00" },
];

const tabs = [
  { label: "Camlog Overview", active: true },
];

export default function Page() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"ALL" | CamlogStatus>("ALL");
  const [sourceFilter, setSourceFilter] = React.useState("ALL");
  const [actionCodeFilter, setActionCodeFilter] = React.useState("ALL");
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);

  const filteredData = React.useMemo(() => {
    return mockData
      .filter((row) => (statusFilter === "ALL" ? true : row.status === statusFilter))
      .filter((row) => (sourceFilter === "ALL" ? true : row.source === sourceFilter))
      .filter((row) => (actionCodeFilter === "ALL" ? true : row.actionCode === actionCodeFilter))
      .filter((row) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          row.actionCode.toLowerCase().includes(q) ||
          row.id.toLowerCase().includes(q) ||
          row.timestamp.toLowerCase().includes(q) ||
          row.value.toLowerCase().includes(q)
        );
      });
  }, [searchQuery, statusFilter, sourceFilter, actionCodeFilter]);

  const statistics = React.useMemo(() => {
    const total = filteredData.length;
    const green = filteredData.filter((r) => r.status === "GREEN").length;
    const red = filteredData.filter((r) => r.status === "RED").length;
    return { total, green, red };
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
              sourceFilter={sourceFilter}
              onSourceFilterChange={setSourceFilter}
              actionCodeFilter={actionCodeFilter}
              onActionCodeFilterChange={setActionCodeFilter}
            />

            {/* Section Title */}
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Metrics Overview
              </h2>
            </div>

            {/* KPI Cards */}
            <KpiCards
              total={statistics.total}
              green={statistics.green}
              red={statistics.red}
              totalRecords={mockData.length}
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
