import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border/50 p-5 glass">
            <div className="flex items-start justify-between">
              <div className="space-y-3 flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-10 w-10 rounded-xl" />
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Activity Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-border/50 p-5 glass">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-8 w-44" />
          </div>
          <Skeleton className="h-[280px] w-full rounded-lg" />
        </div>
        <div className="rounded-xl border border-border/50 p-5 glass space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-4 w-12" />
          </div>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-2">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
