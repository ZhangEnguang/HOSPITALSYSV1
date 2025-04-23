"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts/core"
import { BarChart as EChartsBar } from "echarts/charts"
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"

// 注册必要的组件
echarts.use([TitleComponent, TooltipComponent, LegendComponent, GridComponent, EChartsBar, CanvasRenderer])

interface HorizontalBarChartProps {
  data: Array<{
    name: string
    value: number
  }>
}

export default function HorizontalBarChart({ data }: HorizontalBarChartProps) {
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
    const values = data.map((item) => item.value)

    // 设置图表选项
    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        },
        formatter: function(params) {
          return `${params[0].name}: ${params[0].value}%`
        }
      },
      grid: {
        left: "3%",
        right: "8%",
        bottom: "3%",
        top: "3%",
        containLabel: true
      },
      xAxis: {
        type: "value",
        name: "百分比",
        axisLabel: {
          formatter: "{value}%"
        }
      },
      yAxis: {
        type: "category",
        data: categories,
        inverse: true,
        axisLabel: {
          margin: 20
        }
      },
      series: [
        {
          name: "支出占比",
          type: "bar",
          data: values,
          label: {
            show: true,
            position: "right",
            formatter: "{c}%"
          },
          itemStyle: {
            color: function(params) {
              const colorList = [
                "#4361ee", "#3a0ca3", "#7209b7", "#f72585", "#4cc9f0",
                "#4895ef", "#560bad", "#f15bb5", "#00bbf9", "#00f5d4"
              ];
              return colorList[params.dataIndex % colorList.length];
            }
          }
        }
      ]
    };

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

