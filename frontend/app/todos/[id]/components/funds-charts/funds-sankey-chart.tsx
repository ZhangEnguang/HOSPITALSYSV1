"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts/core"
import { SankeyChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, LegendComponent } from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"
import type { EChartsOption } from "echarts"

// 注册必要的组件
echarts.use([TitleComponent, TooltipComponent, LegendComponent, SankeyChart, CanvasRenderer])

interface SankeyNode {
  name: string
}

interface SankeyLink {
  source: string
  target: string
  value: number
}

interface FundsSankeyChartProps {
  data: {
    nodes: SankeyNode[]
    links: SankeyLink[]
  }
}

export default function FundsSankeyChart({ data }: FundsSankeyChartProps) {
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

      // 设置图表选项
      const option: EChartsOption = {
        tooltip: {
          trigger: "item",
          triggerOn: "mousemove",
          formatter: (params: any) => {
            const { data } = params
            return `${data.source} → ${data.target}: ¥${data.value.toLocaleString()}`
          },
        },
        series: [
          {
            type: "sankey",
            data: data.nodes,
            links: data.links,
            emphasis: {
              focus: "adjacency",
            },
            lineStyle: {
              color: "gradient",
              curveness: 0.5,
            },
            label: {
              fontSize: 12,
            },
            itemStyle: {
              borderWidth: 1,
              borderColor: "#aaa",
            },
            levels: [
              {
                depth: 0,
                itemStyle: {
                  color: "#4361ee",
                },
              },
              {
                depth: 1,
                itemStyle: {
                  color: "#3a0ca3",
                },
              },
              {
                depth: 2,
                itemStyle: {
                  color: "#7209b7",
                },
              },
              {
                depth: 3,
                itemStyle: {
                  color: "#f72585",
                },
              },
            ],
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

