"use client"

import { useEffect, useRef } from "react"
import * as echarts from "echarts/core"
import { BarChart, LineChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent } from "echarts/components"
import { CanvasRenderer } from "echarts/renderers"

// 注册必要的组件
echarts.use([TitleComponent, TooltipComponent, GridComponent, LegendComponent, BarChart, LineChart, CanvasRenderer])

// 数据看板专用颜色方案
const dashboardColors = ["#246EFF", "#00B2FF", "#73D13D"]

export default function DashboardProjectLevelStatisticsChart() {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    if (chartInstance.current) {
      chartInstance.current.dispose()
    }

    chartInstance.current = echarts.init(chartRef.current)

    // 数据看板专用数据
    const dashboardData = [
      { level: "国家级", 项目数量: 28, 总经费: 1560, 平均经费: 55.7 },
      { level: "省部级", 项目数量: 45, 总经费: 890, 平均经费: 19.8 },
      { level: "市级", 项目数量: 62, 总经费: 520, 平均经费: 8.4 },
      { level: "校级", 项目数量: 85, 总经费: 280, 平均经费: 3.3 },
      { level: "横向", 项目数量: 38, 总经费: 420, 平均经费: 11.1 }
    ]

    const levels = dashboardData.map((item) => item.level)
    const projectCounts = dashboardData.map((item) => item.项目数量)
    const totalFunding = dashboardData.map((item) => item.总经费)
    const avgFunding = dashboardData.map((item) => item.平均经费)

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
              { offset: 0, color: dashboardColors[0] },
              { offset: 1, color: dashboardColors[0] + "80" }
            ]),
            borderRadius: [4, 4, 0, 0]
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: dashboardColors[0] },
                { offset: 1, color: dashboardColors[0] + "60" }
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
              { offset: 0, color: dashboardColors[1] },
              { offset: 1, color: dashboardColors[1] + "80" }
            ]),
            borderRadius: [4, 4, 0, 0]
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: dashboardColors[1] },
                { offset: 1, color: dashboardColors[1] + "60" }
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
            color: dashboardColors[2]
          },
          symbol: "circle",
          symbolSize: 8,
          itemStyle: {
            color: dashboardColors[2]
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: dashboardColors[2] + "40" },
              { offset: 1, color: dashboardColors[2] + "10" }
            ])
          }
        }
      ],
      animation: true,
      animationDuration: 1000,
      animationEasing: "cubicOut" as const
    }

    chartInstance.current.setOption(option)

    const handleResize = () => {
      chartInstance.current?.resize()
    }
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      chartInstance.current?.dispose()
    }
  }, [])

  return <div ref={chartRef} style={{ width: "100%", height: "100%" }} />
} 