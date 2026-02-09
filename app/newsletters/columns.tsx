"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal, Eye, Edit } from "lucide-react";

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

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${month} ${day}, ${year} ${hours}:${minutes}`;
}

export const columns: ColumnDef<Newsletter>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-1.5 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-mono text-xs font-medium">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-1.5 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("title")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-1.5 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant="outline"
          className={
            status === "Published"
              ? "border-green-300 bg-green-50 text-green-700"
              : status === "Approved"
                ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                : status === "Submitted"
                  ? "border-blue-300 bg-blue-50 text-blue-700"
                  : "border-gray-300 bg-gray-50 text-gray-700"
          }
        >
          {status}
        </Badge>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "created_by",
    header: "Created By",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {row.getValue("created_by")}
      </div>
    ),
  },
  {
    accessorKey: "created_date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created Date
          <ArrowUpDown className="ml-1.5 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-xs text-muted-foreground">
          {formatDate(row.getValue("created_date"))}
        </div>
      );
    },
  },
  {
    accessorKey: "updated_by",
    header: "Updated By",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {row.getValue("updated_by")}
      </div>
    ),
  },
  {
    accessorKey: "updated_date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Updated Date
          <ArrowUpDown className="ml-1.5 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-xs text-muted-foreground">
          {formatDate(row.getValue("updated_date"))}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const newsletter = row.original;
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const router = useRouter();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(newsletter.id)}
            >
              Copy newsletter ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push(`/newsletters/${newsletter.id}`)}
            >
              <Eye className="mr-2 h-3.5 w-3.5" />
              View newsletter
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push(`/newsletters/${newsletter.id}`)}
            >
              <Edit className="mr-2 h-3.5 w-3.5" />
              Edit newsletter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
