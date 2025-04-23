"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts/core"
import { LineChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"

// 注册必要的组件
echarts.use([TitleComponent, TooltipComponent, LegendComponent, GridComponent, LineChart, CanvasRenderer])

interface StackedAreaChartProps {
  data: Array<{
    year: string
    论文: number
    专利: number
    奖项: number
    著作: number
  }>
}

export default function StackedAreaChartComponent({ data }: StackedAreaChartProps) {
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
    const years = data.map((item) => item.year)

    // 设置图表选项
    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#6a7985",
          },
        },
      },
      legend: {
        data: ["论文", "专利", "奖项", "著作"],
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
        data: years,
      },
      yAxis: {
        type: "value",
        name: "数量",
      },
      series: [
        {
          name: "论文",
          type: "line",
          stack: "总量",
          areaStyle: {},
          emphasis: {
            focus: "series",
          },
          data: data.map((item) => item.论文),
          itemStyle: {
            color: "#4361ee",
          },
        },
        {
          name: "专利",
          type: "line",
          stack: "总量",
          areaStyle: {},
          emphasis: {
            focus: "series",
          },
          data: data.map((item) => item.专利),
          itemStyle: {
            color: "#3a0ca3",
          },
        },
        {
          name: "奖项",
          type: "line",
          stack: "总量",
          areaStyle: {},
          emphasis: {
            focus: "series",
          },
          data: data.map((item) => item.奖项),
          itemStyle: {
            color: "#7209b7",
          },
        },
        {
          name: "著作",
          type: "line",
          stack: "总量",
          areaStyle: {},
          emphasis: {
            focus: "series",
          },
          data: data.map((item) => item.著作),
          itemStyle: {
            color: "#f72585",
          },
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

