"use client"

import React, { useRef, useEffect } from "react"
import * as echarts from "echarts"

interface ProjectLevelData {
  level: string
  项目数量: number
  总经费: number
  平均经费: number
}

interface ProjectLevelStatisticsChartProps {
  data?: ProjectLevelData[]
}

export default function ProjectLevelStatisticsChart({ data }: ProjectLevelStatisticsChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)

  // 默认数据
  const defaultData: ProjectLevelData[] = [
    { level: "国家级", 项目数量: 28, 总经费: 1560, 平均经费: 55.7 },
    { level: "省部级", 项目数量: 45, 总经费: 890, 平均经费: 19.8 },
    { level: "市级", 项目数量: 62, 总经费: 520, 平均经费: 8.4 },
    { level: "校级", 项目数量: 85, 总经费: 280, 平均经费: 3.3 },
    { level: "横向", 项目数量: 38, 总经费: 420, 平均经费: 11.1 }
  ]

  const chartData = data || defaultData

  useEffect(() => {
    if (!chartRef.current) return

    // 如果已经有实例，先销毁
    if (chartInstance.current) {
      chartInstance.current.dispose()
    }

    // 创建新实例
    chartInstance.current = echarts.init(chartRef.current)

    // 准备数据
    const levels = chartData.map((item) => item.level)
    const projectCounts = chartData.map((item) => item.项目数量)
    const totalFunding = chartData.map((item) => item.总经费)
    const avgFunding = chartData.map((item) => item.平均经费)

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
        formatter: function(params: any) {
          let result = `<div style="font-weight: bold; margin-bottom: 8px;">${params[0].axisValue}</div>`
          params.forEach((param: any) => {
            const color = param.color
            const value = param.value
            const name = param.seriesName
            let displayValue = value
            let unit = ""
            
            if (name === "项目数量") {
              unit = "项"
            } else if (name === "总经费") {
              unit = "万元"
            } else if (name === "平均经费") {
              unit = "万元"
            }
            
            result += `<div style="display: flex; align-items: center; margin: 4px 0;">
              <span style="display: inline-block; width: 10px; height: 10px; background: ${color}; margin-right: 8px; border-radius: 2px;"></span>
              <span style="flex: 1;">${name}:</span>
              <span style="font-weight: bold;">${displayValue}${unit}</span>
            </div>`
          })
          return result
        }
      },
      legend: {
        data: ["项目数量", "总经费", "平均经费"],
        bottom: "bottom",
        itemWidth: 12,
        itemHeight: 8,
        itemGap: 20,
        textStyle: {
          fontSize: 12,
          color: "#666"
        }
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "15%",
        top: "8%",
        containLabel: true
      },
      xAxis: [
        {
          type: "category",
          data: levels,
          axisPointer: {
            type: "shadow"
          },
          axisLabel: {
            fontSize: 11,
            color: "#666",
            interval: 0
          }
        }
      ],
      yAxis: [
        {
          type: "value",
          name: "项目数量",
          min: 0,
          interval: 20,
          axisLabel: {
            formatter: "{value} 项",
            fontSize: 11,
            color: "#666"
          },
          splitLine: {
            lineStyle: {
              color: "#f0f0f0"
            }
          }
        },
        {
          type: "value",
          name: "经费(万元)",
          min: 0,
          interval: 400,
          axisLabel: {
            formatter: "{value} 万",
            fontSize: 11,
            color: "#666"
          },
          splitLine: {
            show: false
          }
        }
      ],
      series: [
        {
          name: "项目数量",
          type: "bar",
          data: projectCounts,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#246EFF" },
              { offset: 1, color: "#246EFF80" }
            ]),
            borderRadius: [4, 4, 0, 0]
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#246EFF" },
                { offset: 1, color: "#246EFF60" }
              ])
            }
          }
        },
        {
          name: "总经费",
          type: "bar",
          yAxisIndex: 1,
          data: totalFunding,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#00B2FF" },
              { offset: 1, color: "#00B2FF80" }
            ]),
            borderRadius: [4, 4, 0, 0]
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#00B2FF" },
                { offset: 1, color: "#00B2FF60" }
              ])
            }
          }
        },
        {
          name: "平均经费",
          type: "line",
          yAxisIndex: 1,
          data: avgFunding,
          smooth: true,
          lineStyle: {
            width: 3,
            color: "#73D13D"
          },
          symbol: "circle",
          symbolSize: 8,
          itemStyle: {
            color: "#73D13D"
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#73D13D40" },
              { offset: 1, color: "#73D13D10" }
            ])
          }
        }
      ],
      animation: true,
      animationDuration: 1000,
      animationEasing: "cubicOut" as const
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
  }, [chartData])

  return <div ref={chartRef} style={{ width: "100%", height: "100%" }} />
} 