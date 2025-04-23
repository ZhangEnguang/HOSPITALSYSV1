import { Skeleton } from "@/components/ui/skeleton"
import { FileText } from "lucide-react"

export default function DocumentsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-semibold tracking-tight">文档共享</h1>
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>

      <div className="flex items-center gap-3 mt-6">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-20" />
      </div>

      <div className="mt-6">
        <Skeleton className="h-10 w-full mb-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-[300px] w-full" />
            ))}
        </div>
      </div>
    </div>
  )
}

