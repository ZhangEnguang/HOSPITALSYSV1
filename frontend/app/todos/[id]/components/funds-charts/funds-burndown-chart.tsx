"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts/core"
import { LineChart } from "echarts/charts"
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  MarkLineComponent,
  MarkPointComponent,
} from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"
import type { EChartsOption } from "echarts"

// 注册必要的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  LineChart,
  CanvasRenderer,
  MarkLineComponent,
  MarkPointComponent,
])

interface FundsTrendData {
  date: string
  planned: number
  actual: number
  remaining: number
}

interface FundsBurndownChartProps {
  data: FundsTrendData[]
}

export default function FundsBurndownChart({ data }: FundsBurndownChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // 如果已经有实例，先销毁
    if (chartInstance.current) {
      chartInstance.current.dispose()
    }

    // 创建新实例，添加延迟以确保容器尺寸已计算
    setTimeout(() => {
      if (!chartRef.current) return
      chartInstance.current = echarts.init(chartRef.current)

      // 准备数据
      const dates = data.map((item) => item.date)
      const plannedData = data.map((item) => item.planned)
      const actualData = data.map((item) => item.actual)
      const remainingData = data.map((item) => item.remaining)

      // 设置图表选项
      const option: EChartsOption = {
        tooltip: {
          trigger: "axis",
          formatter: (params: any) => {
            let result = params[0].name + "<br/>"
            params.forEach((param: any) => {
              // 使用不同颜色标记不同系列
              result += param.marker + " " + param.seriesName + ": ¥" + param.value.toLocaleString() + "<br/>"
            })
            return result
          },
        },
        legend: {
          data: ["计划支出", "实际支出", "剩余经费"],
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
          data: dates,
        },
        yAxis: {
          type: "value",
          name: "金额 (元)",
          axisLabel: {
            formatter: (value: number) => {
              if (value >= 1000000) {
                return (value / 1000000).toFixed(1) + "M"
              } else if (value >= 1000) {
                return (value / 1000).toFixed(1) + "K"
              }
              return value
            },
          },
        },
        series: [
          {
            name: "计划支出",
            type: "line",
            data: plannedData,
            smooth: true,
            lineStyle: {
              width: 3,
              type: "dashed",
            },
            itemStyle: {
              color: "#4361ee",
            },
            symbol: "circle",
            symbolSize: 8,
          },
          {
            name: "实际支出",
            type: "line",
            data: actualData,
            smooth: true,
            lineStyle: {
              width: 3,
            },
            itemStyle: {
              color: "#f72585",
            },
            symbol: "circle",
            symbolSize: 8,
            markPoint: {
              data: [
                { type: "max", name: "最大值" },
                { type: "min", name: "最小值" },
              ],
            },
          },
          {
            name: "剩余经费",
            type: "line",
            data: remainingData,
            smooth: true,
            lineStyle: {
              width: 3,
            },
            itemStyle: {
              color: "#4cc9f0",
            },
            symbol: "circle",
            symbolSize: 8,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(76, 201, 240, 0.3)",
                },
                {
                  offset: 1,
                  color: "rgba(76, 201, 240, 0.1)",
                },
              ]),
            },
            markLine: {
              data: [{ type: "average", name: "平均值" }],
            },
          },
        ],
      }

      // 渲染图表
      chartInstance.current.setOption(option)
    }, 100)

    // 响应窗口大小变化
    const handleResize = () => {
      if (chartInstance.current) {
        chartInstance.current.resize()
      }
    }
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (chartInstance.current) {
        chartInstance.current.dispose()
      }
    }
  }, [data])

  return <div ref={chartRef} style={{ width: "100%", height: "100%", minHeight: "300px" }} />
}

