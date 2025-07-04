"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function ScoringLoading() {
  return (
    <div className="container max-w-4xl py-6">
      <div className="flex items-center mb-6">
        <Skeleton className="h-10 w-10 rounded-full mr-2" />
        <Skeleton className="h-8 w-48" />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-6 w-32" />
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-6 w-10" />
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-2 w-full mb-4" />
              </div>
            ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-8 w-16" />
            </div>
            <Skeleton className="h-4 w-full mb-6" />
          </div>

          <Skeleton className="h-5 w-32 mb-3" />
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex items-center space-x-2 mb-3">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-5 w-48" />
              </div>
            ))}

          <Skeleton className="h-5 w-32 mt-6 mb-2" />
          <Skeleton className="h-32 w-full mb-4" />

          <div className="flex justify-between mt-6">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

