"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts/core"
import { PieChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, LegendComponent } from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"

// 注册必要的组件
echarts.use([TitleComponent, TooltipComponent, LegendComponent, PieChart, CanvasRenderer])

interface OverviewPieChartProps {
  data: Array<{
    name: string
    value: number
  }>
}

export default function OverviewPieChart({ data }: OverviewPieChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // 如果已经有实例，先销毁
    if (chartInstance.current) {
      chartInstance.current.dispose()
    }

    // 创建新实例
    chartInstance.current = echarts.init(chartRef.current)

    const option = {
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)",
        confine: true,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        borderWidth: 0,
        textStyle: {
          color: "#fff",
        },
        extraCssText: "box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15); border-radius: 8px;",
      },
      legend: {
        orient: "vertical",
        right: 10,
        top: "center",
        data: data.map(item => item.name)
      },
      series: [
        {
          name: "项目进度",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 8,
            borderColor: "#fff",
            borderWidth: 2
          },
          label: {
            show: false,
            position: "center"
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "14",
              fontWeight: "bold"
            }
          },
          labelLine: {
            show: false
          },
          data: data,
          colorBy: "data"
        }
      ],
      animation: true,
      animationThreshold: 2000,
      animationDuration: 1000,
      animationEasing: "cubicOut",
      animationDelay: (idx) => idx * 100
    }

    // 渲染图表
    chartInstance.current.setOption(option)

    // 响应窗口大小变化
    const handleResize = () => {
      chartInstance.current?.resize()
    }
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      chartInstance.current?.dispose()
    }
  }, [data])

  return <div ref={chartRef} style={{ width: "100%", height: "100%" }} />
} 