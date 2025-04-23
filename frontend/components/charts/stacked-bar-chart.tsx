"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts/core"
import { BarChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"

// 注册必要的组件
echarts.use([TitleComponent, TooltipComponent, LegendComponent, GridComponent, BarChart, CanvasRenderer])

interface StackedBarChartProps {
  data: Array<{
    name: string
    正常完成: number
    延期完成: number
    超期完成: number
  }>
  colors?: {
    正常完成: string
    延期完成: string
    超期完成: string
  }
  layout?: {
    barCategoryGap?: string
    margin?: {
      top?: number
      right?: number
      left?: number
      bottom?: number
    }
  }
}

// 默认颜色配置
const defaultColors = {
  正常完成: "#4ade80",
  延期完成: "#facc15",
  超期完成: "#f87171",
}

// 默认布局配置
const defaultLayout = {
  barCategoryGap: "30%",
  margin: {
    top: 30,
    right: 30,
    left: 30,
    bottom: 30,
  },
}

export default function StackedBarChart({ data, colors = defaultColors, layout = defaultLayout }: StackedBarChartProps) {
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

    // 准备数据
    const categories = data.map((item) => item.name)
    const series = [
      {
        name: "正常完成",
        type: "bar",
        stack: "total",
        emphasis: {
          focus: "series",
        },
        data: data.map((item) => item.正常完成),
        itemStyle: {
          color: colors.正常完成,
        },
      },
      {
        name: "延期完成",
        type: "bar",
        stack: "total",
        emphasis: {
          focus: "series",
        },
        data: data.map((item) => item.延期完成),
        itemStyle: {
          color: colors.延期完成,
        },
      },
      {
        name: "超期完成",
        type: "bar",
        stack: "total",
        emphasis: {
          focus: "series",
        },
        data: data.map((item) => item.超期完成),
        itemStyle: {
          color: colors.超期完成,
        },
      },
    ]

    const finalLayout = {
      ...defaultLayout,
      ...layout,
      margin: {
        ...defaultLayout.margin,
        ...layout.margin,
      },
    }

    // 设置图表选项
    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderWidth: 0,
        borderRadius: 8,
        padding: [8, 12],
        textStyle: {
          color: "#1f2937",
        },
        extraCssText: "box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);",
      },
      legend: {
        data: ["正常完成", "延期完成", "超期完成"],
        top: finalLayout.margin.top,
        right: finalLayout.margin.right,
        itemWidth: 12,
        itemHeight: 12,
        itemGap: 16,
        textStyle: {
          color: "#6b7280",
          fontSize: 12,
        },
      },
      grid: {
        top: finalLayout.margin.top + 40,
        right: finalLayout.margin.right,
        bottom: finalLayout.margin.bottom,
        left: finalLayout.margin.left,
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: categories,
        axisLine: {
          lineStyle: {
            color: "#e5e7eb",
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: "#6b7280",
          fontSize: 12,
        },
      },
      yAxis: {
        type: "value",
        name: "项目数量",
        nameTextStyle: {
          color: "#6b7280",
          fontSize: 12,
          padding: [0, 0, 0, 30],
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            color: "#e5e7eb",
            type: "dashed",
          },
        },
        axisLabel: {
          color: "#6b7280",
          fontSize: 12,
        },
      },
      series: series,
      barCategoryGap: finalLayout.barCategoryGap,
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
  }, [data, colors, layout])

  return <div ref={chartRef} style={{ width: "100%", height: "100%" }} />
}

