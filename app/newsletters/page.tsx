"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PortalSidebar } from "@/components/portal-sidebar";
import { NewsletterFilters } from "@/components/newsletter-filters";
import { NewsletterTable, type Newsletter } from "@/components/newsletter-table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw, Plus, Home, FileText, CheckCircle2, Send, Edit3 } from "lucide-react";
import newslettersData from "@/data/newsletters_synthetic.json";

const tabs = [
  { label: "Newsletter Overview", active: true },
];

type NewsletterStatus = "ALL" | "Draft" | "Submitted" | "Approved" | "Published";

export default function NewslettersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<NewsletterStatus>("ALL");
  const [dateFilterType, setDateFilterType] = React.useState("ALL");
  const [sortBy, setSortBy] = React.useState("created_date_desc");
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);

  const filteredData = React.useMemo(() => {
    let result = (newslettersData as Newsletter[]).filter((newsletter) => {
      // Status filter
      if (statusFilter !== "ALL" && newsletter.status !== statusFilter) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          newsletter.title.toLowerCase().includes(q) ||
          newsletter.id.toLowerCase().includes(q) ||
          newsletter.created_by.toLowerCase().includes(q) ||
          newsletter.updated_by.toLowerCase().includes(q)
        );
      }

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "created_date_desc":
          return new Date(b.created_date).getTime() - new Date(a.created_date).getTime();
        case "created_date_asc":
          return new Date(a.created_date).getTime() - new Date(b.created_date).getTime();
        case "updated_date_desc":
          return new Date(b.updated_date).getTime() - new Date(a.updated_date).getTime();
        case "updated_date_asc":
          return new Date(a.updated_date).getTime() - new Date(b.updated_date).getTime();
        case "status":
          return a.status.localeCompare(b.status);
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return result;
  }, [searchQuery, statusFilter, sortBy]);

  const statistics = React.useMemo(() => {
    const total = (newslettersData as Newsletter[]).length;
    const draft = (newslettersData as Newsletter[]).filter((n) => n.status === "Draft").length;
    const submitted = (newslettersData as Newsletter[]).filter((n) => n.status === "Submitted").length;
    const approved = (newslettersData as Newsletter[]).filter((n) => n.status === "Approved").length;
    const published = (newslettersData as Newsletter[]).filter((n) => n.status === "Published").length;
    return { total, draft, submitted, approved, published };
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleView = (newsletter: Newsletter) => {
    console.log("View newsletter:", newsletter.id);
    // Navigate to view page
  };

  const handleEdit = (newsletter: Newsletter) => {
    console.log("Edit newsletter:", newsletter.id);
    // Navigate to edit page
  };

  const handleCreate = () => {
    console.log("Create new newsletter");
    // Navigate to create page
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
                  Newsletter Service
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
              size="sm"
              className="gap-1.5"
              onClick={handleCreate}
            >
              <Plus className="h-3.5 w-3.5" />
              Create Newsletter
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
            <NewsletterFilters
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              dateFilterType={dateFilterType}
              onDateFilterTypeChange={setDateFilterType}
              sortBy={sortBy}
              onSortByChange={setSortBy}
            />

            {/* Section Title */}
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Newsletter Statistics
              </h2>
            </div>

            {/* Statistics Cards */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <Card className="border-border bg-card transition-all hover:border-primary/50">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                    Total Newsletters
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tracking-tight text-foreground">
                    {statistics.total}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card transition-all hover:border-gray-400">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                    Draft
                    <Edit3 className="h-3.5 w-3.5 text-gray-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tracking-tight text-gray-600">
                    {statistics.draft}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card transition-all hover:border-blue-400">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                    Submitted
                    <Send className="h-3.5 w-3.5 text-blue-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tracking-tight text-blue-600">
                    {statistics.submitted}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card transition-all hover:border-emerald-400">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                    Approved
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tracking-tight text-emerald-600">
                    {statistics.approved}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card transition-all hover:border-green-500">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                    Published
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tracking-tight text-green-700">
                    {statistics.published}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Table */}
            <NewsletterTable
              data={filteredData}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={setItemsPerPage}
              onView={handleView}
              onEdit={handleEdit}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
