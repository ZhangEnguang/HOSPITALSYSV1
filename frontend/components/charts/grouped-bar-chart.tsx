"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts/core"
import { BarChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"

// 注册必要的组件
echarts.use([TitleComponent, TooltipComponent, LegendComponent, GridComponent, BarChart, CanvasRenderer])

interface GroupedBarChartProps {
  data: Array<{
    year: string
    论文: number
    专利: number
    奖项: number
    著作: number
  }>
}

export default function GroupedBarChart({ data }: GroupedBarChartProps) {
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
          type: "shadow",
        },
        formatter: (params: any) => {
          let result = params[0].name + "年<br/>"
          params.forEach((param: any) => {
            result += `${param.marker} ${param.seriesName}: ${param.value} 项<br/>`
          })
          return result
        },
      },
      legend: {
        data: ["论文", "专利", "奖项", "著作"],
        top: 0,
        textStyle: {
          fontSize: 12,
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        top: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: years,
        axisLabel: {
          fontSize: 12,
        },
      },
      yAxis: {
        type: "value",
        name: "数量",
        nameTextStyle: {
          fontSize: 12,
        },
        axisLabel: {
          fontSize: 12,
        },
      },
      series: [
        {
          name: "论文",
          type: "bar",
          barMaxWidth: 35,
          itemStyle: {
            color: "#4361ee",
          },
          emphasis: {
            focus: "series",
          },
          data: data.map((item) => item.论文),
        },
        {
          name: "专利",
          type: "bar",
          barMaxWidth: 35,
          itemStyle: {
            color: "#3a0ca3",
          },
          emphasis: {
            focus: "series",
          },
          data: data.map((item) => item.专利),
        },
        {
          name: "奖项",
          type: "bar",
          barMaxWidth: 35,
          itemStyle: {
            color: "#7209b7",
          },
          emphasis: {
            focus: "series",
          },
          data: data.map((item) => item.奖项),
        },
        {
          name: "著作",
          type: "bar",
          barMaxWidth: 35,
          itemStyle: {
            color: "#f72585",
          },
          emphasis: {
            focus: "series",
          },
          data: data.map((item) => item.著作),
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

