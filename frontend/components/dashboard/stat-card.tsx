"use client"

import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

// 统计卡片组件
interface StatCardProps {
  title: string
  value: string
  change: string
  icon: React.ReactNode
  type: "projects" | "tasks" | "funding" | "achievements"
}

export function StatCard({ title, value, change, icon, type }: StatCardProps) {
  const router = useRouter()

  const handleClick = () => {
    switch (type) {
      case "projects":
      case "tasks":
        router.push("/todo")
        break
      case "funding":
        router.push("/funding")
        break
      case "achievements":
        router.push("/achievements")
        break
    }
  }

  // 处理变化值的显示
  const renderChange = () => {
    if (type === "projects") {
      return <p className="text-xs text-muted-foreground">较昨日 <span className="text-red-600">+2</span></p>
    }
    if (type === "tasks") {
      return <p className="text-xs text-muted-foreground">其中 <span className="text-red-600">15</span> 项紧急任务</p>
    }
    if (change.startsWith("+")) {
      return <p className="text-xs text-muted-foreground"><span className="text-red-600">{change}</span></p>
    }
    if (change.startsWith("-")) {
      return <p className="text-xs text-muted-foreground"><span className="text-red-600">{change}</span></p>
    }
    return <p className="text-xs text-muted-foreground">{change}</p>
  }

  return (
    <div className="transform-gpu transition-transform duration-300 ease-out hover:-translate-y-1">
      <Card 
        className={cn(
          "group border border-[#E9ECF2] shadow-none flex flex-col cursor-pointer",
          "transition-[border-color,box-shadow] duration-300 ease-out",
          "hover:border-primary/20",
          "hover:shadow-[0px_100px_80px_0px_rgba(212,_212,_219,_0.07),_0px_41.778px_33.422px_0px_rgba(212,_212,_219,_0.05),_0px_22.336px_17.869px_0px_rgba(212,_212,_219,_0.04),_0px_12.522px_10.017px_0px_rgba(212,_212,_219,_0.04),_0px_6.65px_5.32px_0px_rgba(212,_212,_219,_0.03),_0px_2.767px_2.214px_0px_rgba(212,_212,_219,_0.02)]"
        )}
        onClick={handleClick}
      >
        <div className="flex items-center justify-between p-6">
          <div className="space-y-1">
            <CardTitle className="text-[14px] font-medium text-muted-foreground">{title}</CardTitle>
            <div className="text-2xl font-bold">{value}</div>
            {renderChange()}
          </div>
          <div className="p-3 bg-primary/10 rounded-lg flex items-center justify-center transition-colors duration-300 ease-out group-hover:bg-primary/20">
            {React.cloneElement(icon as React.ReactElement, { 
              className: "h-6 w-6 text-primary transition-transform duration-300 ease-out group-hover:scale-110" 
            })}
          </div>
        </div>
      </Card>
    </div>
  )
}

