"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts/core"
import { BarChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"

// 注册必要的组件
echarts.use([TitleComponent, TooltipComponent, LegendComponent, GridComponent, BarChart, CanvasRenderer])

interface OverviewBarChartProps {
  data: Array<{
    month: string
    已完成: number
    进行中: number
    逾期: number
  }>
}

export default function OverviewBarChart({ data }: OverviewBarChartProps) {
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
    const months = data.map((item) => item.month)

    // 设置图表选项
    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        },
        confine: true,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        borderWidth: 0,
        textStyle: {
          color: "#fff",
        },
        extraCssText: "box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15); border-radius: 8px;",
      },
      legend: {
        data: ["已完成", "进行中", "逾期"],
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: months,
      },
      yAxis: {
        type: "value",
        name: "任务数量"
      },
      series: [
        {
          name: "已完成",
          type: "bar",
          data: data.map((item) => item.已完成),
          itemStyle: {
            color: "#4caf50"
          }
        },
        {
          name: "进行中",
          type: "bar",
          data: data.map((item) => item.进行中),
          itemStyle: {
            color: "#2196f3"
          }
        },
        {
          name: "逾期",
          type: "bar",
          data: data.map((item) => item.逾期),
          itemStyle: {
            color: "#f44336"
          }
        }
      ]
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