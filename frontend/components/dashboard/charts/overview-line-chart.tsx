"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts/core"
import { LineChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"

// 注册必要的组件
echarts.use([TitleComponent, TooltipComponent, LegendComponent, GridComponent, LineChart, CanvasRenderer])

interface OverviewLineChartProps {
  data: Array<{
    month: string
    申请经费: number
    到账经费: number
    使用经费: number
  }>
}

export default function OverviewLineChart({ data }: OverviewLineChartProps) {
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
          type: "cross",
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
        data: ["申请经费", "到账经费", "使用经费"],
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: months,
      },
      yAxis: {
        type: "value",
        name: "金额 (元)",
        axisLabel: {
          formatter: (value: number) => {
            if (value >= 10000000) {
              return (value / 10000000).toFixed(1) + "千万"
            } else if (value >= 10000) {
              return (value / 10000).toFixed(1) + "万"
            }
            return value
          },
        },
      },
      series: [
        {
          name: "申请经费",
          type: "line",
          data: data.map((item) => item.申请经费),
          smooth: true,
          lineStyle: {
            width: 3,
          },
          itemStyle: {
            color: "#4361ee",
          },
        },
        {
          name: "到账经费",
          type: "line",
          data: data.map((item) => item.到账经费),
          smooth: true,
          lineStyle: {
            width: 3,
          },
          itemStyle: {
            color: "#3a0ca3",
          },
        },
        {
          name: "使用经费",
          type: "line",
          data: data.map((item) => item.使用经费),
          smooth: true,
          lineStyle: {
            width: 3,
          },
          itemStyle: {
            color: "#7209b7",
          },
        },
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