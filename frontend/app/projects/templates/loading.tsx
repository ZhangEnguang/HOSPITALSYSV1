"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="flex flex-col gap-4" style={{ background: "#F5F7FA", minHeight: "100%" }}>
      <div
        className="absolute top-0 left-0 right-0 h-[300px] -z-10"
        style={{
          background: "linear-gradient(180deg, rgba(39, 112, 255, 0.10) 0%, rgba(244, 246, 255, 0.00) 100%)",
        }}
      ></div>

      <div className="container mx-auto py-6 max-w-7xl">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" className="mr-2" disabled>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">项目模板库</h1>
        </div>

        <div className="relative mb-6">
          <Skeleton className="h-10 w-full" />
        </div>

        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="all" className="text-base py-3">
              全部模板
            </TabsTrigger>
            <TabsTrigger value="popular" className="text-base py-3">
              最近使用
            </TabsTrigger>
            <TabsTrigger value="recommended" className="text-base py-3">
              推荐模板
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <TemplateCardSkeleton key={index} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function TemplateCardSkeleton() {
  return (
    <Card className="overflow-hidden border-0 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-start">
          <Skeleton className="h-12 w-12 rounded-lg mr-4" />
          <div className="flex-1">
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-4 w-28" />
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-3" />
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-5 w-16 rounded-full" />
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-24 rounded-md" />
      </CardFooter>
    </Card>
  )
}

