import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  type?: string
  icon?: React.ReactNode
  className?: string
}

export function StatCard({ title, value, change, type, icon, className }: StatCardProps) {
  const renderChange = () => {
    if (type === "projects") {
      return <p className="text-xs text-muted-foreground">较昨日 <span className="text-red-600">+2</span></p>
    }
    if (type === "tasks") {
      return <p className="text-xs text-muted-foreground">其中 <span className="text-red-600">15</span> 项紧急任务</p>
    }
    if (change?.startsWith("+")) {
      return <p className="text-xs text-muted-foreground"><span className="text-red-600">{change}</span></p>
    }
    if (change?.startsWith("-")) {
      return <p className="text-xs text-muted-foreground"><span className="text-red-600">{change}</span></p>
    }
    return <p className="text-xs text-muted-foreground">{change}</p>
  }

  return (
    <Card className={cn("hover:shadow-md transition-all duration-200", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && renderChange()}
      </CardContent>
    </Card>
  )
} 