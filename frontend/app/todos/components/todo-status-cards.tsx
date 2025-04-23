"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TodoStatusCardsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  pendingCount?: number
  completedCount?: number
}

export default function TodoStatusCards({ 
  activeTab, 
  onTabChange,
  pendingCount = 0,
  completedCount = 0 
}: TodoStatusCardsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-[300px]">
      <TabsList>
        <TabsTrigger value="pending" className="flex-1">
          待审核 {pendingCount !== undefined && `(${pendingCount})`}
        </TabsTrigger>
        <TabsTrigger value="completed" className="flex-1">
          已审核 {completedCount !== undefined && `(${completedCount})`}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
