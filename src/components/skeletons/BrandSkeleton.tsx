import { Skeleton } from "@/components/ui/skeleton";

export const BrandSkeleton = () => {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 rounded-lg" />
          <Skeleton className="h-4 w-72 rounded-lg" />
        </div>

        <Skeleton className="h-11 w-40 rounded-xl" />
      </div>

      <div className="rounded-2xl border bg-white p-4">
        <Skeleton className="h-11 w-full max-w-sm rounded-xl" />
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white">
        <div className="border-b bg-slate-50 px-5 py-4">
          <div className="grid grid-cols-8 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-4 rounded-lg" />
            ))}
          </div>
        </div>

        <div className="divide-y">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-8 items-center gap-4 px-5 py-5"
            >
              <Skeleton className="h-4 w-4 rounded" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28 rounded-lg" />
                  <Skeleton className="h-3 w-20 rounded-lg" />
                </div>
              </div>
              <Skeleton className="h-7 w-24 rounded-full" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <Skeleton className="h-4 w-24 rounded-lg" />
              <Skeleton className="h-4 w-24 rounded-lg" />
              <Skeleton className="h-7 w-24 rounded-full" />
              <div className="flex justify-center gap-2">
                <Skeleton className="h-9 w-9 rounded-lg" />
                <Skeleton className="h-9 w-9 rounded-lg" />
                <Skeleton className="h-9 w-9 rounded-lg" />
              </div>
            </div>
          ))}
        </div>

        <div className="border-t px-5 py-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32 rounded-lg" />

            <div className="flex gap-2">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-10 w-10 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
