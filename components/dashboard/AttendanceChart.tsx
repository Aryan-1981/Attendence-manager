import dynamic from "next/dynamic";

const AttendanceChartClient = dynamic(
  () => import("@/components/dashboard/AttendanceChartClient"),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-xl border border-border/50 p-5 glass">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <div className="h-4 w-32 rounded-md bg-muted/50 shimmer" />
            <div className="h-3 w-48 rounded-md bg-muted/30 shimmer" />
          </div>
          <div className="h-8 w-44 rounded-lg bg-muted/30 shimmer" />
        </div>
        <div className="h-[280px] w-full rounded-lg bg-muted/20 shimmer" />
        <div className="mt-4 flex items-center justify-center gap-6">
          <div className="h-3 w-20 rounded bg-muted/30 shimmer" />
          <div className="h-3 w-20 rounded bg-muted/30 shimmer" />
        </div>
      </div>
    ),
  }
);

export function AttendanceChart() {
  return <AttendanceChartClient />;
}
