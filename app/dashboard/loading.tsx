import { Skeleton } from "@/components/ui/skeleton";

function TopProgress() {
  return (
    <div className="sticky top-0 z-20 -mx-2">
      <div className="relative h-0.5 overflow-hidden rounded-full bg-border/60">
        <div
          className="absolute inset-y-0 left-0 w-1/2 rounded-full bg-gradient-to-r from-indigo-500/60 via-sky-400/60 to-violet-500/60"
          style={{ animation: "loading-bar 1.1s ease-in-out infinite" }}
        />
      </div>
    </div>
  );
}

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <TopProgress />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-2xl border border-border/50 p-5 glass"
          >
            {/* shimmer sweep */}
            <div aria-hidden className="absolute inset-0 shimmer opacity-60" />

            <div className="relative flex items-start justify-between">
              <div className="space-y-3 flex-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-10 w-10 rounded-2xl" />
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 relative overflow-hidden rounded-2xl border border-border/50 p-5 glass">
          <div aria-hidden className="absolute inset-0 shimmer opacity-55" />

          <div className="relative flex items-center justify-between mb-6">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-9 w-52 rounded-full" />
          </div>

          {/* plot skeleton */}
          <div className="relative">
            <div className="grid grid-cols-12 gap-2 items-end h-[280px]">
              {Array.from({ length: 12 }).map((_, idx) => (
                <div
                  key={idx}
                  className="rounded-md bg-foreground/5 dark:bg-white/5"
                  style={{
                    height: `${35 + ((idx * 17) % 60)}%`,
                    animation: `fade-in 0.35s ease-out ${idx * 30}ms both`,
                  }}
                />
              ))}
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2 opacity-70">
              <Skeleton className="h-3 w-14" />
              <Skeleton className="h-3 w-14" />
              <Skeleton className="h-3 w-14" />
              <Skeleton className="h-3 w-14" />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-border/50 p-5 glass">
          <div aria-hidden className="absolute inset-0 shimmer opacity-55" />

          <div className="relative flex items-center justify-between mb-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-7 w-14 rounded-full" />
          </div>

          <div className="relative space-y-3">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-xl">
                <Skeleton className="w-9 h-9 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-3 w-10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
