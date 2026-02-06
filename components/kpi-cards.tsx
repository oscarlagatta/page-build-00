"use client";

import { Activity, CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";

interface KpiCardsProps {
  total: number;
  green: number;
  red: number;
  totalRecords: number;
}

export function KpiCards({ total, green, red, totalRecords }: KpiCardsProps) {
  const greenPct = totalRecords > 0 ? Math.round((green / totalRecords) * 100) : 0;
  const redPct = totalRecords > 0 ? Math.round((red / totalRecords) * 100) : 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Events */}
      <div className="rounded-md border border-border bg-card px-5 py-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Total Events
          </span>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="mt-2 text-3xl font-bold text-foreground">{total}</div>
        <p className="mt-1 text-xs text-muted-foreground">
          Filtered from {totalRecords} total records
        </p>
      </div>

      {/* Green Status */}
      <div className="rounded-md border border-emerald-200 bg-emerald-50 px-5 py-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-emerald-700">
            Healthy (Green)
          </span>
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
        </div>
        <div className="mt-2 text-3xl font-bold text-emerald-700">{green}</div>
        <div className="mt-1 flex items-center gap-1.5">
          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-emerald-200">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${greenPct}%` }}
            />
          </div>
          <span className="text-xs font-medium text-emerald-600">{greenPct}%</span>
        </div>
      </div>

      {/* Red Status */}
      <div className="rounded-md border border-red-200 bg-red-50 px-5 py-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-red-700">
            Critical (Red)
          </span>
          <AlertCircle className="h-4 w-4 text-red-600" />
        </div>
        <div className="mt-2 text-3xl font-bold text-red-700">{red}</div>
        <div className="mt-1 flex items-center gap-1.5">
          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-red-200">
            <div
              className="h-full rounded-full bg-red-500 transition-all"
              style={{ width: `${redPct}%` }}
            />
          </div>
          <span className="text-xs font-medium text-red-600">{redPct}%</span>
        </div>
      </div>

      {/* Health Score */}
      <div className="rounded-md border border-border bg-card px-5 py-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Health Score
          </span>
          <TrendingUp className="h-4 w-4 text-[hsl(217,91%,40%)]" />
        </div>
        <div className="mt-2 text-3xl font-bold text-foreground">{greenPct}%</div>
        <p className="mt-1 text-xs text-muted-foreground">
          Based on GREEN / total ratio
        </p>
      </div>
    </div>
  );
}
