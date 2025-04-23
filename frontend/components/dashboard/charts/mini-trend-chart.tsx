"use client"

import { useEffect, useState, useRef } from "react"
import { AreaChart, Area, ResponsiveContainer } from "recharts"

interface MiniTrendChartProps {
  data: Array<{ value: number }>
  color: string
  height?: number
  animated?: boolean
}

export const MiniTrendChart = ({ data, color, height = 40, animated = true }: MiniTrendChartProps) => {
  const animationRef = useRef<number | null>(null)
  const [animationProgress, setAnimationProgress] = useState(animated ? 0 : 1)

  useEffect(() => {
    if (!animated) return

    let startTime: number
    const duration = 1500

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)

      setAnimationProgress(progress)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [animated])

  // 计算动画中应该显示的数据点数量
  const dataPoints = data.length
  const visiblePoints = Math.ceil(dataPoints * animationProgress)
  const animatedData = data.slice(0, visiblePoints)

  // 创建唯一的渐变ID
  const gradientId = `colorGradient-${color.replace("#", "")}-${Math.random().toString(36).substr(2, 9)}`

  return (
    <div style={{ height: `${height}px`, width: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={animatedData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.6} />
              <stop offset="95%" stopColor={color} stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

