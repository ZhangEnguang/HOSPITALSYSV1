"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import * as echarts from "echarts/core"
import { PieChart as EChartsPie } from "echarts/charts"
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"

// 注册必要的组件
echarts.use([TitleComponent, TooltipComponent, LegendComponent, GridComponent, EChartsPie, CanvasRenderer])

// 指定颜色，与project-status-chart保持一致的配色方案
const colors = ["#F97F7F", "#8AD7FC", "#7275F2", "#92F1B4"]

interface PieChartProps {
  data: {
    discipline: Array<{ name: string; value: number }>
    department: Array<{ name: string; value: number }>
    level: Array<{ name: string; value: number }>
  }
  type?: "discipline" | "department" | "level"
}

export default function PieChart({ data, type = "discipline" }: PieChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)
  const [chartType, setChartType] = useState<"discipline" | "department" | "level">(type)

  // 使用 useCallback 包裹 updateChart
  const updateChart = useCallback(() => {
    if (!chartInstance.current) return

    const currentData = data[chartType]
    const option = {
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} ({d}%)"
      },
      legend: {
        bottom: 'bottom',
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 20,
        textStyle: {
          fontSize: 12,
          color: '#666'
        }
      },
      series: [
        {
          name: getSeriesName(),
          type: "pie",
          radius: ["40%", "65%"],
          center: ['50%', '45%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 4,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: false
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: currentData.map((item, index) => ({
            ...item,
            itemStyle: {
              color: colors[index % colors.length]
            }
          }))
        },
      ],
      animation: true,
      animationThreshold: 2000,
      animationDuration: 1000,
      animationEasing: "cubicOut" as const,
      animationDelay: (idx: number) => idx * 100,
      animationDurationUpdate: 1000,
      animationEasingUpdate: "cubicOut" as const,
      animationDelayUpdate: (idx: number) => idx * 100,
    }

    chartInstance.current.setOption(option)
  }, [chartType, data])

  // 初始化图表
  useEffect(() => {
    if (!chartRef.current) return

    // 如果已经有实例，先销毁
    if (chartInstance.current) {
      chartInstance.current.dispose()
    }

    // 创建新实例
    chartInstance.current = echarts.init(chartRef.current)

    // 更新图表
    updateChart()

    // 响应窗口大小变化
    const handleResize = () => {
      chartInstance.current?.resize()
    }
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      chartInstance.current?.dispose()
    }
  }, [updateChart])

  // 监听图表类型变化
  useEffect(() => {
    updateChart()
  }, [chartType, updateChart])

  // 监听自定义事件
  useEffect(() => {
    const handleTypeChange = (e: CustomEvent) => {
      setChartType(e.detail as "discipline" | "department" | "level")
    }

    document.addEventListener("changeChartType", handleTypeChange as EventListener)

    return () => {
      document.removeEventListener("changeChartType", handleTypeChange as EventListener)
    }
  }, [])

  // 获取系列名称
  const getSeriesName = () => {
    switch (chartType) {
      case "discipline":
        return "按学科分布"
      case "department":
        return "按单位分布"
      case "level":
        return "按项目级别分布"
      default:
        return ""
    }
  }

  return <div ref={chartRef} style={{ width: "100%", height: "100%" }} />
}

