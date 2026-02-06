"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Activity, AlertCircle, CheckCircle2, RefreshCw, Search } from "lucide-react";

type CamlogStatus = "GREEN" | "RED";

type CamlogRow = {
  actionCode: string;
  id: string;
  timestamp: string;
  status: CamlogStatus;
};

const mockData: CamlogRow[] = [
  { actionCode: "AC-102", id: "WTX-884120", timestamp: "2026-02-06T13:42:10Z", status: "GREEN" },
  { actionCode: "AC-221", id: "WTX-884121", timestamp: "2026-02-06T13:45:02Z", status: "RED" },
  { actionCode: "AC-102", id: "WTX-884122", timestamp: "2026-02-06T13:47:55Z", status: "GREEN" },
  { actionCode: "AC-310", id: "WTX-884123", timestamp: "2026-02-06T13:50:09Z", status: "GREEN" },
  { actionCode: "AC-155", id: "WTX-884124", timestamp: "2026-02-06T13:52:31Z", status: "RED" },
  { actionCode: "AC-102", id: "WTX-884125", timestamp: "2026-02-06T13:55:08Z", status: "GREEN" },
  { actionCode: "AC-421", id: "WTX-884126", timestamp: "2026-02-06T13:58:44Z", status: "GREEN" },
  { actionCode: "AC-221", id: "WTX-884127", timestamp: "2026-02-06T14:01:19Z", status: "RED" },
  { actionCode: "AC-310", id: "WTX-884128", timestamp: "2026-02-06T14:04:52Z", status: "GREEN" },
  { actionCode: "AC-102", id: "WTX-884129", timestamp: "2026-02-06T14:07:28Z", status: "GREEN" },
];

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

function StatusBadge({ status }: { status: CamlogStatus }) {
  const isGreen = status === "GREEN";
  return (
    <Badge
      className={[
        "flex w-20 items-center justify-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide",
        isGreen
          ? "bg-emerald-500 text-white hover:bg-emerald-500"
          : "bg-red-500 text-white hover:bg-red-500",
      ].join(" ")}
    >
      {isGreen ? (
        <CheckCircle2 className="h-3 w-3" />
      ) : (
        <AlertCircle className="h-3 w-3" />
      )}
      {status}
    </Badge>
  );
}

export default function Page() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"ALL" | CamlogStatus>("ALL");
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const filteredData = React.useMemo(() => {
    return mockData
      .filter((row) => (statusFilter === "ALL" ? true : row.status === statusFilter))
      .filter((row) => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return (
          row.actionCode.toLowerCase().includes(query) ||
          row.id.toLowerCase().includes(query) ||
          row.timestamp.toLowerCase().includes(query)
        );
      });
  }, [searchQuery, statusFilter]);

  const statistics = React.useMemo(() => {
    const total = filteredData.length;
    const green = filteredData.filter((row) => row.status === "GREEN").length;
    const red = filteredData.filter((row) => row.status === "RED").length;
    return { total, green, red };
  }, [filteredData]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                  <Activity className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground">
                    Camlog Intelligence Portal
                  </h1>
                  <p className="text-pretty text-sm text-muted-foreground">
                    Real-time event monitoring powered by Splunk analytics
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="gap-2 bg-transparent"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button className="gap-2">
                <Activity className="h-4 w-4" />
                Live View
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        {/* KPI Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-border bg-card transition-all hover:border-primary/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                Total Events
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold tracking-tight text-foreground">
                {statistics.total}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Filtered from {mockData.length} total records
              </p>
            </CardContent>
          </Card>

          <Card className="border-border bg-card transition-all hover:border-emerald-500/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                Healthy Status
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold tracking-tight text-emerald-500">
                {statistics.green}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Badge className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white hover:bg-emerald-500">
                  GREEN
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {mockData.length > 0
                    ? Math.round((statistics.green / mockData.length) * 100)
                    : 0}
                  % of total
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card transition-all hover:border-red-500/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                Critical Status
                <AlertCircle className="h-4 w-4 text-red-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold tracking-tight text-red-500">
                {statistics.red}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Badge className="rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white hover:bg-red-500">
                  RED
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Requires immediate attention
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Table Section */}
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl font-bold text-foreground">
                  Camlog Event Stream
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Displaying {filteredData.length} event
                  {filteredData.length === 1 ? "" : "s"} with real-time status
                  monitoring
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by action code or ID..."
                    className="w-full pl-10 sm:w-[280px]"
                  />
                </div>

                <Select
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value as "ALL" | CamlogStatus)}
                >
                  <SelectTrigger className="w-full sm:w-[160px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Status</SelectItem>
                    <SelectItem value="GREEN">Green Only</SelectItem>
                    <SelectItem value="RED">Red Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="overflow-hidden rounded-lg border border-border">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">Action Code</TableHead>
                      <TableHead className="font-semibold">Event ID</TableHead>
                      <TableHead className="font-semibold">Timestamp</TableHead>
                      <TableHead className="text-center font-semibold">Status</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredData.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="h-32 text-center text-muted-foreground"
                        >
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Search className="h-8 w-8 text-muted-foreground/50" />
                            <p className="text-sm">
                              No events found. Try adjusting your filters.
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredData.map((row) => (
                        <TableRow
                          key={row.id}
                          className="transition-colors hover:bg-muted/30"
                        >
                          <TableCell className="font-mono text-sm font-medium">
                            {row.actionCode}
                          </TableCell>
                          <TableCell className="font-mono text-sm text-muted-foreground">
                            {row.id}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatTimestamp(row.timestamp)}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center">
                              <StatusBadge status={row.status} />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4 border-t border-border pt-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                <span>Data Source: Splunk Enterprise (MVP uses mock data)</span>
              </div>
              <div>Status Logic: CPT Tools RED/GREEN classification</div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
