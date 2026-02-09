"use client";

import * as React from "react";
import { PortalSidebar } from "@/components/portal-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Home, Plus } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import newslettersData from "@/data/newsletters_synthetic.json";

export default function NewslettersPage() {
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
                <BreadcrumbLink
                  href="/"
                  className="flex items-center gap-1.5 text-muted-foreground"
                >
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
            <Button size="sm" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              Create Newsletter
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="flex flex-1 flex-col overflow-hidden p-6">
          <div className="mb-6 flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
            <p className="text-muted-foreground">
              Here's a list of newsletters for management.
            </p>
          </div>

          <DataTable columns={columns} data={newslettersData} />
        </main>
      </div>
    </div>
  );
}
