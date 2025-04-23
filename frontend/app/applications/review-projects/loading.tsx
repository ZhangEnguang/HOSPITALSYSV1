import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F7FA] p-6 space-y-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-6 w-32" />
      </div>

      <Skeleton className="h-16 w-full rounded-lg" />

      <div className="bg-white rounded-lg p-4 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-32" />
        </div>

        {Array(5)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="flex items-center gap-4 py-4 border-b">
              <Skeleton className="h-4 w-4" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
      </div>

      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  )
}

