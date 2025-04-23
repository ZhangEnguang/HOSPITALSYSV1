"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts/core"
import { RadarChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"

// 注册必要的组件
echarts.use([TitleComponent, TooltipComponent, LegendComponent, GridComponent, RadarChart, CanvasRenderer])

interface RadarChartProps {
  data: Array<{
    subject: string
    优秀: number
    合格: number
    整改: number
  }>
}

export default function RadarChartComponent({ data }: RadarChartProps) {
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

    // 准备雷达图指标
    const indicator = data.map((item) => ({
      name: item.subject,
      max: 100,
    }))

    // 准备系列数据
    const seriesData = [
      {
        value: data.map((item) => item.优秀),
        name: "优秀",
      },
      {
        value: data.map((item) => item.合格),
        name: "合格",
      },
      {
        value: data.map((item) => item.整改),
        name: "整改",
      },
    ]

    // 设置图表选项
    const option = {
      tooltip: {
        trigger: "item",
      },
      legend: {
        data: ["优秀", "合格", "整改"],
        bottom: 0,
      },
      radar: {
        indicator: indicator,
        radius: "65%",
      },
      series: [
        {
          type: "radar",
          data: seriesData,
          areaStyle: {},
          color: ["#4ade80", "#facc15", "#f87171"],
        },
      ],
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

