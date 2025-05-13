"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface EnhancedProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  showValue?: boolean
  max?: number
  variant?: "default" | "success" | "warning" | "danger"
  size?: "sm" | "md" | "lg"
  showAnimation?: boolean
  showSegmentMarkers?: boolean
  showSegmentLabels?: boolean
}

export function EnhancedProgress({
  value,
  max = 100,
  variant = "default",
  size = "md",
  showValue = false,
  showAnimation = true,
  showSegmentMarkers = true,
  showSegmentLabels = false,
  className,
  ...props
}: EnhancedProgressProps) {
  const percentage = Math.min(Math.max(0, (value / max) * 100), 100)
  
  // 变体样式
  const variantStyles = {
    default: "from-blue-500 to-indigo-600",
    success: "from-emerald-400 to-emerald-600",
    warning: "from-amber-400 to-amber-600",
    danger: "from-red-400 to-red-600",
  }
  
  // 尺寸样式
  const sizeStyles = {
    sm: "h-1.5 text-[10px]",
    md: "h-2.5 text-xs",
    lg: "h-4 text-sm",
  }
  
  // 计算进度条颜色，根据进度区段显示不同颜色
  const getProgressColor = () => {
    if (variant !== "default") return variantStyles[variant]
    if (percentage < 33) return "from-blue-400 to-blue-500"
    if (percentage < 66) return "from-blue-500 via-indigo-500 to-indigo-600"
    return "from-indigo-500 via-violet-500 to-violet-600"
  }
  
  return (
    <div className={cn("relative w-full", showValue || showSegmentLabels ? "space-y-1" : "")}>
      <div className="flex justify-between items-center">
        {showValue && (
          <div className="flex items-center gap-2">
            <div 
              className={cn(
                "flex-shrink-0 w-1.5 h-1.5 rounded-full",
                percentage < 33 ? "bg-blue-500" : percentage < 66 ? "bg-indigo-500" : "bg-violet-600"
              )}
            />
            <span className="text-xs font-medium text-slate-700">
              {Math.round(percentage)}%
            </span>
          </div>
        )}
      </div>
      <div 
        className={cn(
          "relative overflow-hidden rounded-full bg-slate-100",
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {/* 进度条 */}
        <div 
          className={cn(
            "h-full rounded-full bg-gradient-to-r transition-all enhanced-progress-bar",
            getProgressColor(),
            showAnimation ? "enhanced-progress-container" : ""
          )}
          style={{ width: `${percentage}%` }}
        >
          {/* 光泽效果 */}
          {showAnimation && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          )}
        </div>
        
        {/* 进度段标记 */}
        {showSegmentMarkers && (
          <div className="absolute top-0 bottom-0 left-0 right-0 flex">
            <div className="h-full w-1/4 border-r border-slate-200/30"></div>
            <div className="h-full w-1/4 border-r border-slate-200/30"></div>
            <div className="h-full w-1/4 border-r border-slate-200/30"></div>
            <div className="h-full w-1/4"></div>
          </div>
        )}
      </div>
      
      {/* 进度段标签 */}
      {showSegmentLabels && (
        <div className={cn("flex pt-0.5 px-0.5", sizeStyles[size])}>
          <div className="w-1/4 text-center">25%</div>
          <div className="w-1/4 text-center">50%</div>
          <div className="w-1/4 text-center">75%</div>
          <div className="w-1/4 text-center">100%</div>
        </div>
      )}
    </div>
  )
} 