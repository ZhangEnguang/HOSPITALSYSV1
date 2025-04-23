"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts/core"
import { BarChart, LineChart } from "echarts/charts"
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  MarkLineComponent,
  MarkPointComponent,
} from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"

// 注册必要的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  BarChart,
  LineChart,
  MarkLineComponent,
  MarkPointComponent,
  CanvasRenderer,
])

interface LineBarChartProps {
  data: Array<{
    year: string
    论文: number
    专利: number
    奖项: number
    著作: number
  }>
}

export default function LineBarChart({ data }: LineBarChartProps) {
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

    // 计算总量
    const totals = data.map((item) => item.论文 + item.专利 + item.奖项 + item.著作)

    // 设置图表选项
    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          crossStyle: {
            color: "#999",
          },
        },
        formatter: (params: any) => {
          let result = params[0].name + "年<br/>"
          // 先处理柱状图数据
          const barParams = params.filter((param: any) => param.seriesType === "bar")
          barParams.forEach((param: any) => {
            result += `${param.marker} ${param.seriesName}: ${param.value} 项<br/>`
          })

          // 再处理折线图数据
          const lineParams = params.filter((param: any) => param.seriesType === "line")
          lineParams.forEach((param: any) => {
            result += `${param.marker} ${param.seriesName}: ${param.value} 项<br/>`
          })

          return result
        },
      },
      legend: {
        data: ["论文", "专利", "奖项", "著作", "总量"],
        top: 0,
        selected: {
          总量: true,
          论文: true,
          专利: true,
          奖项: true,
          著作: true,
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        top: "15%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: years,
          axisPointer: {
            type: "shadow",
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          name: "数量",
          min: 0,
          interval: 10,
          axisLabel: {
            formatter: "{value} 项",
          },
        },
        {
          type: "value",
          name: "总量",
          min: 0,
          interval: 20,
          axisLabel: {
            formatter: "{value} 项",
          },
          show: false,
        },
      ],
      series: [
        {
          name: "论文",
          type: "bar",
          barMaxWidth: 30,
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
          barMaxWidth: 30,
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
          barMaxWidth: 30,
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
          barMaxWidth: 30,
          itemStyle: {
            color: "#f72585",
          },
          emphasis: {
            focus: "series",
          },
          data: data.map((item) => item.著作),
        },
        {
          name: "总量",
          type: "line",
          yAxisIndex: 0,
          symbol: "circle",
          symbolSize: 8,
          itemStyle: {
            color: "#fb8500",
          },
          lineStyle: {
            width: 3,
          },
          emphasis: {
            focus: "series",
          },
          markPoint: {
            data: [{ type: "max", name: "最大值" }],
          },
          data: totals,
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

